//
// Copyright (c) 2019-2023 Ruben Perez Hidalgo (rubenperez038 at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_MYSQL_IMPL_INTERNAL_CHANNEL_VALGRIND_HPP
#define BOOST_MYSQL_IMPL_INTERNAL_CHANNEL_VALGRIND_HPP

#include <cstddef>

#ifdef BOOST_MYSQL_VALGRIND_TESTS
#include <valgrind/memcheck.h>
#endif

namespace boost {
namespace mysql {
namespace detail {

#ifdef BOOST_MYSQL_VALGRIND_TESTS

inline void valgrind_make_mem_defined(const void* data, std::size_t size)
{
    VALGRIND_MAKE_MEM_DEFINED(data, size);
}

#else

inline void valgrind_make_mem_defined(const void*, std::size_t) noexcept {}

#endif

}  // namespace detail
}  // namespace mysql
}  // namespace boost

#endif /* INCLUDE_BOOST_MYSQL_DETAIL_AUXILIAR_VALGRIND_HPP_ */
