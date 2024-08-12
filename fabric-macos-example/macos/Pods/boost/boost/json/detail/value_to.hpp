//
// Copyright (c) 2019 Vinnie Falco (vinnie.falco@gmail.com)
// Copyright (c) 2020 Krystian Stasiowski (sdkrystian@gmail.com)
// Copyright (c) 2021 Dmitry Arkhipov (grisumbras@gmail.com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//
// Official repository: https://github.com/boostorg/json
//

#ifndef BOOST_JSON_DETAIL_VALUE_TO_HPP
#define BOOST_JSON_DETAIL_VALUE_TO_HPP

#include <boost/json/value.hpp>
#include <boost/json/conversion.hpp>
#include <boost/describe/enum_from_string.hpp>

#ifndef BOOST_NO_CXX17_HDR_OPTIONAL
# include <optional>
#endif

namespace boost {
namespace json {

namespace detail {

template<class T>
using has_reserve_member_helper = decltype(std::declval<T&>().reserve(0));
template<class T>
using has_reserve_member = mp11::mp_valid<has_reserve_member_helper, T>;
template<class T>
using reserve_implementation = mp11::mp_cond<
    is_tuple_like<T>,      mp11::mp_int<2>,
    has_reserve_member<T>, mp11::mp_int<1>,
    mp11::mp_true,         mp11::mp_int<0>>;

template<class T>
error
try_reserve(
    T&,
    std::size_t size,
    mp11::mp_int<2>)
{
    constexpr std::size_t N = std::tuple_size<remove_cvref<T>>::value;
    if ( N != size )
        return error::size_mismatch;
    return error();
}

template<typename T>
error
try_reserve(
    T& cont,
    std::size_t size,
    mp11::mp_int<1>)
{
    cont.reserve(size);
    return error();
}

template<typename T>
error
try_reserve(
    T&,
    std::size_t,
    mp11::mp_int<0>)
{
    return error();
}


template<class T>
using has_push_back_helper
    = decltype(std::declval<T&>().push_back(std::declval<value_type<T>>()));
template<class T>
using has_push_back = mp11::mp_valid<has_push_back_helper, T>;
template<class T>
using inserter_implementation = mp11::mp_cond<
    is_tuple_like<T>, mp11::mp_int<2>,
    has_push_back<T>, mp11::mp_int<1>,
    mp11::mp_true,    mp11::mp_int<0>>;

template<class T>
iterator_type<T>
inserter(
    T& target,
    mp11::mp_int<2>)
{
    return target.begin();
}

template<class T>
std::back_insert_iterator<T>
inserter(
    T& target,
    mp11::mp_int<1>)
{
    return std::back_inserter(target);
}

template<class T>
std::insert_iterator<T>
inserter(
    T& target,
    mp11::mp_int<0>)
{
    return std::inserter( target, target.end() );
}

// identity conversion
template< class Ctx >
result<value>
value_to_impl(
    value_conversion_tag,
    try_value_to_tag<value>,
    value const& jv,
    Ctx const& )
{
    return jv;
}

template< class Ctx >
value
value_to_impl(
    value_conversion_tag, value_to_tag<value>, value const& jv, Ctx const& )
{
    return jv;
}

// object
template< class Ctx >
result<object>
value_to_impl(
    object_conversion_tag,
    try_value_to_tag<object>,
    value const& jv,
    Ctx const& )
{
    object const* obj = jv.if_object();
    if( obj )
        return *obj;
    error_code ec;
    BOOST_JSON_FAIL(ec, error::not_object);
    return ec;
}

// array
template< class Ctx >
result<array>
value_to_impl(
    array_conversion_tag,
    try_value_to_tag<array>,
    value const& jv,
    Ctx const& )
{
    array const* arr = jv.if_array();
    if( arr )
        return *arr;
    error_code ec;
    BOOST_JSON_FAIL(ec, error::not_array);
    return ec;
}

// string
template< class Ctx >
result<string>
value_to_impl(
    string_conversion_tag,
    try_value_to_tag<string>,
    value const& jv,
    Ctx const& )
{
    string const* str = jv.if_string();
    if( str )
        return *str;
    error_code ec;
    BOOST_JSON_FAIL(ec, error::not_string);
    return ec;
}

// bool
template< class Ctx >
result<bool>
value_to_impl(
    bool_conversion_tag, try_value_to_tag<bool>, value const& jv, Ctx const& )
{
    auto b = jv.if_bool();
    if( b )
        return *b;
    error_code ec;
    BOOST_JSON_FAIL(ec, error::not_bool);
    return {boost::system::in_place_error, ec};
}

// integral and floating point
template< class T, class Ctx >
result<T>
value_to_impl(
    number_conversion_tag, try_value_to_tag<T>, value const& jv, Ctx const& )
{
    error_code ec;
    auto const n = jv.to_number<T>(ec);
    if( ec.failed() )
        return {boost::system::in_place_error, ec};
    return {boost::system::in_place_value, n};
}

// null-like conversion
template< class T, class Ctx >
result<T>
value_to_impl(
    null_like_conversion_tag,
    try_value_to_tag<T>,
    value const& jv,
    Ctx const& )
{
    if( jv.is_null() )
        return {boost::system::in_place_value, T{}};
    error_code ec;
    BOOST_JSON_FAIL(ec, error::not_null);
    return {boost::system::in_place_error, ec};
}

// string-like types
template< class T, class Ctx >
result<T>
value_to_impl(
    string_like_conversion_tag,
    try_value_to_tag<T>,
    value const& jv,
    Ctx const& )
{
    auto str = jv.if_string();
    if( str )
        return {boost::system::in_place_value, T(str->subview())};
    error_code ec;
    BOOST_JSON_FAIL(ec, error::not_string);
    return {boost::system::in_place_error, ec};
}

// map-like containers
template< class T, class Ctx >
result<T>
value_to_impl(
    map_like_conversion_tag,
    try_value_to_tag<T>,
    value const& jv,
    Ctx const& ctx )
{
    object const* obj = jv.if_object();
    if( !obj )
    {
        error_code ec;
        BOOST_JSON_FAIL(ec, error::not_object);
        return {boost::system::in_place_error, ec};
    }

    T res;
    error const e = detail::try_reserve(
        res, obj->size(), reserve_implementation<T>());
    if( e != error() )
    {
        error_code ec;
        BOOST_JSON_FAIL( ec, e );
        return {boost::system::in_place_error, ec};
    }

    auto ins = detail::inserter(res, inserter_implementation<T>());
    for( key_value_pair const& kv: *obj )
    {
        auto elem_res = try_value_to<mapped_type<T>>( kv.value(), ctx );
        if( elem_res.has_error() )
            return {boost::system::in_place_error, elem_res.error()};
        *ins++ = value_type<T>{
            key_type<T>(kv.key()),
            std::move(*elem_res)};
    }
    return res;
}

// all other containers
template< class T, class Ctx >
result<T>
value_to_impl(
    sequence_conversion_tag,
    try_value_to_tag<T>,
    value const& jv,
    Ctx const& ctx )
{
    array const* arr = jv.if_array();
    if( !arr )
    {
        error_code ec;
        BOOST_JSON_FAIL(ec, error::not_array);
        return {boost::system::in_place_error, ec};
    }

    T result;
    error const e = detail::try_reserve(
        result, arr->size(), reserve_implementation<T>());
    if( e != error() )
    {
        error_code ec;
        BOOST_JSON_FAIL( ec, e );
        return {boost::system::in_place_error, ec};
    }

    auto ins = detail::inserter(result, inserter_implementation<T>());
    for( value const& val: *arr )
    {
        auto elem_res = try_value_to<value_type<T>>( val, ctx );
        if( elem_res.has_error() )
            return {boost::system::in_place_error, elem_res.error()};
        *ins++ = std::move(*elem_res);
    }
    return result;
}

// tuple-like types
template< class T, class Ctx >
result<T>
try_make_tuple_elem(value const& jv, Ctx const& ctx, error_code& ec)
{
    if( ec.failed() )
        return {boost::system::in_place_error, ec};

    auto result = try_value_to<T>( jv, ctx );
    ec = result.error();
    return result;
}

template <class T, class Ctx, std::size_t... Is>
result<T>
try_make_tuple_like(
    array const& arr, Ctx const& ctx, boost::mp11::index_sequence<Is...>)
{
    error_code ec;
    auto items = std::make_tuple(
        try_make_tuple_elem<
            typename std::decay<tuple_element_t<Is, T>>::type >(
                arr[Is], ctx, ec)
            ...);
    if( ec.failed() )
        return {boost::system::in_place_error, ec};

    return {
        boost::system::in_place_value, T(std::move(*std::get<Is>(items))...)};
}

template< class T, class Ctx >
result<T>
value_to_impl(
    tuple_conversion_tag,
    try_value_to_tag<T>,
    value const& jv,
    Ctx const& ctx )
{
    error_code ec;

    array const* arr = jv.if_array();
    if( !arr )
    {
        BOOST_JSON_FAIL(ec, error::not_array);
        return {boost::system::in_place_error, ec};
    }

    constexpr std::size_t N = std::tuple_size<remove_cvref<T>>::value;
    if( N != arr->size() )
    {
        BOOST_JSON_FAIL(ec, error::size_mismatch);
        return {boost::system::in_place_error, ec};
    }

    return try_make_tuple_like<T>(
        *arr, ctx, boost::mp11::make_index_sequence<N>());
}

template< class T>
struct is_optional
    : std::false_type
{ };

#ifndef BOOST_NO_CXX17_HDR_OPTIONAL
template< class T>
struct is_optional< std::optional<T> >
    : std::true_type
{ };
#endif // BOOST_NO_CXX17_HDR_OPTIONAL

template< class Ctx, class T, bool non_throwing = true >
struct to_described_member
{
    using Ds = describe::describe_members<
        T, describe::mod_public | describe::mod_inherited>;

    template< class D >
    using described_member_t = remove_cvref<decltype(
        std::declval<T&>().* D::pointer )>;

    using result_type = mp11::mp_eval_if_c< !non_throwing, T, result, T >;

    result_type& res;
    object const& obj;
    std::size_t count;
    Ctx const& ctx;

    template< class I >
    void
    operator()(I)
    {
        if( !res )
            return;

        using D = mp11::mp_at<Ds, I>;
        using M = described_member_t<D>;

        auto const found = obj.find(D::name);
        if( found == obj.end() )
        {
            BOOST_IF_CONSTEXPR( !is_optional<M>::value )
            {
                error_code ec;
                BOOST_JSON_FAIL(ec, error::unknown_name);
                res = {boost::system::in_place_error, ec};
            }
            return;
        }

#if defined(__GNUC__) && BOOST_GCC_VERSION >= 80000 && BOOST_GCC_VERSION < 11000
# pragma GCC diagnostic push
# pragma GCC diagnostic ignored "-Wunused"
# pragma GCC diagnostic ignored "-Wunused-variable"
#endif
        auto member_res = try_value_to<M>( found->value(), ctx );
#if defined(__GNUC__) && BOOST_GCC_VERSION >= 80000 && BOOST_GCC_VERSION < 11000
# pragma GCC diagnostic pop
#endif
        if( member_res )
        {
            (*res).* D::pointer = std::move(*member_res);
            ++count;
        }
        else
            res = {boost::system::in_place_error, member_res.error()};
    }
};

// described classes
template< class T, class Ctx >
result<T>
value_to_impl(
    described_class_conversion_tag,
    try_value_to_tag<T>,
    value const& jv,
    Ctx const& ctx )
{
    result<T> res;

    auto* obj = jv.if_object();
    if( !obj )
    {
        error_code ec;
        BOOST_JSON_FAIL(ec, error::not_object);
        res = {boost::system::in_place_error, ec};
        return res;
    }

    to_described_member< Ctx, T > member_converter{ res, *obj, 0u, ctx };

    using Ds = typename decltype(member_converter)::Ds;
    constexpr std::size_t N = mp11::mp_size<Ds>::value;
    mp11::mp_for_each< mp11::mp_iota_c<N> >(member_converter);

    if( !res )
        return res;

    if( member_converter.count != obj->size() )
    {
        error_code ec;
        BOOST_JSON_FAIL(ec, error::size_mismatch);
        res = {boost::system::in_place_error, ec};
        return res;
    }

    return res;
}

// described enums
template< class T, class Ctx >
result<T>
value_to_impl(
    described_enum_conversion_tag,
    try_value_to_tag<T>,
    value const& jv,
    Ctx const& )
{
    T val = {};
    (void)jv;
#ifdef BOOST_DESCRIBE_CXX14
    error_code ec;

    auto str = jv.if_string();
    if( !str )
    {
        BOOST_JSON_FAIL(ec, error::not_string);
        return {system::in_place_error, ec};
    }

    if( !describe::enum_from_string(str->data(), val) )
    {
        BOOST_JSON_FAIL(ec, error::unknown_name);
        return {system::in_place_error, ec};
    }
#endif

    return {system::in_place_value, val};
}

//----------------------------------------------------------
// User-provided conversions; throwing -> throwing
template< class T, class Ctx >
mp11::mp_if< mp11::mp_valid<has_user_conversion_to_impl, T>, T >
value_to_impl(
    user_conversion_tag, value_to_tag<T> tag, value const& jv, Ctx const&)
{
    return tag_invoke(tag, jv);
}

template<
    class T,
    class Ctx,
    class Sup = supported_context<Ctx, T, value_to_conversion>
>
mp11::mp_if<
    mp11::mp_valid< has_context_conversion_to_impl, typename Sup::type, T>, T >
value_to_impl(
    context_conversion_tag,
    value_to_tag<T> tag,
    value const& jv,
    Ctx const& ctx )
{
    return tag_invoke( tag, jv, Sup::get(ctx) );
}

template<
    class T,
    class Ctx,
    class Sup = supported_context<Ctx, T, value_to_conversion>
>
mp11::mp_if<
    mp11::mp_valid<
        has_full_context_conversion_to_impl, typename Sup::type, T>,
    T>
value_to_impl(
    full_context_conversion_tag,
    value_to_tag<T> tag,
    value const& jv,
    Ctx const& ctx )
{
    return tag_invoke( tag, jv, Sup::get(ctx), ctx );
}

//----------------------------------------------------------
// User-provided conversions; throwing -> nonthrowing
template< class T, class Ctx >
mp11::mp_if_c< !mp11::mp_valid<has_user_conversion_to_impl, T>::value, T>
value_to_impl(
    user_conversion_tag, value_to_tag<T>, value const& jv, Ctx const& )
{
    auto res = tag_invoke(try_value_to_tag<T>(), jv);
    if( res.has_error() )
        throw_system_error( res.error() );
    return std::move(*res);
}

template<
    class T,
    class Ctx,
    class Sup = supported_context<Ctx, T, value_to_conversion>
>
mp11::mp_if_c<
    !mp11::mp_valid<
        has_context_conversion_to_impl, typename Sup::type, T>::value,
    T>
value_to_impl(
    context_conversion_tag, value_to_tag<T>, value const& jv, Ctx const& ctx )
{
    auto res = tag_invoke( try_value_to_tag<T>(), jv, Sup::get(ctx) );
    if( res.has_error() )
        throw_system_error( res.error() );
    return std::move(*res);
}

template< class Ctx >
std::tuple<allow_exceptions, Ctx>
make_throwing_context(Ctx const& ctx)
{
    return std::tuple<allow_exceptions, Ctx>(allow_exceptions(), ctx);
}

template< class... Ctxes >
std::tuple<allow_exceptions, Ctxes...>
make_throwing_context(std::tuple<Ctxes...> const& ctx)
{
    return std::tuple_cat(std::make_tuple( allow_exceptions() ), ctx);
}

template< class... Ctxes >
std::tuple<allow_exceptions, Ctxes...> const&
make_throwing_context(std::tuple<allow_exceptions, Ctxes...> const& ctx)
    noexcept
{
    return ctx;
}

template<
    class T,
    class Ctx,
    class Sup = supported_context<Ctx, T, value_to_conversion>
>
mp11::mp_if_c<
    !mp11::mp_valid<
        has_full_context_conversion_to_impl, typename Sup::type, T>::value,
    T>
value_to_impl(
    full_context_conversion_tag,
    value_to_tag<T>,
    value const& jv,
    Ctx const& ctx )
{
    auto res = tag_invoke(
        try_value_to_tag<T>(),
        jv,
        Sup::get(ctx),
        make_throwing_context(ctx));
    if( res.has_error() )
        throw_system_error( res.error() );
    return std::move(*res);
}

//----------------------------------------------------------
// User-provided conversions; nonthrowing -> nonthrowing
template< class T, class Ctx >
mp11::mp_if<
    mp11::mp_valid<has_nonthrowing_user_conversion_to_impl, T>, result<T> >
value_to_impl(
    user_conversion_tag, try_value_to_tag<T>, value const& jv, Ctx const& )
{
    return tag_invoke(try_value_to_tag<T>(), jv);
}

template<
    class T,
    class Ctx,
    class Sup = supported_context<Ctx, T, value_to_conversion>
>
mp11::mp_if<
    mp11::mp_valid<
        has_nonthrowing_context_conversion_to_impl, typename Sup::type, T>,
    result<T> >
value_to_impl(
    context_conversion_tag,
    try_value_to_tag<T> tag,
    value const& jv,
    Ctx const& ctx )
{
    return tag_invoke( tag, jv, Sup::get(ctx) );
}

template<
    class T,
    class Ctx,
    class Sup = supported_context<Ctx, T, value_to_conversion>
>
mp11::mp_if<
    mp11::mp_valid<
        has_nonthrowing_full_context_conversion_to_impl,
        typename Sup::type,
        T>,
    result<T> >
value_to_impl(
    full_context_conversion_tag,
    try_value_to_tag<T> tag,
    value const& jv,
    Ctx const& ctx )
{
    return tag_invoke( tag, jv, Sup::get(ctx), ctx );
}

//----------------------------------------------------------
// User-provided conversions; nonthrowing -> throwing

template< class Ctx >
struct does_allow_exceptions : std::false_type
{ };

template< class... Ctxes >
struct does_allow_exceptions< std::tuple<allow_exceptions, Ctxes...> >
    : std::true_type
{ };

template< class T, class... Args >
result<T>
wrap_conversion_exceptions( std::true_type, value_to_tag<T>, Args&& ... args )
{
    return {
        boost::system::in_place_value,
        tag_invoke( value_to_tag<T>(), static_cast<Args&&>(args)... )};
}

template< class T, class... Args >
result<T>
wrap_conversion_exceptions( std::false_type, value_to_tag<T>, Args&& ... args )
{
#ifndef BOOST_NO_EXCEPTIONS
    try
    {
#endif
        return wrap_conversion_exceptions(
            std::true_type(),
            value_to_tag<T>(),
            static_cast<Args&&>(args)... );
#ifndef BOOST_NO_EXCEPTIONS
    }
    catch( std::bad_alloc const&)
    {
        throw;
    }
    catch( system_error const& e)
    {
        return {boost::system::in_place_error, e.code()};
    }
    catch( ... )
    {
        error_code ec;
        BOOST_JSON_FAIL(ec, error::exception);
        return {boost::system::in_place_error, ec};
    }
#endif
}

template< class T, class Ctx >
mp11::mp_if_c<
    !mp11::mp_valid<has_nonthrowing_user_conversion_to_impl, T>::value,
    result<T> >
value_to_impl(
    user_conversion_tag, try_value_to_tag<T>, value const& jv, Ctx const& )
{
    return wrap_conversion_exceptions(
        does_allow_exceptions<Ctx>(), value_to_tag<T>(), jv);
}

template<
    class T,
    class Ctx,
    class Sup = supported_context<Ctx, T, value_to_conversion>
>
mp11::mp_if_c<
    !mp11::mp_valid<
        has_nonthrowing_context_conversion_to_impl,
        typename Sup::type,
        T>::value,
    result<T> >
value_to_impl(
    context_conversion_tag,
    try_value_to_tag<T>,
    value const& jv,
    Ctx const& ctx )
{
    return wrap_conversion_exceptions(
        does_allow_exceptions<Ctx>(), value_to_tag<T>(), jv, Sup::get(ctx) );
}

template<
    class T,
    class Ctx,
    class Sup = supported_context<Ctx, T, value_to_conversion>
>
mp11::mp_if_c<
    !mp11::mp_valid<
        has_nonthrowing_full_context_conversion_to_impl,
        typename Sup::type,
        T>::value,
    result<T> >
value_to_impl(
    full_context_conversion_tag,
    try_value_to_tag<T>,
    value const& jv,
    Ctx const& ctx )
{
    return wrap_conversion_exceptions(
        does_allow_exceptions<Ctx>(),
        value_to_tag<T>(),
        jv,
        Sup::get(ctx),
        ctx);
}

// no suitable conversion implementation
template< class T, class Ctx >
T
value_to_impl( no_conversion_tag, value_to_tag<T>, value const&, Ctx const& )
{
    static_assert(
        !std::is_same<T, T>::value,
        "No suitable tag_invoke overload found for the type");
}

// generic wrapper over non-throwing implementations
template< class Impl, class T, class Ctx >
T
value_to_impl( Impl impl, value_to_tag<T>, value const& jv, Ctx const& ctx )
{
    return value_to_impl(
        impl, try_value_to_tag<T>(), jv, make_throwing_context(ctx) ).value();
}

template< class Ctx, class T >
using value_to_category = conversion_category<
    Ctx, T, value_to_conversion >;

} // detail

// std::optional
#ifndef BOOST_NO_CXX17_HDR_OPTIONAL
template< class T, class Ctx1, class Ctx2 >
result< std::optional<T> >
tag_invoke(
    try_value_to_tag< std::optional<T> >,
    value const& jv,
    Ctx1 const&,
    Ctx2 const& ctx)
{
    if( jv.is_null() )
        return std::optional<T>();
    else
        return try_value_to<T>(jv, ctx);
}

inline
result<std::nullopt_t>
tag_invoke(
    try_value_to_tag<std::nullopt_t>,
    value const& jv)
{
    if( jv.is_null() )
        return std::nullopt;
    error_code ec;
    BOOST_JSON_FAIL(ec, error::not_null);
    return ec;
}
#endif

// std::variant
#ifndef BOOST_NO_CXX17_HDR_VARIANT
template< class... Ts, class Ctx1, class Ctx2 >
result< std::variant<Ts...> >
tag_invoke(
    try_value_to_tag< std::variant<Ts...> >,
    value const& jv,
    Ctx1 const&,
    Ctx2 const& ctx)
{
    error_code ec;
    BOOST_JSON_FAIL(ec, error::exhausted_variants);

    using Variant = std::variant<Ts...>;
    result<Variant> res = {system::in_place_error, ec};
    mp11::mp_for_each< mp11::mp_iota_c<sizeof...(Ts)> >([&](auto I) {
        if( res )
            return;

        using T = std::variant_alternative_t<I.value, Variant>;
        auto attempt = try_value_to<T>(jv, ctx);
        if( attempt)
            res.emplace(std::in_place_index_t<I>(), std::move(*attempt));
    });

    return res;
}
#endif // BOOST_NO_CXX17_HDR_VARIANT

} // namespace json
} // namespace boost

#endif
