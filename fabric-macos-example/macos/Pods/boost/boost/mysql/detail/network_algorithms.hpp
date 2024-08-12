//
// Copyright (c) 2019-2023 Ruben Perez Hidalgo (rubenperez038 at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_MYSQL_DETAIL_NETWORK_ALGORITHMS_HPP
#define BOOST_MYSQL_DETAIL_NETWORK_ALGORITHMS_HPP

#include <boost/mysql/diagnostics.hpp>
#include <boost/mysql/error_code.hpp>
#include <boost/mysql/execution_state.hpp>
#include <boost/mysql/field_view.hpp>
#include <boost/mysql/handshake_params.hpp>
#include <boost/mysql/rows_view.hpp>
#include <boost/mysql/statement.hpp>
#include <boost/mysql/string_view.hpp>

#include <boost/mysql/detail/access.hpp>
#include <boost/mysql/detail/any_execution_request.hpp>
#include <boost/mysql/detail/channel_ptr.hpp>
#include <boost/mysql/detail/config.hpp>
#include <boost/mysql/detail/execution_processor/execution_processor.hpp>
#include <boost/mysql/detail/typing/get_type_index.hpp>

#include <boost/asio/any_completion_handler.hpp>
#include <boost/mp11/integer_sequence.hpp>

#include <array>
#include <cstddef>

namespace boost {
namespace mysql {

template <class... StaticRow>
class static_execution_state;

namespace detail {

class channel;

template <class T>
using any_handler = asio::any_completion_handler<void(error_code, T)>;

using any_void_handler = asio::any_completion_handler<void(error_code)>;

// execution helpers
template <class... T, std::size_t... I>
std::array<field_view, sizeof...(T)> tuple_to_array_impl(const std::tuple<T...>& t, mp11::index_sequence<I...>) noexcept
{
    return std::array<field_view, sizeof...(T)>{{to_field(std::get<I>(t))...}};
}

template <class... T>
std::array<field_view, sizeof...(T)> tuple_to_array(const std::tuple<T...>& t) noexcept
{
    return tuple_to_array_impl(t, mp11::make_index_sequence<sizeof...(T)>());
}

struct query_request_getter
{
    any_execution_request value;
    any_execution_request get() const noexcept { return value; }
};
inline query_request_getter make_request_getter(string_view q, channel&) noexcept
{
    return query_request_getter{q};
}

struct stmt_it_request_getter
{
    statement stmt;
    span<const field_view> params;  // Points into channel shared_fields()

    any_execution_request get() const noexcept { return any_execution_request(stmt, params); }
};

template <class FieldViewFwdIterator>
inline stmt_it_request_getter make_request_getter(
    const bound_statement_iterator_range<FieldViewFwdIterator>& req,
    channel& chan
)
{
    auto& impl = access::get_impl(req);
    auto& shared_fields = get_shared_fields(chan);
    shared_fields.assign(impl.first, impl.last);
    return {impl.stmt, shared_fields};
}

template <std::size_t N>
struct stmt_tuple_request_getter
{
    statement stmt;
    std::array<field_view, N> params;

    any_execution_request get() const noexcept { return any_execution_request(stmt, params); }
};
template <class WritableFieldTuple>
stmt_tuple_request_getter<std::tuple_size<WritableFieldTuple>::value>
make_request_getter(const bound_statement_tuple<WritableFieldTuple>& req, channel&)
{
    auto& impl = access::get_impl(req);
    return {impl.stmt, tuple_to_array(impl.params)};
}

//
// connect
//
BOOST_MYSQL_DECL
void connect_erased(
    channel& chan,
    const void* endpoint,
    const handshake_params& params,
    error_code& err,
    diagnostics& diag
);

BOOST_MYSQL_DECL
void async_connect_erased(
    channel& chan,
    const void* endpoint,
    const handshake_params& params,
    diagnostics& diag,
    any_void_handler handler
);

// Handles casting from the generic EndpointType we've got in the interface to the concrete endpoint type
template <class Stream>
void connect_interface(
    channel& chan,
    const typename Stream::lowest_layer_type::endpoint_type& ep,
    const handshake_params& params,
    error_code& err,
    diagnostics& diag
)
{
    connect_erased(chan, &ep, params, err, diag);
}

template <class Stream>
struct connect_initiation
{
    template <class Handler>
    void operator()(
        Handler&& handler,
        channel* chan,
        const typename Stream::lowest_layer_type::endpoint_type& endpoint,
        handshake_params params,
        diagnostics* diag
    )
    {
        async_connect_erased(*chan, &endpoint, params, *diag, std::forward<Handler>(handler));
    }
};

template <class Stream, class CompletionToken>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code))
async_connect_interface(
    channel& chan,
    const typename Stream::lowest_layer_type::endpoint_type& endpoint,
    const handshake_params& params,
    diagnostics& diag,
    CompletionToken&& token
)
{
    return asio::async_initiate<CompletionToken, void(error_code)>(
        connect_initiation<Stream>(),
        token,
        &chan,
        endpoint,
        params,
        &diag
    );
}

//
// handshake
//
BOOST_MYSQL_DECL
void handshake_erased(channel& channel, const handshake_params& params, error_code& err, diagnostics& diag);

BOOST_MYSQL_DECL
void async_handshake_erased(
    channel& chan,
    const handshake_params& params,
    diagnostics& diag,
    any_void_handler
);

inline void handshake_interface(
    channel& channel,
    const handshake_params& params,
    error_code& err,
    diagnostics& diag
)
{
    handshake_erased(channel, params, err, diag);
}

struct handshake_initiation
{
    template <class Handler>
    void operator()(Handler&& handler, channel* chan, handshake_params params, diagnostics* diag)
    {
        async_handshake_erased(*chan, params, *diag, std::forward<Handler>(handler));
    }
};

template <class CompletionToken>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code))
async_handshake_interface(
    channel& chan,
    const handshake_params& params,
    diagnostics& diag,
    CompletionToken&& token
)
{
    return asio::async_initiate<CompletionToken, void(error_code)>(
        handshake_initiation(),
        token,
        &chan,
        params,
        &diag
    );
}

//
// execute
//
BOOST_MYSQL_DECL
void execute_erased(
    channel& channel,
    const any_execution_request& req,
    execution_processor& output,
    error_code& err,
    diagnostics& diag
);

BOOST_MYSQL_DECL void async_execute_erased(
    channel& chan,
    const any_execution_request& req,
    execution_processor& output,
    diagnostics& diag,
    any_void_handler handler
);

struct initiate_execute
{
    template <class Handler, class ExecutionRequest>
    void operator()(
        Handler&& handler,
        channel& chan,
        const ExecutionRequest& req,
        execution_processor& proc,
        diagnostics& diag
    )
    {
        auto getter = make_request_getter(req, chan);
        async_execute_erased(chan, getter.get(), proc, diag, std::forward<Handler>(handler));
    }
};

template <class ExecutionRequest, class ResultsType>
void execute_interface(
    channel& channel,
    const ExecutionRequest& req,
    ResultsType& result,
    error_code& err,
    diagnostics& diag
)
{
    auto getter = make_request_getter(req, channel);
    execute_erased(channel, getter.get(), access::get_impl(result).get_interface(), err, diag);
}

template <class ExecutionRequest, class ResultsType, class CompletionToken>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code))
async_execute_interface(
    channel& chan,
    ExecutionRequest&& req,
    ResultsType& result,
    diagnostics& diag,
    CompletionToken&& token
)
{
    return asio::async_initiate<CompletionToken, void(error_code)>(
        initiate_execute(),
        token,
        std::ref(chan),
        std::forward<ExecutionRequest>(req),
        std::ref(access::get_impl(result).get_interface()),
        std::ref(diag)
    );
}

//
// start_execution
//
BOOST_MYSQL_DECL
void start_execution_erased(
    channel& channel,
    const any_execution_request& req,
    execution_processor& proc,
    error_code& err,
    diagnostics& diag
);

BOOST_MYSQL_DECL
void async_start_execution_erased(
    channel& channel,
    const any_execution_request& req,
    execution_processor& proc,
    diagnostics& diag,
    any_void_handler handler
);

struct initiate_start_execution
{
    template <class Handler, class ExecutionRequest>
    void operator()(
        Handler&& handler,
        channel& chan,
        const ExecutionRequest& req,
        execution_processor& proc,
        diagnostics& diag
    )
    {
        auto getter = make_request_getter(req, chan);
        async_start_execution_erased(chan, getter.get(), proc, diag, std::forward<Handler>(handler));
    }
};

template <class ExecutionRequest, class ExecutionStateType>
void start_execution_interface(
    channel& channel,
    const ExecutionRequest& req,
    ExecutionStateType& st,
    error_code& err,
    diagnostics& diag
)
{
    auto getter = make_request_getter(req, channel);
    start_execution_erased(channel, getter.get(), access::get_impl(st).get_interface(), err, diag);
}

template <class ExecutionRequest, class ExecutionStateType, class CompletionToken>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code))
async_start_execution_interface(
    channel& chan,
    ExecutionRequest&& req,
    ExecutionStateType& st,
    diagnostics& diag,
    CompletionToken&& token
)
{
    return asio::async_initiate<CompletionToken, void(error_code)>(
        initiate_start_execution(),
        token,
        std::ref(chan),
        std::forward<ExecutionRequest>(req),
        std::ref(access::get_impl(st).get_interface()),
        std::ref(diag)
    );
}

//
// prepare_statement
//
BOOST_MYSQL_DECL
statement prepare_statement_erased(channel& chan, string_view stmt, error_code& err, diagnostics& diag);

BOOST_MYSQL_DECL void async_prepare_statement_erased(
    channel& chan,
    string_view stmt,
    diagnostics& diag,
    any_handler<statement> handler
);

struct prepare_statement_initiation
{
    template <class Handler>
    void operator()(Handler&& handler, channel* chan, string_view stmt_sql, diagnostics* diag)
    {
        async_prepare_statement_erased(*chan, stmt_sql, *diag, std::forward<Handler>(handler));
    }
};

inline statement prepare_statement_interface(
    channel& chan,
    string_view stmt,
    error_code& err,
    diagnostics& diag
)
{
    return prepare_statement_erased(chan, stmt, err, diag);
}

template <class CompletionToken>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(boost::mysql::error_code, boost::mysql::statement))
async_prepare_statement_interface(channel& chan, string_view stmt, diagnostics& diag, CompletionToken&& token)
{
    return asio::async_initiate<CompletionToken, void(error_code, statement)>(
        prepare_statement_initiation(),
        token,
        &chan,
        stmt,
        &diag
    );
}

//
// close_statement
//
BOOST_MYSQL_DECL
void close_statement_erased(channel& chan, const statement& stmt, error_code& err, diagnostics& diag);

BOOST_MYSQL_DECL
void async_close_statement_erased(
    channel& chan,
    const statement& stmt,
    diagnostics& diag,
    any_void_handler handler
);

struct close_statement_initiation
{
    template <class Handler>
    void operator()(Handler&& handler, channel* chan, statement stmt, diagnostics* diag)
    {
        async_close_statement_erased(*chan, stmt, *diag, std::forward<Handler>(handler));
    }
};

inline void close_statement_interface(
    channel& chan,
    const statement& stmt,
    error_code& err,
    diagnostics& diag
)
{
    close_statement_erased(chan, stmt, err, diag);
}

template <class CompletionToken>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code))
async_close_statement_interface(
    channel& chan,
    const statement& stmt,
    diagnostics& diag,
    CompletionToken&& token
)
{
    return asio::async_initiate<CompletionToken, void(error_code)>(
        close_statement_initiation(),
        token,
        &chan,
        stmt,
        &diag
    );
}

//
// read_some_rows (dynamic)
//
BOOST_MYSQL_DECL
rows_view read_some_rows_dynamic_erased(
    channel& chan,
    execution_state_impl& st,
    error_code& err,
    diagnostics& diag
);

BOOST_MYSQL_DECL void async_read_some_rows_dynamic_erased(
    channel& chan,
    execution_state_impl& st,
    diagnostics& diag,
    any_handler<rows_view> handler
);

struct read_some_rows_dynamic_initiation
{
    template <class Handler>
    void operator()(Handler&& handler, channel* chan, execution_state_impl* st, diagnostics* diag)
    {
        async_read_some_rows_dynamic_erased(*chan, *st, *diag, std::forward<Handler>(handler));
    }
};

inline rows_view read_some_rows_dynamic_interface(
    channel& chan,
    execution_state& st,
    error_code& err,
    diagnostics& diag
)
{
    return read_some_rows_dynamic_erased(chan, access::get_impl(st), err, diag);
}

template <class CompletionToken>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code, rows_view))
async_read_some_rows_dynamic_interface(
    channel& chan,
    execution_state& st,
    diagnostics& diag,
    CompletionToken&& token
)
{
    return asio::async_initiate<CompletionToken, void(error_code, rows_view)>(
        read_some_rows_dynamic_initiation(),
        token,
        &chan,
        &access::get_impl(st).get_interface(),
        &diag
    );
}

//
// read_some_rows (static)
//
BOOST_MYSQL_DECL
std::size_t read_some_rows_static_erased(
    channel& chan,
    execution_processor& proc,
    const output_ref& output,
    error_code& err,
    diagnostics& diag
);

BOOST_MYSQL_DECL
void async_read_some_rows_erased(
    channel& chan,
    execution_processor& proc,
    const output_ref& output,
    diagnostics& diag,
    any_handler<std::size_t> handler
);

template <class SpanRowType, class... RowType>
std::size_t read_some_rows_static_interface(
    channel& chan,
    static_execution_state<RowType...>& st,
    span<SpanRowType> output,
    error_code& err,
    diagnostics& diag
)
{
    constexpr std::size_t index = get_type_index<SpanRowType, RowType...>();
    static_assert(index != index_not_found, "SpanRowType must be one of the types returned by the query");

    return read_some_rows_static_erased(
        chan,
        access::get_impl(st).get_interface(),
        output_ref(output, index),
        err,
        diag
    );
}

struct read_some_rows_static_initiation
{
    template <class Handler>
    void operator()(
        Handler&& handler,
        channel* chan,
        execution_processor* proc,
        const output_ref& output,
        diagnostics* diag
    )
    {
        async_read_some_rows_erased(*chan, *proc, output, *diag, std::forward<Handler>(handler));
    }
};

template <
    class SpanRowType,
    class... RowType,
    BOOST_ASIO_COMPLETION_TOKEN_FOR(void(::boost::mysql::error_code, std::size_t)) CompletionToken>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code, rows_view))
async_read_some_rows_static_interface(
    channel& chan,
    static_execution_state<RowType...>& st,
    span<SpanRowType> output,
    diagnostics& diag,
    CompletionToken&& token
)
{
    constexpr std::size_t index = get_type_index<SpanRowType, RowType...>();
    static_assert(index != index_not_found, "SpanRowType must be one of the types returned by the query");

    return asio::async_initiate<CompletionToken, void(error_code, std::size_t)>(
        read_some_rows_static_initiation(),
        token,
        &chan,
        &access::get_impl(st).get_interface(),
        output_ref(output, index),
        &diag
    );
}

//
// read_resultset_head
//
BOOST_MYSQL_DECL
void read_resultset_head_erased(
    channel& channel,
    execution_processor& proc,
    error_code& err,
    diagnostics& diag
);

BOOST_MYSQL_DECL
void async_read_resultset_head_erased(
    channel& chan,
    execution_processor& proc,
    diagnostics& diag,
    any_void_handler handler
);

template <class ExecutionStateType>
void read_resultset_head_interface(
    channel& channel,
    ExecutionStateType& st,
    error_code& err,
    diagnostics& diag
)
{
    read_resultset_head_erased(channel, access::get_impl(st).get_interface(), err, diag);
}

struct read_resultset_head_initiation
{
    template <class Handler>
    void operator()(Handler&& handler, channel* chan, execution_processor* proc, diagnostics* diag)
    {
        async_read_resultset_head_erased(*chan, *proc, *diag, std::forward<Handler>(handler));
    }
};

template <class CompletionToken, class ExecutionStateType>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code))
async_read_resultset_head_interface(
    channel& chan,
    ExecutionStateType& st,
    diagnostics& diag,
    CompletionToken&& token
)
{
    return asio::async_initiate<CompletionToken, void(error_code)>(
        read_resultset_head_initiation(),
        token,
        &chan,
        &access::get_impl(st).get_interface(),
        &diag
    );
}

//
// ping
//
BOOST_MYSQL_DECL
void ping_erased(channel& chan, error_code& code, diagnostics& diag);

BOOST_MYSQL_DECL
void async_ping_erased(channel& chan, diagnostics& diag, any_void_handler handler);

struct ping_initiation
{
    template <class Handler>
    void operator()(Handler&& handler, channel* chan, diagnostics* diag)
    {
        async_ping_erased(*chan, *diag, std::forward<Handler>(handler));
    }
};

inline void ping_interface(channel& chan, error_code& code, diagnostics& diag)
{
    ping_erased(chan, code, diag);
}

template <class CompletionToken>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code))
async_ping_interface(channel& chan, diagnostics& diag, CompletionToken&& token)
{
    return asio::async_initiate<CompletionToken, void(error_code)>(ping_initiation(), token, &chan, &diag);
}

//
// close connection
//
BOOST_MYSQL_DECL
void close_connection_erased(channel& chan, error_code& code, diagnostics& diag);

BOOST_MYSQL_DECL
void async_close_connection_erased(channel& chan, diagnostics& diag, any_void_handler handler);

struct close_connection_initiation
{
    template <class Handler>
    void operator()(Handler&& handler, channel* chan, diagnostics* diag)
    {
        async_close_connection_erased(*chan, *diag, std::forward<Handler>(handler));
    }
};

inline void close_connection_interface(channel& chan, error_code& code, diagnostics& diag)
{
    close_connection_erased(chan, code, diag);
}

template <class CompletionToken>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code))
async_close_connection_interface(channel& chan, diagnostics& diag, CompletionToken&& token)
{
    return asio::async_initiate<CompletionToken, void(error_code)>(
        close_connection_initiation(),
        token,
        &chan,
        &diag
    );
}

//
// quit connection
//
BOOST_MYSQL_DECL
void quit_connection_erased(channel& chan, error_code& err, diagnostics& diag);

BOOST_MYSQL_DECL
void async_quit_connection_erased(channel& chan, diagnostics& diag, any_void_handler handler);

struct quit_connection_initiation
{
    template <class Handler>
    void operator()(Handler&& handler, channel* chan, diagnostics* diag)
    {
        async_quit_connection_erased(*chan, *diag, std::forward<Handler>(handler));
    }
};

inline void quit_connection_interface(channel& chan, error_code& err, diagnostics& diag)
{
    quit_connection_erased(chan, err, diag);
}

template <class CompletionToken>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code))
async_quit_connection_interface(channel& chan, diagnostics& diag, CompletionToken&& token)
{
    return asio::async_initiate<CompletionToken, void(error_code)>(
        quit_connection_initiation(),
        token,
        &chan,
        &diag
    );
}

}  // namespace detail
}  // namespace mysql
}  // namespace boost

#ifdef BOOST_MYSQL_HEADER_ONLY
#include <boost/mysql/impl/network_algorithms.ipp>
#endif

#endif
