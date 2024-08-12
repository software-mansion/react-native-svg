//
// Copyright (c) 2019-2023 Ruben Perez Hidalgo (rubenperez038 at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_MYSQL_IMPL_DATETIME_IPP
#define BOOST_MYSQL_IMPL_DATETIME_IPP

#pragma once

#include <boost/mysql/datetime.hpp>

#include <cstdio>
#include <ostream>

std::ostream& boost::mysql::operator<<(std::ostream& os, const datetime& value)
{
    // Worst-case output is 37 chars, extra space just in case
    char buffer[64]{};
    snprintf(
        buffer,
        sizeof(buffer),
        "%04u-%02u-%02u %02d:%02u:%02u.%06u",
        static_cast<unsigned>(value.year()),
        static_cast<unsigned>(value.month()),
        static_cast<unsigned>(value.day()),
        static_cast<unsigned>(value.hour()),
        static_cast<unsigned>(value.minute()),
        static_cast<unsigned>(value.second()),
        static_cast<unsigned>(value.microsecond())
    );
    os << buffer;
    return os;
}

#endif