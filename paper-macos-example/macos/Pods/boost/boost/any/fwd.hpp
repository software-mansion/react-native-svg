// Copyright Antony Polukhin, 2021-2023.
//
// Distributed under the Boost Software License, Version 1.0. (See
// accompanying file LICENSE_1_0.txt or copy at
// http://www.boost.org/LICENSE_1_0.txt)

// Contributed by Ruslan Arutyunyan
#ifndef BOOST_ANY_ANYS_FWD_HPP
#define BOOST_ANY_ANYS_FWD_HPP

#include <boost/config.hpp>
#ifdef BOOST_HAS_PRAGMA_ONCE
# pragma once
#endif

/// \file boost/any/fwd.hpp
/// \brief Forward declarations of Boost.Any library types.


#include <boost/config/pragma_message.hpp>
#if defined(BOOST_NO_CXX11_RVALUE_REFERENCES) || \
    defined(BOOST_NO_CXX11_AUTO_DECLARATIONS) || \
    defined(BOOST_NO_CXX11_CONSTEXPR) || \
    defined(BOOST_NO_CXX11_NULLPTR) || \
    defined(BOOST_NO_CXX11_NOEXCEPT) || \
    defined(BOOST_NO_CXX11_DEFAULTED_FUNCTIONS) || \
    defined(BOOST_NO_CXX11_FINAL) || \
    defined(BOOST_NO_CXX11_ALIGNOF) || \
    defined(BOOST_NO_CXX11_STATIC_ASSERT) || \
    defined(BOOST_NO_CXX11_SMART_PTR) || \
    defined(BOOST_NO_CXX11_HDR_INITIALIZER_LIST) || \
    defined(BOOST_NO_CXX11_HDR_TYPE_TRAITS)

BOOST_PRAGMA_MESSAGE("C++03 support is deprecated in Boost.Any 1.82 and will be removed in Boost.Any 1.84.")

#endif

#include <boost/type_traits/alignment_of.hpp>

/// @cond
namespace boost {

class any;

namespace anys {

class unique_any;

template<std::size_t OptimizeForSize = sizeof(void*), std::size_t OptimizeForAlignment = boost::alignment_of<void*>::value>
class basic_any;

namespace detail {

    template <class T>
    struct is_basic_any: public boost::false_type {};

    template<std::size_t OptimizeForSize, std::size_t OptimizeForAlignment>
    struct is_basic_any<boost::anys::basic_any<OptimizeForSize, OptimizeForAlignment> > : public boost::true_type {};

    template <class T>
    struct is_some_any: public is_basic_any<T> {};

    template <>
    struct is_some_any<boost::any>: public boost::true_type {};

    template <>
    struct is_some_any<boost::anys::unique_any>: public boost::true_type {};

} // namespace detail

} // namespace anys

} // namespace boost
/// @endcond

#endif  // #ifndef BOOST_ANY_ANYS_FWD_HPP
