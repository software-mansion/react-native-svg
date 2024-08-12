//
// Copyright (c) 2019-2023 Ruben Perez Hidalgo (rubenperez038 at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_MYSQL_DETAIL_CHANNEL_PTR_HPP
#define BOOST_MYSQL_DETAIL_CHANNEL_PTR_HPP

#include <boost/mysql/diagnostics.hpp>
#include <boost/mysql/field_view.hpp>
#include <boost/mysql/metadata_mode.hpp>

#include <boost/mysql/detail/any_stream.hpp>
#include <boost/mysql/detail/config.hpp>

#include <boost/assert.hpp>

#include <memory>

namespace boost {
namespace mysql {
namespace detail {

class channel;

class channel_ptr
{
    std::unique_ptr<channel> chan_;

    BOOST_MYSQL_DECL any_stream& get_stream() const;

public:
    BOOST_MYSQL_DECL channel_ptr(std::size_t read_buff_size, std::unique_ptr<any_stream>);
    channel_ptr(const channel_ptr&) = delete;
    BOOST_MYSQL_DECL channel_ptr(channel_ptr&&) noexcept;
    channel_ptr& operator=(const channel_ptr&) = delete;
    BOOST_MYSQL_DECL channel_ptr& operator=(channel_ptr&&) noexcept;
    BOOST_MYSQL_DECL ~channel_ptr();

    any_stream& stream() noexcept { return get_stream(); }
    const any_stream& stream() const noexcept { return get_stream(); }

    channel& get() noexcept
    {
        BOOST_ASSERT(chan_);
        return *chan_;
    }
    const channel& get() const noexcept
    {
        BOOST_ASSERT(chan_);
        return *chan_;
    }

    BOOST_MYSQL_DECL metadata_mode meta_mode() const noexcept;
    BOOST_MYSQL_DECL void set_meta_mode(metadata_mode v) noexcept;
    BOOST_MYSQL_DECL diagnostics& shared_diag() noexcept;
};

BOOST_MYSQL_DECL std::vector<field_view>& get_shared_fields(channel&) noexcept;

}  // namespace detail
}  // namespace mysql
}  // namespace boost

#ifdef BOOST_MYSQL_HEADER_ONLY
#include <boost/mysql/impl/channel_ptr.ipp>
#endif

#endif
