//
// Copyright (c) 2019-2023 Ruben Perez Hidalgo (rubenperez038 at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_MYSQL_IMPL_INTERNAL_NETWORK_ALGORITHMS_EXECUTE_HPP
#define BOOST_MYSQL_IMPL_INTERNAL_NETWORK_ALGORITHMS_EXECUTE_HPP

#include <boost/mysql/diagnostics.hpp>
#include <boost/mysql/error_code.hpp>

#include <boost/mysql/detail/config.hpp>
#include <boost/mysql/detail/execution_processor/execution_processor.hpp>

#include <boost/mysql/impl/internal/channel/channel.hpp>
#include <boost/mysql/impl/internal/network_algorithms/read_resultset_head.hpp>
#include <boost/mysql/impl/internal/network_algorithms/read_some_rows.hpp>
#include <boost/mysql/impl/internal/network_algorithms/start_execution.hpp>

#include <boost/asio/coroutine.hpp>

namespace boost {
namespace mysql {
namespace detail {

struct execute_impl_op : boost::asio::coroutine
{
    channel& chan_;
    any_execution_request req_;
    execution_processor& output_;
    diagnostics& diag_;

    execute_impl_op(
        channel& chan,
        const any_execution_request& req,
        execution_processor& output,
        diagnostics& diag
    ) noexcept
        : chan_(chan), req_(req), output_(output), diag_(diag)
    {
    }

    template <class Self>
    void operator()(Self& self, error_code err = {}, std::size_t = 0)
    {
        // Error checking
        if (err)
        {
            self.complete(err);
            return;
        }

        // Normal path
        BOOST_ASIO_CORO_REENTER(*this)
        {
            // Send request and read the first response
            BOOST_ASIO_CORO_YIELD async_start_execution_impl(chan_, req_, output_, diag_, std::move(self));

            // Read anything else
            while (!output_.is_complete())
            {
                if (output_.is_reading_head())
                {
                    BOOST_ASIO_CORO_YIELD
                    async_read_resultset_head_impl(chan_, output_, diag_, std::move(self));
                }
                else if (output_.is_reading_rows())
                {
                    BOOST_ASIO_CORO_YIELD
                    async_read_some_rows_impl(chan_, output_, output_ref(), diag_, std::move(self));
                }
            }

            self.complete(error_code());
        }
    }
};

// External interface
inline void execute_impl(
    channel& channel,
    const any_execution_request& req,
    execution_processor& output,
    error_code& err,
    diagnostics& diag
)
{
    err.clear();
    diag.clear();

    // Send request and read the first response
    start_execution_impl(channel, req, output, err, diag);
    if (err)
        return;

    // Read rows and anything else
    while (!output.is_complete())
    {
        if (output.is_reading_head())
        {
            read_resultset_head_impl(channel, output, err, diag);
            if (err)
                return;
        }
        else if (output.is_reading_rows())
        {
            read_some_rows_impl(channel, output, output_ref(), err, diag);
            if (err)
                return;
        }
    }
}

template <class CompletionToken>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code))
async_execute_impl(
    channel& chan,
    const any_execution_request& req,
    execution_processor& output,
    diagnostics& diag,
    CompletionToken&& token
)
{
    return asio::async_compose<CompletionToken, void(error_code)>(
        execute_impl_op(chan, req, output, diag),
        token,
        chan
    );
}

}  // namespace detail
}  // namespace mysql
}  // namespace boost

#endif
