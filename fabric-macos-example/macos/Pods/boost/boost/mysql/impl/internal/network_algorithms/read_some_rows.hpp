//
// Copyright (c) 2019-2023 Ruben Perez Hidalgo (rubenperez038 at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_MYSQL_IMPL_INTERNAL_NETWORK_ALGORITHMS_READ_SOME_ROWS_HPP
#define BOOST_MYSQL_IMPL_INTERNAL_NETWORK_ALGORITHMS_READ_SOME_ROWS_HPP

#include <boost/mysql/diagnostics.hpp>
#include <boost/mysql/error_code.hpp>

#include <boost/mysql/detail/config.hpp>
#include <boost/mysql/detail/execution_processor/execution_processor.hpp>

#include <boost/mysql/impl/internal/channel/channel.hpp>

#include <boost/asio/async_result.hpp>
#include <boost/asio/coroutine.hpp>
#include <boost/asio/post.hpp>

#include <cstddef>

namespace boost {
namespace mysql {
namespace detail {

BOOST_ATTRIBUTE_NODISCARD inline error_code process_some_rows(
    channel& chan,
    execution_processor& proc,
    output_ref output,
    std::size_t& read_rows,
    diagnostics& diag
)
{
    // Process all read messages until they run out, an error happens
    // or an EOF is received
    read_rows = 0;
    error_code err;
    proc.on_row_batch_start();
    while (chan.has_read_messages() && proc.is_reading_rows() && read_rows < output.max_size())
    {
        // Get the row message
        auto buff = chan.next_read_message(proc.sequence_number(), err);
        if (err)
            return err;

        // Deserialize it
        auto res = deserialize_row_message(buff, chan.flavor(), diag);
        if (res.type == row_message::type_t::error)
        {
            err = res.data.err;
        }
        else if (res.type == row_message::type_t::row)
        {
            output.set_offset(read_rows);
            err = proc.on_row(res.data.row, output, chan.shared_fields());
            if (!err)
                ++read_rows;
        }
        else
        {
            err = proc.on_row_ok_packet(res.data.ok_pack);
        }

        if (err)
            return err;
    }
    proc.on_row_batch_finish();
    return error_code();
}

struct read_some_rows_impl_op : boost::asio::coroutine
{
    channel& chan_;
    diagnostics& diag_;
    execution_processor& proc_;
    output_ref output_;

    read_some_rows_impl_op(
        channel& chan,
        diagnostics& diag,
        execution_processor& proc,
        output_ref output
    ) noexcept
        : chan_(chan), diag_(diag), proc_(proc), output_(output)
    {
    }

    template <class Self>
    void operator()(Self& self, error_code err = {})
    {
        // Error checking
        if (err)
        {
            self.complete(err, 0);
            return;
        }

        // Normal path
        std::size_t read_rows = 0;
        BOOST_ASIO_CORO_REENTER(*this)
        {
            diag_.clear();

            // If we are not reading rows, return
            if (!proc_.is_reading_rows())
            {
                BOOST_ASIO_CORO_YIELD boost::asio::post(chan_.get_executor(), std::move(self));
                self.complete(error_code(), 0);
                BOOST_ASIO_CORO_YIELD break;
            }

            // Read at least one message
            BOOST_ASIO_CORO_YIELD chan_.async_read_some(std::move(self));

            // Process messages
            err = process_some_rows(chan_, proc_, output_, read_rows, diag_);
            if (err)
            {
                self.complete(err, 0);
                BOOST_ASIO_CORO_YIELD break;
            }

            self.complete(error_code(), read_rows);
        }
    }
};

// External interface
inline std::size_t read_some_rows_impl(
    channel& chan,
    execution_processor& proc,
    const output_ref& output,
    error_code& err,
    diagnostics& diag
)
{
    err.clear();
    diag.clear();

    // If we are not reading rows, just return
    if (!proc.is_reading_rows())
    {
        return 0;
    }

    // Read from the stream until there is at least one message
    chan.read_some(err);
    if (err)
        return 0;

    // Process read messages
    std::size_t read_rows = 0;
    err = process_some_rows(chan, proc, output, read_rows, diag);
    if (err)
        return 0;

    return read_rows;
}

template <class CompletionToken>
BOOST_ASIO_INITFN_AUTO_RESULT_TYPE(CompletionToken, void(error_code, std::size_t))
async_read_some_rows_impl(
    channel& chan,
    execution_processor& proc,
    const output_ref& output,
    diagnostics& diag,
    CompletionToken&& token
)
{
    return asio::async_compose<CompletionToken, void(error_code, std::size_t)>(
        read_some_rows_impl_op(chan, diag, proc, output),
        token,
        chan
    );
}

}  // namespace detail
}  // namespace mysql
}  // namespace boost

#endif
