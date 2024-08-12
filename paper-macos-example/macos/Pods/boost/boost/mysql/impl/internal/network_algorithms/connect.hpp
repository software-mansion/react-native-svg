//
// Copyright (c) 2019-2023 Ruben Perez Hidalgo (rubenperez038 at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_MYSQL_IMPL_INTERNAL_NETWORK_ALGORITHMS_CONNECT_HPP
#define BOOST_MYSQL_IMPL_INTERNAL_NETWORK_ALGORITHMS_CONNECT_HPP

#include <boost/mysql/diagnostics.hpp>
#include <boost/mysql/error_code.hpp>
#include <boost/mysql/handshake_params.hpp>

#include <boost/mysql/detail/config.hpp>

#include <boost/mysql/impl/internal/channel/channel.hpp>
#include <boost/mysql/impl/internal/network_algorithms/handshake.hpp>

#include <boost/asio/coroutine.hpp>

namespace boost {
namespace mysql {
namespace detail {

struct connect_op : boost::asio::coroutine
{
    channel& chan_;
    diagnostics& diag_;
    const void* ep_;
    handshake_params params_;

    connect_op(channel& chan, diagnostics& diag, const void* ep, const handshake_params& params)
        : chan_(chan), diag_(diag), ep_(ep), params_(params)
    {
    }

    template <class Self>
    void operator()(Self& self, error_code code = {})
    {
        error_code ignored;
        BOOST_ASIO_CORO_REENTER(*this)
        {
            diag_.clear();

            // Physical connect
            BOOST_ASIO_CORO_YIELD chan_.stream().async_connect(ep_, std::move(self));
            if (code)
            {
                chan_.stream().close(ignored);
                self.complete(code);
                BOOST_ASIO_CORO_YIELD break;
            }

            // Handshake
            BOOST_ASIO_CORO_YIELD async_handshake_impl(chan_, params_, diag_, std::move(self));
            if (code)
            {
                chan_.stream().close(ignored);
            }
            self.complete(code);
        }
    }
};

// External interface
inline void connect_impl(
    channel& chan,
    const void* endpoint,
    const handshake_params& params,
    error_code& err,
    diagnostics& diag
)
{
    err.clear();
    diag.clear();

    error_code ignored;
    chan.stream().connect(endpoint, err);
    if (err)
    {
        chan.stream().close(ignored);
        return;
    }
    handshake_impl(chan, params, err, diag);
    if (err)
    {
        chan.stream().close(ignored);
    }
}

template <class CompletionToken>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code))
async_connect_impl(
    channel& chan,
    const void* endpoint,
    const handshake_params& params,
    diagnostics& diag,
    CompletionToken&& token
)
{
    return asio::async_compose<CompletionToken, void(error_code)>(
        connect_op{chan, diag, endpoint, params},
        token,
        chan
    );
}

}  // namespace detail
}  // namespace mysql
}  // namespace boost

#endif /* INCLUDE_BOOST_MYSQL_DETAIL_NETWORK_ALGORITHMS_CONNECT_HPP_ */
