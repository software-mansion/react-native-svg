//
// Copyright (c) 2019-2023 Ruben Perez Hidalgo (rubenperez038 at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_MYSQL_IMPL_DATE_IPP
#define BOOST_MYSQL_IMPL_DATE_IPP

#pragma once

#include <boost/mysql/date.hpp>

#include <cstdio>
#include <ostream>

std::ostream& boost::mysql::operator<<(std::ostream& os, const date& value)
{
    // Worst-case output is 14 chars, extra space just in case
    char buffer[32]{};
    snprintf(
        buffer,
        sizeof(buffer),
        "%04u-%02u-%02u",
        static_cast<unsigned>(value.year()),
        static_cast<unsigned>(value.month()),
        static_cast<unsigned>(value.day())
    );
    os << buffer;
    return os;
}

#endif