// Copyright (C) 2005 Arkadiy Vertleyb, Peder Holt.
// Use, modification and distribution is subject to the Boost Software
// License, Version 1.0. (http://www.boost.org/LICENSE_1_0.txt)

#ifndef BOOST_TYPEOF_STD_memory_hpp_INCLUDED
#define BOOST_TYPEOF_STD_memory_hpp_INCLUDED

#include <boost/typeof/typeof.hpp>
#include <boost/config.hpp>
#include <memory>

#include BOOST_TYPEOF_INCREMENT_REGISTRATION_GROUP()

BOOST_TYPEOF_REGISTER_TEMPLATE(std::allocator, 1)

#if BOOST_CXX_VERSION < 202000L
BOOST_TYPEOF_REGISTER_TEMPLATE(std::raw_storage_iterator, 2)
#endif

#ifndef BOOST_NO_AUTO_PTR
BOOST_TYPEOF_REGISTER_TEMPLATE(std::auto_ptr, 1)
#endif//BOOST_NO_AUTO_PTR

#endif//BOOST_TYPEOF_STD_memory_hpp_INCLUDED
