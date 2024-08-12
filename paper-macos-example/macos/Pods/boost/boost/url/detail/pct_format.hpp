//
// Copyright (c) 2022 Alan de Freitas (alandefreitas@gmail.com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//
// Official repository: https://github.com/boostorg/url
//

#ifndef BOOST_URL_DETAIL_PCT_FORMAT_HPP
#define BOOST_URL_DETAIL_PCT_FORMAT_HPP

#include <boost/core/detail/string_view.hpp>
#include <boost/url/url.hpp>
#include <boost/url/grammar/lut_chars.hpp>
#include <boost/url/detail/format_args.hpp>

namespace boost {
namespace urls {
namespace detail {

// measure a single string
BOOST_URL_DECL
std::size_t
pct_vmeasure(
    grammar::lut_chars const& cs,
    format_parse_context& pctx,
    measure_context& mctx);

// format a single string
BOOST_URL_DECL
char*
pct_vformat(
    grammar::lut_chars const& cs,
    format_parse_context& pctx,
    format_context& fctx);

} // detail
} // url
} // boost

#endif
