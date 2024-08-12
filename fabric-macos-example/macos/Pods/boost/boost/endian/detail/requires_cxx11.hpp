#ifndef BOOST_ENDIAN_DETAIL_REQUIRES_CXX11_HPP_INCLUDED
#define BOOST_ENDIAN_DETAIL_REQUIRES_CXX11_HPP_INCLUDED

// Copyright 2023 Peter Dimov
// Distributed under the Boost Software License, Version 1.0.
// https://www.boost.org/LICENSE_1_0.txt

#include <boost/config.hpp>
#include <boost/config/pragma_message.hpp>

#if defined(BOOST_NO_CXX11_VARIADIC_TEMPLATES) || \
    defined(BOOST_NO_CXX11_RVALUE_REFERENCES) || \
    defined(BOOST_NO_CXX11_DECLTYPE) || \
    defined(BOOST_NO_CXX11_CONSTEXPR) || \
    defined(BOOST_NO_CXX11_NOEXCEPT) || \
    defined(BOOST_NO_CXX11_SCOPED_ENUMS) || \
    defined(BOOST_NO_CXX11_DEFAULTED_FUNCTIONS)

BOOST_PRAGMA_MESSAGE("C++03 support was deprecated in Boost.Endian 1.82 and will be removed in Boost.Endian 1.84. Please open an issue in https://github.com/boostorg/endian if you want it retained.")

#endif

#endif // #ifndef BOOST_ENDIAN_DETAIL_REQUIRES_CXX11_HPP_INCLUDED
