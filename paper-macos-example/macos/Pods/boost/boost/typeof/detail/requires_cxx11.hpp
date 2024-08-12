#ifndef BOOST_TYPEOF_DETAIL_REQUIRES_CXX11_HPP_INCLUDED
#define BOOST_TYPEOF_DETAIL_REQUIRES_CXX11_HPP_INCLUDED

// Copyright 2023 Peter Dimov
// Distributed under the Boost Software License, Version 1.0.
// https://www.boost.org/LICENSE_1_0.txt

#include <boost/config.hpp>
#include <boost/config/pragma_message.hpp>

#if defined(BOOST_NO_CXX11_DECLTYPE) || \
    defined(BOOST_NO_CXX11_TEMPLATE_ALIASES)

BOOST_PRAGMA_MESSAGE("C++03 support was deprecated in Boost.Typeof 1.82 and will be removed in Boost.Typeof 1.84.")

#endif

#endif // #ifndef BOOST_TYPEOF_DETAIL_REQUIRES_CXX11_HPP_INCLUDED
