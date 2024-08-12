//
// Copyright (c) 2016-2019 Vinnie Falco (vinnie dot falco at gmail dot com)
// Copyright (c) 2022 Alan de Freitas (alandefreitas@gmail.com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//
// Official repository: https://github.com/boostorg/url
//

#ifndef BOOST_URL_DETAIL_NORMALIZED_HPP
#define BOOST_URL_DETAIL_NORMALIZED_HPP

#include <boost/core/detail/string_view.hpp>
#include <boost/url/segments_encoded_view.hpp>
#include <boost/url/detail/normalize.hpp>

namespace boost {
namespace urls {
namespace detail {

class fnv_1a
{
public:
    using digest_type = std::size_t;

#if BOOST_URL_ARCH == 64
    static constexpr std::size_t const prime =
        static_cast<std::size_t>(0x100000001B3ULL);
    static constexpr std::size_t init_hash  =
        static_cast<std::size_t>(0xcbf29ce484222325ULL);
#else
    static constexpr std::size_t const prime =
        static_cast<std::size_t>(0x01000193UL);
    static constexpr std::size_t init_hash  =
        static_cast<std::size_t>(0x811C9DC5UL);
#endif

    explicit
    fnv_1a(std::size_t salt) noexcept
    : h_(init_hash + salt)
    {
    }

    void
    put(char c) noexcept
    {
        h_ ^= c;
        h_ *= prime;
    }

    void
    put(core::string_view s) noexcept
    {
        for (char c: s)
        {
            put(c);
        }
    }

    digest_type
    digest() const noexcept
    {
        return h_;
    }

private:
    std::size_t h_;
};

void
pop_encoded_front(
    core::string_view& s,
    char& c,
    std::size_t& n) noexcept;

// compare two core::string_views as if they are both
// percent-decoded
int
compare_encoded(
    core::string_view lhs,
    core::string_view rhs) noexcept;

// digest a core::string_view as if it were
// percent-decoded
void
digest_encoded(
    core::string_view s,
    fnv_1a& hasher) noexcept;

void
digest(
    core::string_view s,
    fnv_1a& hasher) noexcept;

// check if core::string_view lhs starts with core::string_view
// rhs as if they are both percent-decoded. If
// lhs starts with rhs, return number of chars
// matched in the encoded core::string_view
std::size_t
path_starts_with(
    core::string_view lhs,
    core::string_view rhs) noexcept;

// check if core::string_view lhs ends with core::string_view
// rhs as if they are both percent-decoded. If
// lhs ends with rhs, return number of chars
// matched in the encoded core::string_view
std::size_t
path_ends_with(
    core::string_view lhs,
    core::string_view rhs) noexcept;

// compare two core::string_views as if they are both
// percent-decoded and lowercase
int
ci_compare_encoded(
    core::string_view lhs,
    core::string_view rhs) noexcept;

// digest a core::string_view as if it were decoded
// and lowercase
void
ci_digest_encoded(
    core::string_view s,
    fnv_1a& hasher) noexcept;

// compare two ascii core::string_views
int
compare(
    core::string_view lhs,
    core::string_view rhs) noexcept;

// compare two core::string_views as if they are both
// lowercase
int
ci_compare(
    core::string_view lhs,
    core::string_view rhs) noexcept;

// digest a core::string_view as if it were lowercase
void
ci_digest(
    core::string_view s,
    fnv_1a& hasher) noexcept;

BOOST_URL_DECL
std::size_t
remove_dot_segments(
    char* dest,
    char const* end,
    core::string_view s) noexcept;

void
pop_last_segment(
    core::string_view& s,
    core::string_view& c,
    std::size_t& level,
    bool r) noexcept;

char
path_pop_back( core::string_view& s );

void
normalized_path_digest(
    core::string_view s,
    bool remove_unmatched,
    fnv_1a& hasher) noexcept;

int
segments_compare(
    segments_encoded_view seg0,
    segments_encoded_view seg1) noexcept;

} // detail
} // urls
} // boost

#endif
