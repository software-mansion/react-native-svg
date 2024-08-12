//
// Copyright (c) 2022 Alan de Freitas (alandefreitas@gmail.com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//
// Official repository: https://github.com/boostorg/url
//

#ifndef BOOST_URL_DETAIL_PATTERN_HPP
#define BOOST_URL_DETAIL_PATTERN_HPP

#include <boost/url/error_types.hpp>
#include <boost/url/url_base.hpp>
#include <boost/core/detail/string_view.hpp>

// This file includes functions and classes
// to parse uri templates or format strings

namespace boost {
namespace urls {
namespace detail {

class format_args;

struct pattern
{
    core::string_view scheme;
    core::string_view user;
    core::string_view pass;
    core::string_view host;
    core::string_view port;
    core::string_view path;
    core::string_view query;
    core::string_view frag;

    bool has_authority = false;
    bool has_user = false;
    bool has_pass = false;
    bool has_port = false;
    bool has_query = false;
    bool has_frag = false;

    BOOST_URL_DECL
    void
    apply(
        url_base& u,
        format_args const& args) const;
};

BOOST_URL_DECL
system::result<pattern>
parse_pattern(
    core::string_view s);

} // detail
} // url
} // boost

#endif
