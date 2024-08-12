//
// Copyright (c) 2019-2023 Ruben Perez Hidalgo (rubenperez038 at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_MYSQL_IMPL_FIELD_VIEW_IPP
#define BOOST_MYSQL_IMPL_FIELD_VIEW_IPP

#pragma once

#include <boost/mysql/field_view.hpp>

#include <boost/mysql/detail/config.hpp>

#include <ostream>

namespace boost {
namespace mysql {
namespace detail {

BOOST_MYSQL_STATIC_OR_INLINE
std::ostream& print_blob(std::ostream& os, blob_view value)
{
    if (value.empty())
        return os << "{}";

    char buffer[16]{};

    os << "{ ";
    for (std::size_t i = 0; i < value.size(); ++i)
    {
        if (i != 0)
            os << ", ";
        unsigned byte = value[i];
        std::snprintf(buffer, sizeof(buffer), "0x%02x", byte);
        os << buffer;
    }
    os << " }";
    return os;
}

BOOST_MYSQL_STATIC_OR_INLINE
std::ostream& print_time(std::ostream& os, const boost::mysql::time& value)
{
    // Worst-case output is 26 chars, extra space just in case
    char buffer[64]{};

    using namespace std::chrono;
    const char* sign = value < microseconds(0) ? "-" : "";
    auto num_micros = value % seconds(1);
    auto num_secs = duration_cast<seconds>(value % minutes(1) - num_micros);
    auto num_mins = duration_cast<minutes>(value % hours(1) - num_secs);
    auto num_hours = duration_cast<hours>(value - num_mins);

    snprintf(
        buffer,
        sizeof(buffer),
        "%s%02d:%02u:%02u.%06u",
        sign,
        static_cast<int>(std::abs(num_hours.count())),
        static_cast<unsigned>(std::abs(num_mins.count())),
        static_cast<unsigned>(std::abs(num_secs.count())),
        static_cast<unsigned>(std::abs(num_micros.count()))
    );

    os << buffer;
    return os;
}

}  // namespace detail
}  // namespace mysql
}  // namespace boost

std::ostream& boost::mysql::operator<<(std::ostream& os, const field_view& value)
{
    // Make operator<< work for detail::string_view_offset types
    if (value.impl_.is_string_offset() || value.impl_.is_blob_offset())
    {
        return os << "<sv_offset>";
    }

    switch (value.kind())
    {
    case field_kind::null: return os << "<NULL>";
    case field_kind::int64: return os << value.get_int64();
    case field_kind::uint64: return os << value.get_uint64();
    case field_kind::string: return os << value.get_string();
    case field_kind::blob: return detail::print_blob(os, value.get_blob());
    case field_kind::float_: return os << value.get_float();
    case field_kind::double_: return os << value.get_double();
    case field_kind::date: return os << value.get_date();
    case field_kind::datetime: return os << value.get_datetime();
    case field_kind::time: return detail::print_time(os, value.get_time());
    default: BOOST_ASSERT(false); return os;
    }
}

#endif