//
// Copyright (c) 2019-2023 Ruben Perez Hidalgo (rubenperez038 at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_MYSQL_IMPL_INTERNAL_CHANNEL_CHANNEL_HPP
#define BOOST_MYSQL_IMPL_INTERNAL_CHANNEL_CHANNEL_HPP

#include <boost/mysql/diagnostics.hpp>
#include <boost/mysql/error_code.hpp>
#include <boost/mysql/field_view.hpp>
#include <boost/mysql/metadata_mode.hpp>

#include <boost/mysql/detail/any_stream.hpp>

#include <boost/mysql/impl/internal/channel/message_reader.hpp>
#include <boost/mysql/impl/internal/channel/message_writer.hpp>
#include <boost/mysql/impl/internal/channel/write_message.hpp>
#include <boost/mysql/impl/internal/protocol/capabilities.hpp>
#include <boost/mysql/impl/internal/protocol/db_flavor.hpp>

#include <boost/asio/any_io_executor.hpp>
#include <boost/asio/async_result.hpp>

#include <cstddef>
#include <memory>
#include <utility>
#include <vector>

namespace boost {
namespace mysql {
namespace detail {

// Implements the message layer of the MySQL protocol
class channel
{
    db_flavor flavor_{db_flavor::mysql};
    capabilities current_caps_;
    std::uint8_t shared_sequence_number_{};
    diagnostics shared_diag_;  // for async ops
    std::vector<field_view> shared_fields_;
    metadata_mode meta_mode_{metadata_mode::minimal};
    message_reader reader_;
    message_writer writer_;
    std::unique_ptr<any_stream> stream_;

public:
    channel(std::size_t read_buffer_size, std::unique_ptr<any_stream> stream)
        : reader_(read_buffer_size), stream_(std::move(stream))
    {
    }

    // Executor
    using executor_type = asio::any_io_executor;
    executor_type get_executor() { return stream_->get_executor(); }

    // Reading
    bool has_read_messages() const noexcept { return reader_.has_message(); }

    span<const std::uint8_t> next_read_message(std::uint8_t& seqnum, error_code& err) noexcept
    {
        return reader_.get_next_message(seqnum, err);
    }

    void read_some(error_code& code) { read_some_messages(*stream_, reader_, code); }

    template <BOOST_ASIO_COMPLETION_TOKEN_FOR(void(error_code)) CompletionToken>
    BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code))
    async_read_some(CompletionToken&& token)
    {
        return async_read_some_messages(*stream_, reader_, std::forward<CompletionToken>(token));
    }

    span<const std::uint8_t> read_one(std::uint8_t& seqnum, error_code& ec)
    {
        return read_one_message(*stream_, reader_, seqnum, ec);
    }

    template <BOOST_ASIO_COMPLETION_TOKEN_FOR(void(error_code, span<const std::uint8_t>)) CompletionToken>
    BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code, span<const std::uint8_t>))
    async_read_one(std::uint8_t& seqnum, CompletionToken&& token)
    {
        return async_read_one_message(*stream_, reader_, seqnum, std::forward<CompletionToken>(token));
    }

    // Exposed for the sake of testing
    std::size_t read_buffer_size() const noexcept { return reader_.buffer().size(); }

    // Writing. serialize() gets all the required data into the write buffers so it can be written
    template <class Serializable>
    void serialize(const Serializable& message, std::uint8_t& sequence_number)
    {
        std::size_t size = message.get_size();
        auto buff = writer_.prepare_buffer(size, sequence_number);
        message.serialize(buff);
    }

    // Writes what has been set up by serialize()
    void write(error_code& code) { write_message(*stream_, writer_, code); }

    template <BOOST_ASIO_COMPLETION_TOKEN_FOR(void(error_code)) CompletionToken>
    BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code))
    async_write(CompletionToken&& token)
    {
        return async_write_message(*stream_, writer_, std::forward<CompletionToken>(token));
    }

    // Capabilities
    capabilities current_capabilities() const noexcept { return current_caps_; }
    void set_current_capabilities(capabilities value) noexcept { current_caps_ = value; }

    // DB flavor
    db_flavor flavor() const noexcept { return flavor_; }
    void set_flavor(db_flavor v) noexcept { flavor_ = v; }

    void reset()
    {
        flavor_ = db_flavor::mysql;
        current_caps_ = capabilities();
        reset_sequence_number();
        stream_->reset_ssl_active();
        // Metadata mode does not get reset on handshake
    }

    // Internal buffer, diagnostics and sequence_number to help async ops
    diagnostics& shared_diag() noexcept { return shared_diag_; }
    std::uint8_t& shared_sequence_number() noexcept { return shared_sequence_number_; }
    std::uint8_t& reset_sequence_number() noexcept { return shared_sequence_number_ = 0; }
    std::vector<field_view>& shared_fields() noexcept { return shared_fields_; }
    const std::vector<field_view>& shared_fields() const noexcept { return shared_fields_; }

    // Metadata mode
    metadata_mode meta_mode() const noexcept { return meta_mode_; }
    void set_meta_mode(metadata_mode v) noexcept { meta_mode_ = v; }

    // SSL
    bool ssl_active() const noexcept { return stream_->ssl_active(); }

    // Getting the underlying stream
    any_stream& stream() noexcept { return *stream_; }
    const any_stream& stream() const noexcept { return *stream_; }
};

}  // namespace detail
}  // namespace mysql
}  // namespace boost

#endif
