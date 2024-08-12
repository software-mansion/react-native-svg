
// Copyright (C) 2008-2016 Daniel James.
// Copyright (C) 2022 Christian Mazakas
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)

#ifndef BOOST_UNORDERED_FWD_HPP_INCLUDED
#define BOOST_UNORDERED_FWD_HPP_INCLUDED

#include <boost/config.hpp>
#if defined(BOOST_HAS_PRAGMA_ONCE)
#pragma once
#endif

#include <boost/predef.h>

#if defined(BOOST_UNORDERED_HAVE_PIECEWISE_CONSTRUCT)
// Already defined.
#elif defined(BOOST_LIBSTDCXX11)
// https://github.com/gcc-mirror/gcc/blob/gcc-4_6-branch/libstdc++-v3/include/bits/stl_pair.h#L70
#if BOOST_LIBSTDCXX_VERSION > 40600
#define BOOST_UNORDERED_HAVE_PIECEWISE_CONSTRUCT 1
#endif
#elif BOOST_LIB_STD_CXX
// https://github.com/llvm-mirror/libcxx/blob/release_30/include/utility#L206
#if BOOST_LIB_STD_CXX >= BOOST_VERSION_NUMBER(3, 0, 0)
#define BOOST_UNORDERED_HAVE_PIECEWISE_CONSTRUCT 1
#endif
#elif defined(BOOST_LIB_STD_DINKUMWARE)
// Apparently C++11 standard supported in Visual Studio 2012
// https://msdn.microsoft.com/en-us/library/hh567368.aspx#stl
// 2012 = VC+11 = BOOST_MSVC 1700 Hopefully!
// I have no idea when Dinkumware added it, probably a lot
// earlier than this check.
#if BOOST_LIB_STD_DINKUMWARE >= BOOST_VERSION_NUMBER(6, 10, 0) ||              \
  BOOST_COMP_MSVC >= BOOST_VERSION_NUMBER(17, 0, 0)
#define BOOST_UNORDERED_HAVE_PIECEWISE_CONSTRUCT 1
#endif
#endif

// Assume that an unknown library does not support piecewise construction.
#if !defined(BOOST_UNORDERED_HAVE_PIECEWISE_CONSTRUCT)
#define BOOST_UNORDERED_HAVE_PIECEWISE_CONSTRUCT 0
#endif

#if BOOST_UNORDERED_HAVE_PIECEWISE_CONSTRUCT
#include <utility>
#endif

namespace boost {
  namespace unordered {
#if BOOST_UNORDERED_HAVE_PIECEWISE_CONSTRUCT
    using std::piecewise_construct_t;
    using std::piecewise_construct;
#else
    struct piecewise_construct_t
    {
    };
    const piecewise_construct_t piecewise_construct = piecewise_construct_t();
#endif
  }
}

// BOOST_UNORDERED_EMPLACE_LIMIT = The maximum number of parameters in
// emplace (not including things like hints). Don't set it to a lower value, as
// that might break something.

#if !defined BOOST_UNORDERED_EMPLACE_LIMIT
#define BOOST_UNORDERED_EMPLACE_LIMIT 10
#endif

////////////////////////////////////////////////////////////////////////////////
// Configuration
//
// Unless documented elsewhere these configuration macros should be considered
// an implementation detail, I'll try not to break them, but you never know.

// Use Sun C++ workarounds
// I'm not sure which versions of the compiler require these workarounds, so
// I'm just using them of everything older than the current test compilers
// (as of May 2017).

#if !defined(BOOST_UNORDERED_SUN_WORKAROUNDS1)
#if BOOST_COMP_SUNPRO && BOOST_COMP_SUNPRO < BOOST_VERSION_NUMBER(5, 20, 0)
#define BOOST_UNORDERED_SUN_WORKAROUNDS1 1
#else
#define BOOST_UNORDERED_SUN_WORKAROUNDS1 0
#endif
#endif

// BOOST_UNORDERED_TUPLE_ARGS
//
// Maximum number of std::tuple members to support, or 0 if std::tuple
// isn't avaiable. More are supported when full C++11 is used.

// Already defined, so do nothing
#if defined(BOOST_UNORDERED_TUPLE_ARGS)

// Assume if we have C++11 tuple it's properly variadic,
// and just use a max number of 10 arguments.
#elif !defined(BOOST_NO_CXX11_HDR_TUPLE)
#define BOOST_UNORDERED_TUPLE_ARGS 10

// Visual C++ has a decent enough tuple for piecewise construction,
// so use that if available, using _VARIADIC_MAX for the maximum
// number of parameters. Note that this comes after the check
// for a full C++11 tuple.
#elif defined(BOOST_MSVC)
#if !BOOST_UNORDERED_HAVE_PIECEWISE_CONSTRUCT
#define BOOST_UNORDERED_TUPLE_ARGS 0
#elif defined(_VARIADIC_MAX)
#define BOOST_UNORDERED_TUPLE_ARGS _VARIADIC_MAX
#else
#define BOOST_UNORDERED_TUPLE_ARGS 5
#endif

// Assume that we don't have std::tuple
#else
#define BOOST_UNORDERED_TUPLE_ARGS 0
#endif

#if BOOST_UNORDERED_TUPLE_ARGS
#include <tuple>
#endif

// BOOST_UNORDERED_CXX11_CONSTRUCTION
//
// Use C++11 construction, requires variadic arguments, good construct support
// in allocator_traits and piecewise construction of std::pair
// Otherwise allocators aren't used for construction/destruction

#if BOOST_UNORDERED_HAVE_PIECEWISE_CONSTRUCT &&                                \
  !defined(BOOST_NO_CXX11_VARIADIC_TEMPLATES) && BOOST_UNORDERED_TUPLE_ARGS
#if BOOST_COMP_SUNPRO && BOOST_LIB_STD_GNU
// Sun C++ std::pair piecewise construction doesn't seem to be exception safe.
// (At least for Sun C++ 12.5 using libstdc++).
#define BOOST_UNORDERED_CXX11_CONSTRUCTION 0
#elif BOOST_COMP_GNUC && BOOST_COMP_GNUC < BOOST_VERSION_NUMBER(4, 7, 0)
// Piecewise construction in GCC 4.6 doesn't work for uncopyable types.
#define BOOST_UNORDERED_CXX11_CONSTRUCTION 0
#elif !defined(BOOST_NO_CXX11_ALLOCATOR)
#define BOOST_UNORDERED_CXX11_CONSTRUCTION 1
#endif
#endif

#if !defined(BOOST_UNORDERED_CXX11_CONSTRUCTION)
#define BOOST_UNORDERED_CXX11_CONSTRUCTION 0
#endif

#endif
