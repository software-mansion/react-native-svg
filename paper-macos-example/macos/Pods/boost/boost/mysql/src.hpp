//
// Copyright (c) 2019-2023 Ruben Perez Hidalgo (rubenperez038 at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_MYSQL_SRC_HPP
#define BOOST_MYSQL_SRC_HPP

// This file is meant to be included once, in a translation unit of
// the program, with the macro BOOST_MYSQL_SEPARATE_COMPILATION defined.

#include <boost/mysql/detail/config.hpp>

#ifndef BOOST_MYSQL_SEPARATE_COMPILATION
#error You need to define BOOST_MYSQL_SEPARATE_COMPILATION in all translation units that use the compiled version of Boost.MySQL, \
    as well as the one where this file is included.
#endif

#include <boost/mysql/impl/any_stream_impl.ipp>
#include <boost/mysql/impl/channel_ptr.ipp>
#include <boost/mysql/impl/column_type.ipp>
#include <boost/mysql/impl/date.ipp>
#include <boost/mysql/impl/datetime.ipp>
#include <boost/mysql/impl/error_categories.ipp>
#include <boost/mysql/impl/execution_state_impl.ipp>
#include <boost/mysql/impl/field.ipp>
#include <boost/mysql/impl/field_kind.ipp>
#include <boost/mysql/impl/field_view.ipp>
#include <boost/mysql/impl/internal/auth/auth.ipp>
#include <boost/mysql/impl/internal/channel/message_parser.ipp>
#include <boost/mysql/impl/internal/error/server_error_to_string.ipp>
#include <boost/mysql/impl/internal/protocol/binary_serialization.ipp>
#include <boost/mysql/impl/internal/protocol/deserialize_binary_field.ipp>
#include <boost/mysql/impl/internal/protocol/deserialize_text_field.ipp>
#include <boost/mysql/impl/internal/protocol/protocol.ipp>
#include <boost/mysql/impl/internal/protocol/protocol_field_type.ipp>
#include <boost/mysql/impl/meta_check_context.ipp>
#include <boost/mysql/impl/network_algorithms.ipp>
#include <boost/mysql/impl/results_impl.ipp>
#include <boost/mysql/impl/resultset.ipp>
#include <boost/mysql/impl/row_impl.ipp>
#include <boost/mysql/impl/static_execution_state_impl.ipp>
#include <boost/mysql/impl/static_results_impl.ipp>

#endif
