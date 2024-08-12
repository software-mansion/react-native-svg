//
// Copyright (c) 2019-2023 Ruben Perez Hidalgo (rubenperez038 at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_MYSQL_IMPL_INTERNAL_PROTOCOL_DESERIALIZE_TEXT_FIELD_IPP
#define BOOST_MYSQL_IMPL_INTERNAL_PROTOCOL_DESERIALIZE_TEXT_FIELD_IPP

#pragma once

#include <boost/mysql/blob_view.hpp>
#include <boost/mysql/datetime.hpp>
#include <boost/mysql/field_view.hpp>
#include <boost/mysql/metadata.hpp>
#include <boost/mysql/string_view.hpp>

#include <boost/mysql/detail/config.hpp>
#include <boost/mysql/detail/datetime.hpp>

#include <boost/mysql/impl/internal/protocol/bit_deserialization.hpp>
#include <boost/mysql/impl/internal/protocol/constants.hpp>
#include <boost/mysql/impl/internal/protocol/deserialize_text_field.hpp>
#include <boost/mysql/impl/internal/protocol/serialization.hpp>

#include <boost/assert.hpp>
#include <boost/lexical_cast/try_lexical_convert.hpp>

#include <cmath>
#include <cstddef>
#include <cstdlib>
#include <type_traits>

namespace boost {
namespace mysql {
namespace detail {

#ifdef BOOST_MSVC
#pragma warning(push)
#pragma warning(disable : 4996)  // MSVC doesn't like my sscanf's
#endif

// Constants
BOOST_MYSQL_STATIC_IF_COMPILED constexpr unsigned max_decimals = 6u;

namespace textc {
BOOST_MYSQL_STATIC_IF_COMPILED constexpr std::size_t year_sz = 4;
BOOST_MYSQL_STATIC_IF_COMPILED constexpr std::size_t month_sz = 2;
BOOST_MYSQL_STATIC_IF_COMPILED constexpr std::size_t day_sz = 2;
BOOST_MYSQL_STATIC_IF_COMPILED constexpr std::size_t hours_min_sz = 2;  // in TIME, it may be longer
BOOST_MYSQL_STATIC_IF_COMPILED constexpr std::size_t mins_sz = 2;
BOOST_MYSQL_STATIC_IF_COMPILED constexpr std::size_t secs_sz = 2;

BOOST_MYSQL_STATIC_IF_COMPILED constexpr std::size_t date_sz = year_sz + month_sz + day_sz + 2;  // delimiters
BOOST_MYSQL_STATIC_IF_COMPILED constexpr std::size_t time_min_sz = hours_min_sz + mins_sz + secs_sz +
                                                                   2;  // delimiters
BOOST_MYSQL_STATIC_IF_COMPILED constexpr std::size_t time_max_sz = time_min_sz + max_decimals +
                                                                   3;  // sign, period, hour extra character
BOOST_MYSQL_STATIC_IF_COMPILED constexpr std::size_t datetime_min_sz = date_sz + time_min_sz +
                                                                       1;  // delimiter
BOOST_MYSQL_STATIC_IF_COMPILED constexpr std::size_t datetime_max_sz = datetime_min_sz + max_decimals +
                                                                       1;  // period

BOOST_MYSQL_STATIC_IF_COMPILED constexpr unsigned time_max_hour = 838;
}  // namespace textc

// Integers
template <class T>
BOOST_MYSQL_STATIC_OR_INLINE deserialize_errc
deserialize_text_value_int_impl(string_view from, field_view& to) noexcept
{
    T v;
    bool ok = boost::conversion::try_lexical_convert(from.data(), from.size(), v);
    if (!ok)
        return deserialize_errc::protocol_value_error;
    to = field_view(v);
    return deserialize_errc::ok;
}

BOOST_MYSQL_STATIC_OR_INLINE deserialize_errc
deserialize_text_value_int(string_view from, field_view& to, const metadata& meta) noexcept
{
    return meta.is_unsigned() ? deserialize_text_value_int_impl<std::uint64_t>(from, to)
                              : deserialize_text_value_int_impl<std::int64_t>(from, to);
}

// Floating points
template <class T>
BOOST_MYSQL_STATIC_OR_INLINE deserialize_errc
deserialize_text_value_float(string_view from, field_view& to) noexcept
{
    T val;
    bool ok = boost::conversion::try_lexical_convert(from.data(), from.size(), val);
    if (!ok || std::isnan(val) || std::isinf(val))  // SQL std forbids these values
        return deserialize_errc::protocol_value_error;
    to = field_view(val);
    return deserialize_errc::ok;
}

// Strings
BOOST_MYSQL_STATIC_OR_INLINE deserialize_errc
deserialize_text_value_string(string_view from, field_view& to) noexcept
{
    to = field_view(from);
    return deserialize_errc::ok;
}

BOOST_MYSQL_STATIC_OR_INLINE deserialize_errc
deserialize_text_value_blob(string_view from, field_view& to) noexcept
{
    to = field_view(to_span(from));
    return deserialize_errc::ok;
}

// Date/time types
BOOST_MYSQL_STATIC_OR_INLINE unsigned sanitize_decimals(unsigned decimals) noexcept
{
    return (std::min)(decimals, max_decimals);
}

// Computes the meaning of the parsed microsecond number, taking into
// account decimals (85 with 2 decimals means 850000us)
BOOST_MYSQL_STATIC_OR_INLINE unsigned compute_micros(unsigned parsed_micros, unsigned decimals) noexcept
{
    return parsed_micros * static_cast<unsigned>(std::pow(10, max_decimals - decimals));
}

BOOST_MYSQL_STATIC_OR_INLINE deserialize_errc deserialize_text_ymd(string_view from, date& to)
{
    using namespace textc;

    // Size check
    if (from.size() != date_sz)
        return deserialize_errc::protocol_value_error;

    // Copy to a NULL-terminated buffer
    char buffer[date_sz + 1]{};
    std::memcpy(buffer, from.data(), from.size());

    // Parse individual components
    unsigned year, month, day;
    char extra_char;
    int parsed = sscanf(buffer, "%4u-%2u-%2u%c", &year, &month, &day, &extra_char);
    if (parsed != 3)
        return deserialize_errc::protocol_value_error;

    // Range check for individual components. MySQL doesn't allow invidiual components
    // to be out of range, although they may be zero or representing an invalid date
    if (year > max_year || month > max_month || day > max_day)
        return deserialize_errc::protocol_value_error;

    to = date(
        static_cast<std::uint16_t>(year),
        static_cast<std::uint8_t>(month),
        static_cast<std::uint8_t>(day)
    );
    return deserialize_errc::ok;
}

BOOST_MYSQL_STATIC_OR_INLINE deserialize_errc
deserialize_text_value_date(string_view from, field_view& to) noexcept
{
    date d;
    auto err = deserialize_text_ymd(from, d);
    if (err != deserialize_errc::ok)
        return err;
    to = field_view(d);
    return deserialize_errc::ok;
}

BOOST_MYSQL_STATIC_OR_INLINE deserialize_errc
deserialize_text_value_datetime(string_view from, field_view& to, const metadata& meta) noexcept
{
    using namespace textc;

    // Sanitize decimals
    unsigned decimals = sanitize_decimals(meta.decimals());

    // Length check
    std::size_t expected_size = datetime_min_sz + (decimals ? decimals + 1 : 0);
    if (from.size() != expected_size)
        return deserialize_errc::protocol_value_error;

    // Deserialize date part
    date d;
    auto err = deserialize_text_ymd(from.substr(0, date_sz), d);
    if (err != deserialize_errc::ok)
        return err;

    // Copy to NULL-terminated buffer
    constexpr std::size_t datetime_time_first = date_sz + 1;  // date + space
    char buffer[datetime_max_sz - datetime_time_first + 1]{};
    std::memcpy(buffer, from.data() + datetime_time_first, from.size() - datetime_time_first);

    // Parse
    unsigned hours, minutes, seconds;
    unsigned micros = 0;
    char extra_char;
    if (decimals)
    {
        int parsed = sscanf(buffer, "%2u:%2u:%2u.%6u%c", &hours, &minutes, &seconds, &micros, &extra_char);
        if (parsed != 4)
            return deserialize_errc::protocol_value_error;
        micros = compute_micros(micros, decimals);
    }
    else
    {
        int parsed = sscanf(buffer, "%2u:%2u:%2u%c", &hours, &minutes, &seconds, &extra_char);
        if (parsed != 3)
            return deserialize_errc::protocol_value_error;
    }

    // Validity check. Although MySQL allows invalid and zero datetimes, it doesn't allow
    // individual components to be out of range.
    if (hours > max_hour || minutes > max_min || seconds > max_sec || micros > max_micro)
    {
        return deserialize_errc::protocol_value_error;
    }

    datetime dt(
        d.year(),
        d.month(),
        d.day(),
        static_cast<std::uint8_t>(hours),
        static_cast<std::uint8_t>(minutes),
        static_cast<std::uint8_t>(seconds),
        static_cast<std::uint32_t>(micros)
    );
    to = field_view(dt);
    return deserialize_errc::ok;
}

BOOST_MYSQL_STATIC_OR_INLINE deserialize_errc
deserialize_text_value_time(string_view from, field_view& to, const metadata& meta) noexcept
{
    using namespace textc;

    // Sanitize decimals
    unsigned decimals = sanitize_decimals(meta.decimals());

    // size check
    std::size_t actual_min_size = time_min_sz + (decimals ? decimals + 1 : 0);
    std::size_t actual_max_size = actual_min_size + 1 + 1;  // hour extra character and sign
    BOOST_ASSERT(actual_max_size <= time_max_sz);
    if (from.size() < actual_min_size || from.size() > actual_max_size)
        return deserialize_errc::protocol_value_error;

    // Copy to NULL-terminated buffer
    char buffer[time_max_sz + 1]{};
    memcpy(buffer, from.data(), from.size());

    // Sign
    bool is_negative = from[0] == '-';
    const char* first = is_negative ? buffer + 1 : buffer;

    // Parse it
    unsigned hours, minutes, seconds;
    unsigned micros = 0;
    char extra_char;
    if (decimals)
    {
        int parsed = sscanf(first, "%3u:%2u:%2u.%6u%c", &hours, &minutes, &seconds, &micros, &extra_char);
        if (parsed != 4)
            return deserialize_errc::protocol_value_error;
        micros = compute_micros(micros, decimals);
    }
    else
    {
        int parsed = sscanf(first, "%3u:%2u:%2u%c", &hours, &minutes, &seconds, &extra_char);
        if (parsed != 3)
            return deserialize_errc::protocol_value_error;
    }

    // Range check
    if (hours > time_max_hour || minutes > max_min || seconds > max_sec || micros > max_micro)
    {
        return deserialize_errc::protocol_value_error;
    }

    // Sum it
    auto res = std::chrono::hours(hours) + std::chrono::minutes(minutes) + std::chrono::seconds(seconds) +
               std::chrono::microseconds(micros);
    if (is_negative)
    {
        res = -res;
    }

    // Done
    to = field_view(res);
    return deserialize_errc::ok;
}

}  // namespace detail
}  // namespace mysql
}  // namespace boost

boost::mysql::detail::deserialize_errc boost::mysql::detail::deserialize_text_field(
    string_view from,
    const metadata& meta,
    field_view& output
)
{
    switch (meta.type())
    {
    case column_type::tinyint:
    case column_type::smallint:
    case column_type::mediumint:
    case column_type::int_:
    case column_type::bigint:
    case column_type::year: return deserialize_text_value_int(from, output, meta);
    case column_type::bit: return deserialize_bit(from, output);
    case column_type::float_: return deserialize_text_value_float<float>(from, output);
    case column_type::double_: return deserialize_text_value_float<double>(from, output);
    case column_type::timestamp:
    case column_type::datetime: return deserialize_text_value_datetime(from, output, meta);
    case column_type::date: return deserialize_text_value_date(from, output);
    case column_type::time: return deserialize_text_value_time(from, output, meta);
    // True string types
    case column_type::char_:
    case column_type::varchar:
    case column_type::text:
    case column_type::enum_:
    case column_type::set:
    case column_type::decimal:
    case column_type::json: return deserialize_text_value_string(from, output);
    // Blobs and anything else
    case column_type::binary:
    case column_type::varbinary:
    case column_type::blob:
    case column_type::geometry:
    default: return deserialize_text_value_blob(from, output);
    }
}

#endif
