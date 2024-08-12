//
// Copyright (c) 2019-2023 Ruben Perez Hidalgo (rubenperez038 at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_MYSQL_IMPL_INTERNAL_NETWORK_ALGORITHMS_CLOSE_CONNECTION_HPP
#define BOOST_MYSQL_IMPL_INTERNAL_NETWORK_ALGORITHMS_CLOSE_CONNECTION_HPP

#include <boost/mysql/diagnostics.hpp>
#include <boost/mysql/error_code.hpp>

#include <boost/mysql/detail/config.hpp>

#include <boost/mysql/impl/internal/channel/channel.hpp>
#include <boost/mysql/impl/internal/network_algorithms/quit_connection.hpp>

#include <boost/asio/post.hpp>

namespace boost {
namespace mysql {
namespace detail {

struct close_connection_op : boost::asio::coroutine
{
    channel& chan_;
    diagnostics& diag_;

    close_connection_op(channel& chan, diagnostics& diag) : chan_(chan), diag_(diag) {}

    template <class Self>
    void operator()(Self& self, error_code err = {})
    {
        error_code close_err;
        BOOST_ASIO_CORO_REENTER(*this)
        {
            diag_.clear();

            if (!chan_.stream().is_open())
            {
                BOOST_ASIO_CORO_YIELD boost::asio::post(chan_.get_executor(), std::move(self));
                self.complete(error_code());
                BOOST_ASIO_CORO_YIELD break;
            }

            BOOST_ASIO_CORO_YIELD async_quit_connection_impl(chan_, diag_, std::move(self));

            // We call close regardless of the quit outcome
            chan_.stream().close(close_err);
            self.complete(err ? err : close_err);
        }
    }
};

// Interface
inline void close_connection_impl(channel& chan, error_code& err, diagnostics& diag)
{
    err.clear();
    diag.clear();

    // Close = quit + close stream. We close the stream regardless of the quit failing or not
    if (chan.stream().is_open())
    {
        // MySQL quit notification
        quit_connection_impl(chan, err, diag);

        error_code close_err;
        chan.stream().close(close_err);
        if (!err)
        {
            err = close_err;
        }
    }
}

template <class CompletionToken>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code))
async_close_connection_impl(channel& chan, diagnostics& diag, CompletionToken&& token)
{
    return asio::async_compose<CompletionToken, void(error_code)>(
        close_connection_op{chan, diag},
        token,
        chan
    );
}

}  // namespace detail
}  // namespace mysql
}  // namespace boost

#endif /* INCLUDE_BOOST_MYSQL_DETAIL_NETWORK_ALGORITHMS_CLOSE_CONNECTION_HPP_ */
