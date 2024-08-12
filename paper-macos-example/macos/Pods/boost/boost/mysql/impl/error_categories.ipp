//
// Copyright (c) 2019-2023 Ruben Perez Hidalgo (rubenperez038 at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_MYSQL_IMPL_ERROR_CATEGORIES_IPP
#define BOOST_MYSQL_IMPL_ERROR_CATEGORIES_IPP

#pragma once

#include <boost/mysql/client_errc.hpp>
#include <boost/mysql/common_server_errc.hpp>
#include <boost/mysql/error_categories.hpp>

#include <boost/mysql/detail/config.hpp>

#include <boost/mysql/impl/internal/error/server_error_to_string.hpp>

namespace boost {
namespace mysql {
namespace detail {

BOOST_MYSQL_STATIC_OR_INLINE
const char* error_to_string(client_errc error) noexcept
{
    switch (error)
    {
    case client_errc::incomplete_message: return "An incomplete message was received from the server";
    case client_errc::extra_bytes: return "Unexpected extra bytes at the end of a message were received";
    case client_errc::sequence_number_mismatch: return "Mismatched sequence numbers";
    case client_errc::server_unsupported:
        return "The server does not support the minimum required capabilities to establish the "
               "connection";
    case client_errc::protocol_value_error:
        return "An unexpected value was found in a server-received message";
    case client_errc::unknown_auth_plugin:
        return "The user employs an authentication plugin not known to this library";
    case client_errc::auth_plugin_requires_ssl:
        return "The authentication plugin requires the connection to use SSL";
    case client_errc::wrong_num_params:
        return "The number of parameters passed to the prepared statement does not match the "
               "number of actual parameters";
    case boost::mysql::client_errc::server_doesnt_support_ssl:
        return "The connection is configured to require SSL, but the server doesn't allow SSL connections. "
               "Configure SSL on your server or change your connection to not require SSL";
    case boost::mysql::client_errc::metadata_check_failed:
        return "The static interface detected a type mismatch between your declared row type and what the "
               "server returned. Verify your type definitions.";
    case boost::mysql::client_errc::num_resultsets_mismatch:
        return "The static interface detected a mismatch between the number of resultsets passed as template "
               "arguments to static_results<T1, T2...>/static_execution_state<T1, T2...> and the number of "
               "results returned by server";
    case boost::mysql::client_errc::static_row_parsing_error:
        return "The static interface encountered an error when parsing a field into a C++ data structure.";
    case boost::mysql::client_errc::row_type_mismatch:
        return "The StaticRow type passed to read_some_rows does not correspond to the resultset type being "
               "read";

    default: return "<unknown MySQL client error>";
    }
}

BOOST_MYSQL_STATIC_OR_INLINE
const char* error_to_string(common_server_errc v) noexcept
{
    const char* res = detail::common_error_to_string(static_cast<int>(v));
    return res ? res : "<unknown server error>";
}

class client_category final : public boost::system::error_category
{
public:
    const char* name() const noexcept final override { return "mysql.client"; }
    std::string message(int ev) const final override { return error_to_string(static_cast<client_errc>(ev)); }
};

class common_server_category final : public boost::system::error_category
{
public:
    const char* name() const noexcept final override { return "mysql.common-server"; }
    std::string message(int ev) const final override
    {
        return error_to_string(static_cast<common_server_errc>(ev));
    }
};

class mysql_server_category final : public boost::system::error_category
{
public:
    const char* name() const noexcept final override { return "mysql.mysql-server"; }
    std::string message(int ev) const final override { return detail::mysql_error_to_string(ev); }
};

class mariadb_server_category final : public boost::system::error_category
{
public:
    const char* name() const noexcept final override { return "mysql.mariadb-server"; }
    std::string message(int ev) const final override { return detail::mariadb_error_to_string(ev); }
};

// Optimization, so that static initialization happens only once (reduces C++11 thread-safe initialization
// overhead)
struct all_categories
{
    client_category client;
    common_server_category common_server;
    mysql_server_category mysql_server;
    mariadb_server_category mariadb_server;

    static const all_categories& get() noexcept
    {
        static all_categories res;
        return res;
    }
};

}  // namespace detail
}  // namespace mysql
}  // namespace boost

const boost::system::error_category& boost::mysql::get_client_category() noexcept
{
    return detail::all_categories::get().client;
}

const boost::system::error_category& boost::mysql::get_common_server_category() noexcept
{
    return detail::all_categories::get().common_server;
}

const boost::system::error_category& boost::mysql::get_mysql_server_category() noexcept
{
    return detail::all_categories::get().mysql_server;
}

const boost::system::error_category& boost::mysql::get_mariadb_server_category() noexcept
{
    return detail::all_categories::get().mariadb_server;
}

#endif
