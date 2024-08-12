//
// Copyright (c) 2019-2023 Ruben Perez Hidalgo (rubenperez038 at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_MYSQL_DETAIL_ANY_STREAM_HPP
#define BOOST_MYSQL_DETAIL_ANY_STREAM_HPP

#include <boost/mysql/error_code.hpp>

#include <boost/asio/any_completion_handler.hpp>
#include <boost/asio/any_io_executor.hpp>
#include <boost/asio/buffer.hpp>

#include <cstddef>

namespace boost {
namespace mysql {
namespace detail {

class any_stream
{
public:
    any_stream(bool supports_ssl) noexcept
        : ssl_state_(supports_ssl ? ssl_state::inactive : ssl_state::unsupported)
    {
    }
    bool ssl_active() const noexcept { return ssl_state_ == ssl_state::active; }
    void reset_ssl_active() noexcept
    {
        if (ssl_state_ == ssl_state::active)
            ssl_state_ = ssl_state::inactive;
    }
    void set_ssl_active() noexcept
    {
        BOOST_ASSERT(ssl_state_ != ssl_state::unsupported);
        ssl_state_ = ssl_state::active;
    }
    bool supports_ssl() const noexcept { return ssl_state_ != ssl_state::unsupported; }

    using executor_type = asio::any_io_executor;

    virtual ~any_stream() {}

    virtual executor_type get_executor() = 0;

    // SSL
    virtual void handshake(error_code& ec) = 0;
    virtual void async_handshake(asio::any_completion_handler<void(error_code)>) = 0;
    virtual void shutdown(error_code& ec) = 0;
    virtual void async_shutdown(asio::any_completion_handler<void(error_code)>) = 0;

    // Reading
    virtual std::size_t read_some(asio::mutable_buffer, error_code& ec) = 0;
    virtual void async_read_some(asio::mutable_buffer, asio::any_completion_handler<void(error_code, std::size_t)>) = 0;

    // Writing
    virtual std::size_t write_some(asio::const_buffer, error_code& ec) = 0;
    virtual void async_write_some(asio::const_buffer, asio::any_completion_handler<void(error_code, std::size_t)>) = 0;

    // Connect and close - these apply only to SocketStream's
    virtual void connect(const void* endpoint, error_code& ec) = 0;
    virtual void async_connect(const void* endpoint, asio::any_completion_handler<void(error_code)>) = 0;
    virtual void close(error_code& ec) = 0;
    virtual bool is_open() const noexcept = 0;

private:
    enum class ssl_state
    {
        inactive,
        active,
        unsupported
    } ssl_state_;
};

}  // namespace detail
}  // namespace mysql
}  // namespace boost

#endif
