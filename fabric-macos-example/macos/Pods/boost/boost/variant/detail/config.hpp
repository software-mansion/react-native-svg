//-----------------------------------------------------------------------------
// boost variant/detail/config.hpp header file
// See http://www.boost.org for updates, documentation, and revision history.
//-----------------------------------------------------------------------------
//
// Copyright (c) 2003 Eric Friedman
// Copyright (c) 2016-2023 Antony Polukhin
//
// Distributed under the Boost Software License, Version 1.0. (See
// accompanying file LICENSE_1_0.txt or copy at
// http://www.boost.org/LICENSE_1_0.txt)

#ifndef BOOST_VARIANT_DETAIL_CONFIG_HPP
#define BOOST_VARIANT_DETAIL_CONFIG_HPP

#include <boost/config.hpp>
#include <boost/detail/workaround.hpp>

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

BOOST_PRAGMA_MESSAGE("C++03 support is deprecated in Boost.Variant 1.82 and will be removed in Boost.Variant 1.84.")

#endif

#endif // BOOST_VARIANT_DETAIL_CONFIG_HPP
