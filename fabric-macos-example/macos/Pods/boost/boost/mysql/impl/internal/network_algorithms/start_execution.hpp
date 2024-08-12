//
// Copyright (c) 2019-2023 Ruben Perez Hidalgo (rubenperez038 at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_MYSQL_IMPL_INTERNAL_NETWORK_ALGORITHMS_START_EXECUTION_HPP
#define BOOST_MYSQL_IMPL_INTERNAL_NETWORK_ALGORITHMS_START_EXECUTION_HPP

#include <boost/mysql/client_errc.hpp>
#include <boost/mysql/diagnostics.hpp>
#include <boost/mysql/error_code.hpp>
#include <boost/mysql/field_view.hpp>
#include <boost/mysql/statement.hpp>
#include <boost/mysql/string_view.hpp>

#include <boost/mysql/detail/any_execution_request.hpp>
#include <boost/mysql/detail/config.hpp>
#include <boost/mysql/detail/execution_processor/execution_processor.hpp>
#include <boost/mysql/detail/resultset_encoding.hpp>

#include <boost/mysql/impl/internal/channel/channel.hpp>
#include <boost/mysql/impl/internal/network_algorithms/read_resultset_head.hpp>
#include <boost/mysql/impl/internal/protocol/protocol.hpp>

#include <boost/asio/async_result.hpp>
#include <boost/asio/coroutine.hpp>
#include <boost/asio/post.hpp>

namespace boost {
namespace mysql {
namespace detail {

inline error_code check_client_errors(const any_execution_request& req)
{
    if (req.is_query)
        return error_code();
    return req.data.stmt.stmt.num_params() == req.data.stmt.params.size() ? error_code()
                                                                          : client_errc::wrong_num_params;
}

inline resultset_encoding get_encoding(const any_execution_request& req)
{
    return req.is_query ? resultset_encoding::text : resultset_encoding::binary;
}

inline void serialize_execution_request(
    const any_execution_request& req,
    channel& chan,
    std::uint8_t& sequence_number
)
{
    if (req.is_query)
    {
        chan.serialize(query_command{req.data.query}, sequence_number);
    }
    else
    {
        chan.serialize(execute_stmt_command{req.data.stmt.stmt.id(), req.data.stmt.params}, sequence_number);
    }
}

inline void execution_setup(const any_execution_request& req, channel& chan, execution_processor& proc)
{
    // Reeset the processor
    proc.reset(get_encoding(req), chan.meta_mode());

    // Serialize the execution request
    serialize_execution_request(req, chan, proc.sequence_number());
}

struct start_execution_impl_op : boost::asio::coroutine
{
    channel& chan_;
    any_execution_request req_;
    execution_processor& proc_;
    diagnostics& diag_;
    error_code client_err_;  // keep it across posts

    start_execution_impl_op(
        channel& chan,
        const any_execution_request& req,
        execution_processor& proc,
        diagnostics& diag
    )
        : chan_(chan), req_(req), proc_(proc), diag_(diag)
    {
    }

    template <class Self>
    void operator()(Self& self, error_code err = {})
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
            diag_.clear();

            // Check for errors
            err = check_client_errors(req_);
            if (err)
            {
                client_err_ = err;
                BOOST_ASIO_CORO_YIELD boost::asio::post(chan_.get_executor(), std::move(self));
                self.complete(client_err_);
                BOOST_ASIO_CORO_YIELD break;
            }

            // Setup
            execution_setup(req_, chan_, proc_);

            // Send the execution request (serialized by setup)
            BOOST_ASIO_CORO_YIELD chan_.async_write(std::move(self));

            // Read the first resultset's head
            BOOST_ASIO_CORO_YIELD
            async_read_resultset_head_impl(chan_, proc_, diag_, std::move(self));

            self.complete(error_code());
        }
    }
};

// External interface
inline void start_execution_impl(
    channel& channel,
    const any_execution_request& req,
    execution_processor& proc,
    error_code& err,
    diagnostics& diag
)
{
    err.clear();
    diag.clear();

    // Check for errors
    err = check_client_errors(req);
    if (err)
        return;

    // Setup
    execution_setup(req, channel, proc);

    // Send the execution request (serialized by setup)
    channel.write(err);
    if (err)
        return;

    // Read the first resultset's head
    read_resultset_head_impl(channel, proc, err, diag);
    if (err)
        return;
}

template <class CompletionToken>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code))
async_start_execution_impl(
    channel& channel,
    const any_execution_request& req,
    execution_processor& proc,
    diagnostics& diag,
    CompletionToken&& token
)
{
    return boost::asio::async_compose<CompletionToken, void(error_code)>(
        start_execution_impl_op(channel, req, proc, diag),
        token,
        channel
    );
}

}  // namespace detail
}  // namespace mysql
}  // namespace boost

#endif /* INCLUDE_MYSQL_IMPL_NETWORK_ALGORITHMS_READ_RESULTSET_HEAD_HPP_ */
