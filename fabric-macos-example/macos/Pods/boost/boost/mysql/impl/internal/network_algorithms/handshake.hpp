//
// Copyright (c) 2019-2023 Ruben Perez Hidalgo (rubenperez038 at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_MYSQL_IMPL_INTERNAL_NETWORK_ALGORITHMS_HANDSHAKE_HPP
#define BOOST_MYSQL_IMPL_INTERNAL_NETWORK_ALGORITHMS_HANDSHAKE_HPP

#include <boost/mysql/client_errc.hpp>
#include <boost/mysql/diagnostics.hpp>
#include <boost/mysql/error_code.hpp>
#include <boost/mysql/handshake_params.hpp>

#include <boost/mysql/detail/config.hpp>

#include <boost/mysql/impl/internal/auth/auth.hpp>
#include <boost/mysql/impl/internal/channel/channel.hpp>
#include <boost/mysql/impl/internal/protocol/capabilities.hpp>
#include <boost/mysql/impl/internal/protocol/protocol.hpp>

namespace boost {
namespace mysql {
namespace detail {

inline capabilities conditional_capability(bool condition, std::uint32_t cap)
{
    return capabilities(condition ? cap : 0);
}

inline error_code process_capabilities(
    const handshake_params& params,
    const server_hello& hello,
    bool is_ssl_stream,
    capabilities& negotiated_caps
)
{
    auto ssl = params.ssl();
    capabilities server_caps = hello.server_capabilities;
    capabilities required_caps = mandatory_capabilities |
                                 conditional_capability(!params.database().empty(), CLIENT_CONNECT_WITH_DB) |
                                 conditional_capability(params.multi_queries(), CLIENT_MULTI_STATEMENTS) |
                                 conditional_capability(
                                     ssl == ssl_mode::require && is_ssl_stream,
                                     CLIENT_SSL
                                 );
    if (required_caps.has(CLIENT_SSL) && !server_caps.has(CLIENT_SSL))
    {
        // This happens if the server doesn't have SSL configured. This special
        // error code helps users diagnosing their problem a lot (server_unsupported doesn't).
        return make_error_code(client_errc::server_doesnt_support_ssl);
    }
    else if (!server_caps.has_all(required_caps))
    {
        return make_error_code(client_errc::server_unsupported);
    }
    negotiated_caps = server_caps &
                      (required_caps | optional_capabilities |
                       conditional_capability(ssl == ssl_mode::enable && is_ssl_stream, CLIENT_SSL));
    return error_code();
}

// When receiving an auth response from the server, several things can happen:
//  - An OK packet. It means we are done with the auth phase. auth_result::complete.
//  - An auth switch response. It means we should change the auth plugin,
//    recalculate the auth response and send it back. auth_result::send_more_data.
//  - An auth more data. Same as auth switch response, but without changing
//    the authentication plugin. Also auth_result::send_more_data.
//  - An auth more data with a challenge equals to fast_auth_complete_challenge.
//    This means auth is complete and we should wait for an OK packet (auth_result::wait_for_ok).
//    I have no clue why the server sends this instead of just an OK packet. It
//    happens just for caching_sha2_password.
enum class auth_state
{
    complete,
    send_more_data,
    wait_for_ok,
    invalid
};

class handshake_processor
{
    handshake_params params_;
    diagnostics& diag_;
    channel& channel_;
    auth_response auth_resp_;
    auth_state auth_state_{auth_state::invalid};

public:
    handshake_processor(const handshake_params& params, diagnostics& diag, channel& channel)
        : params_(params), diag_(diag), channel_(channel){};
    const handshake_params& params() const noexcept { return params_; }
    channel& get_channel() noexcept { return channel_; }
    void clear_diagnostics() noexcept { diag_.clear(); }

    // Once the handshake is processed, the capabilities are stored in the channel
    bool use_ssl() const noexcept { return channel_.current_capabilities().has(CLIENT_SSL); }

    // Initial greeting processing
    error_code process_handshake(span<const std::uint8_t> buffer, bool is_ssl_stream)
    {
        // Deserialize server hello
        server_hello hello{};
        auto err = deserialize_server_hello(buffer, hello, diag_);
        if (err)
            return err;

        // Check capabilities
        capabilities negotiated_caps;
        err = process_capabilities(params_, hello, is_ssl_stream, negotiated_caps);
        if (err)
            return err;

        // Set capabilities & db flavor
        channel_.set_current_capabilities(negotiated_caps);
        channel_.set_flavor(hello.server);

        // Compute auth response
        return compute_auth_response(
            hello.auth_plugin_name,
            params_.password(),
            hello.auth_plugin_data.to_span(),
            use_ssl(),
            auth_resp_
        );
    }

    // Response to that initial greeting
    void compose_ssl_request()
    {
        ssl_request sslreq{
            channel_.current_capabilities(),
            static_cast<std::uint32_t>(MAX_PACKET_SIZE),
            params_.connection_collation(),
        };
        channel_.serialize(sslreq, channel_.shared_sequence_number());
    }

    void compose_login_request()
    {
        // Compose login request
        login_request response{
            channel_.current_capabilities(),
            static_cast<std::uint32_t>(MAX_PACKET_SIZE),
            params_.connection_collation(),
            params_.username(),
            auth_resp_.data,
            params_.database(),
            auth_resp_.plugin_name,
        };

        // Serialize
        channel_.serialize(response, channel_.shared_sequence_number());
    }

    // Server handshake response
    error_code process_handshake_server_response(span<const std::uint8_t> msg)
    {
        error_code err;

        auto response = deserialize_handshake_server_response(msg, channel_.flavor(), diag_);

        switch (response.type)
        {
        case handhake_server_response::type_t::ok:
            // Auth success
            auth_state_ = auth_state::complete;
            return error_code();
        case handhake_server_response::type_t::error: return response.data.err;
        case handhake_server_response::type_t::auth_switch:
            // Compute response
            err = compute_auth_response(
                response.data.auth_sw.plugin_name,
                params_.password(),
                response.data.auth_sw.auth_data,
                use_ssl(),
                auth_resp_
            );
            if (err)
                return err;

            // Serialize
            channel_.serialize(auth_switch_response{auth_resp_.data}, channel_.shared_sequence_number());
            auth_state_ = auth_state::send_more_data;
            return error_code();
        case handhake_server_response::type_t::ok_follows:
            // The next packet will be an OK packet
            auth_state_ = auth_state::wait_for_ok;
            return error_code();
        case handhake_server_response::type_t::auth_more_data:
            // Compute response
            err = compute_auth_response(
                auth_resp_.plugin_name,
                params_.password(),
                response.data.more_data,
                use_ssl(),
                auth_resp_
            );
            if (err)
                return err;
            channel_.serialize(auth_switch_response{auth_resp_.data}, channel_.shared_sequence_number());
            auth_state_ = auth_state::send_more_data;
            return error_code();
        default: BOOST_ASSERT(false); return error_code();
        }
    }

    bool should_send_auth_switch_response() const noexcept
    {
        return auth_state_ == auth_state::send_more_data;
    }

    bool auth_complete() const noexcept { return auth_state_ == auth_state::complete; }
};

struct handshake_op : boost::asio::coroutine
{
    handshake_processor processor_;

    handshake_op(const handshake_params& params, diagnostics& diag, channel& channel)
        : processor_(params, diag, channel)
    {
    }

    channel& get_channel() noexcept { return processor_.get_channel(); }

    template <class Self>
    void operator()(Self& self, error_code err = {}, span<const std::uint8_t> read_msg = {})
    {
        // Error checking
        if (err)
        {
            self.complete(err);
            return;
        }

        // Non-error path
        BOOST_ASIO_CORO_REENTER(*this)
        {
            processor_.clear_diagnostics();

            // Setup the channel
            get_channel().reset();

            // Read server greeting
            BOOST_ASIO_CORO_YIELD get_channel().async_read_one(
                get_channel().shared_sequence_number(),
                std::move(self)
            );

            // Process server greeting
            err = processor_.process_handshake(read_msg, get_channel().stream().supports_ssl());
            if (err)
            {
                self.complete(err);
                BOOST_ASIO_CORO_YIELD break;
            }

            // SSL
            if (processor_.use_ssl())
            {
                // Send SSL request
                processor_.compose_ssl_request();
                BOOST_ASIO_CORO_YIELD get_channel().async_write(std::move(self));

                // SSL handshake
                BOOST_ASIO_CORO_YIELD get_channel().stream().async_handshake(std::move(self));
            }

            // Compose and send handshake response
            processor_.compose_login_request();
            BOOST_ASIO_CORO_YIELD get_channel().async_write(std::move(self));

            while (!processor_.auth_complete())
            {
                // Receive response
                BOOST_ASIO_CORO_YIELD get_channel().async_read_one(
                    get_channel().shared_sequence_number(),
                    std::move(self)
                );

                // Process it
                err = processor_.process_handshake_server_response(read_msg);
                if (err)
                {
                    self.complete(err);
                    BOOST_ASIO_CORO_YIELD break;
                }

                // We received an auth switch response and we have the response ready to be sent
                if (processor_.should_send_auth_switch_response())
                {
                    BOOST_ASIO_CORO_YIELD get_channel().async_write(std::move(self));
                }
            }

            self.complete(error_code());
        }
    }
};

// External interface
inline void handshake_impl(
    channel& channel,
    const handshake_params& params,
    error_code& err,
    diagnostics& diag
)
{
    err.clear();
    diag.clear();
    channel.reset();

    // Set up processor
    handshake_processor processor(params, diag, channel);

    // Read server greeting
    auto read_message = channel.read_one(channel.shared_sequence_number(), err);
    if (err)
        return;

    // Process server greeting (handshake)
    err = processor.process_handshake(read_message, channel.stream().supports_ssl());
    if (err)
        return;

    // SSL
    if (processor.use_ssl())
    {
        // Send SSL request
        processor.compose_ssl_request();
        channel.write(err);
        if (err)
            return;

        // SSL handshake
        channel.stream().handshake(err);
        if (err)
            return;
    }

    // Handshake response
    processor.compose_login_request();
    channel.write(err);
    if (err)
        return;

    while (!processor.auth_complete())
    {
        // Receive response
        read_message = channel.read_one(channel.shared_sequence_number(), err);
        if (err)
            return;

        // Process it
        err = processor.process_handshake_server_response(read_message);
        if (err)
            return;

        if (processor.should_send_auth_switch_response())
        {
            // We received an auth switch request and we have the response ready to be sent
            channel.write(err);
            if (err)
                return;
        }
    };
}

template <class CompletionToken>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code))
async_handshake_impl(
    channel& chan,
    const handshake_params& params,
    diagnostics& diag,
    CompletionToken&& token
)
{
    return boost::asio::async_compose<CompletionToken, void(error_code)>(
        handshake_op(params, diag, chan),
        token,
        chan
    );
}

}  // namespace detail
}  // namespace mysql
}  // namespace boost

#endif
