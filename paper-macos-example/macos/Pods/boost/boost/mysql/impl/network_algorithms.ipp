//
// Copyright (c) 2019-2023 Ruben Perez Hidalgo (rubenperez038 at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_MYSQL_IMPL_NETWORK_ALGORITHMS_IPP
#define BOOST_MYSQL_IMPL_NETWORK_ALGORITHMS_IPP

#pragma once

#include <boost/mysql/detail/network_algorithms.hpp>

#include <boost/mysql/impl/internal/network_algorithms/close_connection.hpp>
#include <boost/mysql/impl/internal/network_algorithms/close_statement.hpp>
#include <boost/mysql/impl/internal/network_algorithms/connect.hpp>
#include <boost/mysql/impl/internal/network_algorithms/execute.hpp>
#include <boost/mysql/impl/internal/network_algorithms/handshake.hpp>
#include <boost/mysql/impl/internal/network_algorithms/ping.hpp>
#include <boost/mysql/impl/internal/network_algorithms/prepare_statement.hpp>
#include <boost/mysql/impl/internal/network_algorithms/quit_connection.hpp>
#include <boost/mysql/impl/internal/network_algorithms/read_resultset_head.hpp>
#include <boost/mysql/impl/internal/network_algorithms/read_some_rows.hpp>
#include <boost/mysql/impl/internal/network_algorithms/read_some_rows_dynamic.hpp>
#include <boost/mysql/impl/internal/network_algorithms/start_execution.hpp>

void boost::mysql::detail::connect_erased(
    channel& chan,
    const void* endpoint,
    const handshake_params& params,
    error_code& err,
    diagnostics& diag
)
{
    connect_impl(chan, endpoint, params, err, diag);
}

void boost::mysql::detail::async_connect_erased(
    channel& chan,
    const void* endpoint,
    const handshake_params& params,
    diagnostics& diag,
    any_void_handler handler
)
{
    async_connect_impl(chan, endpoint, params, diag, std::move(handler));
}

void boost::mysql::detail::handshake_erased(
    channel& channel,
    const handshake_params& params,
    error_code& err,
    diagnostics& diag
)
{
    handshake_impl(channel, params, err, diag);
}

void boost::mysql::detail::async_handshake_erased(
    channel& chan,
    const handshake_params& params,
    diagnostics& diag,
    any_void_handler handler
)
{
    async_handshake_impl(chan, params, diag, std::move(handler));
}

void boost::mysql::detail::execute_erased(
    channel& channel,
    const any_execution_request& req,
    execution_processor& output,
    error_code& err,
    diagnostics& diag
)
{
    execute_impl(channel, req, output, err, diag);
}

void boost::mysql::detail::async_execute_erased(
    channel& chan,
    const any_execution_request& req,
    execution_processor& output,
    diagnostics& diag,
    any_void_handler handler
)
{
    async_execute_impl(chan, req, output, diag, std::move(handler));
}

void boost::mysql::detail::start_execution_erased(
    channel& channel,
    const any_execution_request& req,
    execution_processor& proc,
    error_code& err,
    diagnostics& diag
)
{
    start_execution_impl(channel, req, proc, err, diag);
}

void boost::mysql::detail::async_start_execution_erased(
    channel& channel,
    const any_execution_request& req,
    execution_processor& proc,
    diagnostics& diag,
    any_void_handler handler
)
{
    async_start_execution_impl(channel, req, proc, diag, std::move(handler));
}

boost::mysql::statement boost::mysql::detail::prepare_statement_erased(
    channel& chan,
    string_view stmt,
    error_code& err,
    diagnostics& diag
)
{
    return prepare_statement_impl(chan, stmt, err, diag);
}

void boost::mysql::detail::async_prepare_statement_erased(
    channel& chan,
    string_view stmt,
    diagnostics& diag,
    any_handler<statement> handler
)
{
    async_prepare_statement_impl(chan, stmt, diag, std::move(handler));
}

void boost::mysql::detail::close_statement_erased(
    channel& chan,
    const statement& stmt,
    error_code& err,
    diagnostics& diag
)
{
    close_statement_impl(chan, stmt, err, diag);
}

void boost::mysql::detail::async_close_statement_erased(
    channel& chan,
    const statement& stmt,
    diagnostics& diag,
    any_void_handler handler
)
{
    async_close_statement_impl(chan, stmt, diag, std::move(handler));
}

boost::mysql::rows_view boost::mysql::detail::read_some_rows_dynamic_erased(
    channel& chan,
    execution_state_impl& st,
    error_code& err,
    diagnostics& diag
)
{
    return read_some_rows_dynamic_impl(chan, st, err, diag);
}

void boost::mysql::detail::async_read_some_rows_dynamic_erased(
    channel& chan,
    execution_state_impl& st,
    diagnostics& diag,
    any_handler<rows_view> handler
)
{
    async_read_some_rows_dynamic_impl(chan, st, diag, std::move(handler));
}

std::size_t boost::mysql::detail::read_some_rows_static_erased(
    channel& chan,
    execution_processor& proc,
    const output_ref& output,
    error_code& err,
    diagnostics& diag
)
{
    return read_some_rows_impl(chan, proc, output, err, diag);
}

void boost::mysql::detail::async_read_some_rows_erased(
    channel& chan,
    execution_processor& proc,
    const output_ref& output,
    diagnostics& diag,
    any_handler<std::size_t> handler
)
{
    async_read_some_rows_impl(chan, proc, output, diag, std::move(handler));
}

void boost::mysql::detail::read_resultset_head_erased(
    channel& channel,
    execution_processor& proc,
    error_code& err,
    diagnostics& diag
)
{
    read_resultset_head_impl(channel, proc, err, diag);
}

void boost::mysql::detail::async_read_resultset_head_erased(
    channel& chan,
    execution_processor& proc,
    diagnostics& diag,
    any_void_handler handler
)
{
    async_read_resultset_head_impl(chan, proc, diag, std::move(handler));
}

void boost::mysql::detail::ping_erased(channel& chan, error_code& code, diagnostics& diag)
{
    ping_impl(chan, code, diag);
}

void boost::mysql::detail::async_ping_erased(channel& chan, diagnostics& diag, any_void_handler handler)
{
    async_ping_impl(chan, diag, std::move(handler));
}

void boost::mysql::detail::close_connection_erased(channel& chan, error_code& code, diagnostics& diag)
{
    close_connection_impl(chan, code, diag);
}

void boost::mysql::detail::async_close_connection_erased(
    channel& chan,
    diagnostics& diag,
    any_void_handler handler
)
{
    async_close_connection_impl(chan, diag, std::move(handler));
}

void boost::mysql::detail::quit_connection_erased(channel& chan, error_code& err, diagnostics& diag)
{
    quit_connection_impl(chan, err, diag);
}

void boost::mysql::detail::async_quit_connection_erased(
    channel& chan,
    diagnostics& diag,
    any_void_handler handler
)
{
    async_quit_connection_impl(chan, diag, std::move(handler));
}

#endif
