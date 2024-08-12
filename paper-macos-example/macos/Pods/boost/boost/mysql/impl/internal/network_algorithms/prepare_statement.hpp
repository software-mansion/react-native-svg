//
// Copyright (c) 2019-2023 Ruben Perez Hidalgo (rubenperez038 at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_MYSQL_IMPL_INTERNAL_NETWORK_ALGORITHMS_PREPARE_STATEMENT_HPP
#define BOOST_MYSQL_IMPL_INTERNAL_NETWORK_ALGORITHMS_PREPARE_STATEMENT_HPP

#include <boost/mysql/diagnostics.hpp>
#include <boost/mysql/error_code.hpp>
#include <boost/mysql/statement.hpp>
#include <boost/mysql/string_view.hpp>

#include <boost/mysql/detail/access.hpp>
#include <boost/mysql/detail/config.hpp>

#include <boost/mysql/impl/internal/channel/channel.hpp>
#include <boost/mysql/impl/internal/protocol/protocol.hpp>

#include <cstdint>

namespace boost {
namespace mysql {
namespace detail {

class prepare_statement_processor
{
    channel& channel_;
    string_view stmt_sql_;
    diagnostics& diag_;
    statement res_;
    unsigned remaining_meta_{};

public:
    prepare_statement_processor(channel& chan, string_view stmt_sql, diagnostics& diag) noexcept
        : channel_(chan), stmt_sql_(stmt_sql), diag_(diag)
    {
    }

    void clear_diag() noexcept { diag_.clear(); }

    void process_request()
    {
        channel_.serialize(prepare_stmt_command{stmt_sql_}, channel_.reset_sequence_number());
    }

    void process_response(span<const std::uint8_t> message, error_code& err)
    {
        prepare_stmt_response response{};
        err = deserialize_prepare_stmt_response(message, channel_.flavor(), response, diag_);
        if (err)
            return;
        res_ = access::construct<statement>(response.id, response.num_params);
        remaining_meta_ = response.num_columns + response.num_params;
    }

    bool has_remaining_meta() const noexcept { return remaining_meta_ != 0; }
    void on_meta_received() noexcept { --remaining_meta_; }
    const statement& result() const noexcept { return res_; }
    channel& get_channel() noexcept { return channel_; }
};

struct prepare_statement_op : boost::asio::coroutine
{
    prepare_statement_processor processor_;

    prepare_statement_op(channel& chan, string_view stmt_sql, diagnostics& diag)
        : processor_(chan, stmt_sql, diag)
    {
    }

    channel& get_channel() noexcept { return processor_.get_channel(); }

    template <class Self>
    void operator()(Self& self, error_code err = {}, span<const std::uint8_t> read_message = {})
    {
        // Error checking
        if (err)
        {
            self.complete(err, statement());
            return;
        }

        // Regular coroutine body; if there has been an error, we don't get here
        BOOST_ASIO_CORO_REENTER(*this)
        {
            processor_.clear_diag();

            // Serialize request
            processor_.process_request();

            // Write message
            BOOST_ASIO_CORO_YIELD get_channel().async_write(std::move(self));

            // Read response
            BOOST_ASIO_CORO_YIELD get_channel().async_read_one(
                get_channel().shared_sequence_number(),
                std::move(self)
            );

            // Process response
            processor_.process_response(read_message, err);
            if (err)
            {
                self.complete(err, statement());
                BOOST_ASIO_CORO_YIELD break;
            }

            // Server sends now one packet per parameter and field.
            // We ignore these for now.
            while (processor_.has_remaining_meta())
            {
                // Read from the stream if necessary
                if (!get_channel().has_read_messages())
                {
                    BOOST_ASIO_CORO_YIELD get_channel().async_read_some(std::move(self));
                }

                // Read the message
                read_message = get_channel().next_read_message(get_channel().shared_sequence_number(), err);
                if (err)
                {
                    self.complete(err, statement());
                    BOOST_ASIO_CORO_YIELD break;
                }

                // Note it as processed
                processor_.on_meta_received();
            }

            // Complete
            self.complete(error_code(), processor_.result());
        }
    }
};

// External interface
inline statement prepare_statement_impl(
    channel& channel,
    string_view stmt_sql,
    error_code& err,
    diagnostics& diag
)
{
    err.clear();
    diag.clear();

    prepare_statement_processor processor(channel, stmt_sql, diag);

    // Prepare message
    processor.process_request();

    // Write message
    channel.write(err);
    if (err)
        return statement();

    // Read response
    auto read_buffer = channel.read_one(channel.shared_sequence_number(), err);
    if (err)
        return statement();

    // Process response
    processor.process_response(read_buffer, err);
    if (err)
        return statement();

    // Server sends now one packet per parameter and field.
    // We ignore these for now.
    while (processor.has_remaining_meta())
    {
        // Read from the stream if necessary
        if (!channel.has_read_messages())
        {
            channel.read_some(err);
            if (err)
                return statement();
        }

        // Discard the message
        channel.next_read_message(channel.shared_sequence_number(), err);
        if (err)
            return statement();

        // Update the processor state
        processor.on_meta_received();
    }

    return processor.result();
}

template <class CompletionToken>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code, statement))
async_prepare_statement_impl(channel& chan, string_view stmt_sql, diagnostics& diag, CompletionToken&& token)
{
    return asio::async_compose<CompletionToken, void(error_code, statement)>(
        prepare_statement_op(chan, stmt_sql, diag),
        token,
        chan
    );
}

}  // namespace detail
}  // namespace mysql
}  // namespace boost

#endif /* INCLUDE_BOOST_MYSQL_DETAIL_NETWORK_ALGORITHMS_PREPARE_STATEMENT_HPP_ */
