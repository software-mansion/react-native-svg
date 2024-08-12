//
// Copyright (c) 2019-2023 Ruben Perez Hidalgo (rubenperez038 at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_MYSQL_IMPL_INTERNAL_CHANNEL_MESSAGE_READER_HPP
#define BOOST_MYSQL_IMPL_INTERNAL_CHANNEL_MESSAGE_READER_HPP

#include <boost/mysql/client_errc.hpp>
#include <boost/mysql/error_code.hpp>

#include <boost/mysql/detail/any_stream.hpp>

#include <boost/mysql/impl/internal/channel/message_parser.hpp>
#include <boost/mysql/impl/internal/channel/read_buffer.hpp>
#include <boost/mysql/impl/internal/channel/valgrind.hpp>
#include <boost/mysql/impl/internal/protocol/constants.hpp>

#include <boost/asio/async_result.hpp>
#include <boost/asio/buffer.hpp>
#include <boost/asio/compose.hpp>
#include <boost/asio/coroutine.hpp>
#include <boost/asio/post.hpp>
#include <boost/assert.hpp>

#include <cstddef>
#include <cstdint>

namespace boost {
namespace mysql {
namespace detail {

class message_reader
{
public:
    message_reader(std::size_t initial_buffer_size, std::size_t max_frame_size = MAX_PACKET_SIZE)
        : buffer_(initial_buffer_size), parser_(max_frame_size)
    {
    }

    bool has_message() const noexcept { return result_.has_message; }

    span<const std::uint8_t> get_next_message(std::uint8_t& seqnum, error_code& ec) noexcept
    {
        {
            BOOST_ASSERT(has_message());
            if (result_.message.has_seqnum_mismatch || seqnum != result_.message.seqnum_first)
            {
                ec = make_error_code(client_errc::sequence_number_mismatch);
                return {};
            }
            seqnum = result_.message.seqnum_last + 1;
            span<const std::uint8_t> res(
                buffer_.current_message_first() - result_.message.size,
                result_.message.size
            );
            parse_message();
            ec = error_code();
            return res;
        }
    }

    // Reads some messages from stream, until there is at least one
    // or an error happens. On success, has_message() returns true
    // and get_next_message() returns the parsed message.
    // May relocate the buffer, modifying buffer_first().
    // The reserved area bytes will be removed before the actual read.
    void read_some(any_stream& stream, error_code& ec)
    {
        // If we already have a message, complete immediately
        if (has_message())
        {
            ec = error_code();
            return;
        }

        // Remove processed messages
        buffer_.remove_reserved();

        while (!has_message())
        {
            // If any previous process_message indicated that we need more
            // buffer space, resize the buffer now
            maybe_resize_buffer();

            // Actually read bytes
            std::size_t bytes_read = stream.read_some(free_area(), ec);
            if (ec)
                break;
            valgrind_make_mem_defined(buffer_.free_first(), bytes_read);

            // Process them
            on_read_bytes(bytes_read);
        }
    }

    template <BOOST_ASIO_COMPLETION_TOKEN_FOR(void(::boost::mysql::error_code)) CompletionToken>
    BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code))
    async_read_some(any_stream& stream, CompletionToken&& token);

    // Exposed for the sake of testing
    read_buffer& buffer() noexcept { return buffer_; }
    const read_buffer& buffer() const noexcept { return buffer_; }

private:
    struct read_some_op;

    read_buffer buffer_;
    message_parser parser_;
    message_parser::result result_;

    void parse_message() { parser_.parse_message(buffer_, result_); }

    void maybe_resize_buffer()
    {
        if (!result_.has_message)
        {
            buffer_.grow_to_fit(result_.required_size);
        }
    }

    void on_read_bytes(size_t num_bytes)
    {
        buffer_.move_to_pending(num_bytes);
        parse_message();
    }

    asio::mutable_buffer free_area() noexcept
    {
        auto res = buffer_.free_area();
        return asio::mutable_buffer(res.data(), res.size());
    }
};

struct boost::mysql::detail::message_reader::read_some_op : boost::asio::coroutine
{
    message_reader& reader_;
    any_stream& stream_;

    read_some_op(message_reader& reader, any_stream& stream) noexcept : reader_(reader), stream_(stream) {}

    template <class Self>
    void operator()(Self& self, error_code ec = {}, std::size_t bytes_read = 0)
    {
        // Error handling
        if (ec)
        {
            self.complete(ec);
            return;
        }

        // Non-error path
        BOOST_ASIO_CORO_REENTER(*this)
        {
            // If we already have a message, complete immediately
            if (reader_.has_message())
            {
                BOOST_ASIO_CORO_YIELD boost::asio::post(stream_.get_executor(), std::move(self));
                self.complete(error_code());
                BOOST_ASIO_CORO_YIELD break;
            }

            // Remove processed messages
            reader_.buffer_.remove_reserved();

            while (!reader_.has_message())
            {
                // If any previous process_message indicated that we need more
                // buffer space, resize the buffer now
                reader_.maybe_resize_buffer();

                // Actually read bytes
                BOOST_ASIO_CORO_YIELD stream_.async_read_some(reader_.free_area(), std::move(self));
                valgrind_make_mem_defined(reader_.buffer_.free_first(), bytes_read);

                // Process them
                reader_.on_read_bytes(bytes_read);
            }

            self.complete(error_code());
        }
    }
};

// Public interface
inline void read_some_messages(any_stream& stream, message_reader& reader, error_code& ec)
{
    return reader.read_some(stream, ec);
}

template <class CompletionToken>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code))
async_read_some_messages(any_stream& stream, message_reader& reader, CompletionToken&& token)
{
    return reader.async_read_some(stream, std::forward<CompletionToken>(token));
}

// Equivalent to read_some + get_next_message
inline span<const std::uint8_t> read_one_message(
    any_stream& stream,
    message_reader& reader,
    std::uint8_t& seqnum,
    error_code& ec
)
{
    read_some_messages(stream, reader, ec);
    if (ec)
        return {};
    else
        return reader.get_next_message(seqnum, ec);
}

struct read_one_message_op : boost::asio::coroutine
{
    message_reader& reader_;
    any_stream& stream_;
    std::uint8_t& seqnum_;

    read_one_message_op(message_reader& reader, any_stream& stream, std::uint8_t& seqnum)
        : reader_(reader), stream_(stream), seqnum_(seqnum)
    {
    }

    template <class Self>
    void operator()(Self& self, error_code code = {})
    {
        // Error handling
        if (code)
        {
            self.complete(code, span<const std::uint8_t>());
            return;
        }

        // Non-error path
        BOOST_ASIO_CORO_REENTER(*this)
        {
            BOOST_ASIO_CORO_YIELD reader_.async_read_some(stream_, std::move(self));
            {
                auto b = reader_.get_next_message(seqnum_, code);
                self.complete(code, b);
            }
        }
    }
};

template <class CompletionToken>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(
    CompletionToken,
    void(boost::mysql::error_code, ::boost::span<const std::uint8_t>)
)
async_read_one_message(
    any_stream& stream,
    message_reader& reader,
    std::uint8_t& seqnum,
    CompletionToken&& token
)
{
    return boost::asio::async_compose<CompletionToken, void(error_code, span<const std::uint8_t>)>(
        read_one_message_op(reader, stream, seqnum),
        token,
        stream
    );
}

}  // namespace detail
}  // namespace mysql
}  // namespace boost

template <BOOST_ASIO_COMPLETION_TOKEN_FOR(void(::boost::mysql::error_code)) CompletionToken>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(::boost::mysql::error_code))
boost::mysql::detail::message_reader::async_read_some(any_stream& stream, CompletionToken&& token)
{
    return boost::asio::async_compose<CompletionToken, void(error_code)>(
        read_some_op{*this, stream},
        token,
        stream
    );
}

#endif /* INCLUDE_BOOST_MYSQL_DETAIL_AUXILIAR_STATIC_STRING_HPP_ */
