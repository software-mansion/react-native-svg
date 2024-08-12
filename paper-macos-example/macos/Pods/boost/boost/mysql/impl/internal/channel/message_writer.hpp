//
// Copyright (c) 2019-2023 Ruben Perez Hidalgo (rubenperez038 at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//

#ifndef BOOST_MYSQL_IMPL_INTERNAL_CHANNEL_MESSAGE_WRITER_HPP
#define BOOST_MYSQL_IMPL_INTERNAL_CHANNEL_MESSAGE_WRITER_HPP

#include <boost/mysql/impl/internal/protocol/constants.hpp>
#include <boost/mysql/impl/internal/protocol/protocol.hpp>

#include <array>
#include <cstddef>
#include <cstdint>

namespace boost {
namespace mysql {
namespace detail {

class chunk_processor
{
    std::size_t first_{};
    std::size_t last_{};

    std::size_t remaining() const noexcept { return last_ - first_; }

public:
    chunk_processor() = default;
    void reset() noexcept { reset(0, 0); }
    void reset(std::size_t first, std::size_t last) noexcept
    {
        BOOST_ASSERT(last >= first);
        first_ = first;
        last_ = last;
    }
    void on_bytes_written(std::size_t n) noexcept
    {
        BOOST_ASSERT(remaining() >= n);
        first_ += n;
    }
    bool done() const noexcept { return first_ == last_; }
    span<const std::uint8_t> get_chunk(const std::vector<std::uint8_t>& buff) const noexcept
    {
        BOOST_ASSERT(buff.size() >= last_);
        return {buff.data() + first_, remaining()};
    }
};

class message_writer
{
    std::vector<std::uint8_t> buffer_;
    std::size_t max_frame_size_;
    std::uint8_t* seqnum_{nullptr};

    chunk_processor chunk_;
    std::size_t total_bytes_{};
    std::size_t total_bytes_written_{};
    bool should_send_empty_frame_{};

    void process_header_write(std::uint32_t size_to_write, std::uint8_t seqnum, std::size_t buff_offset)
    {
        serialize_frame_header(
            frame_header{size_to_write, seqnum},
            span<std::uint8_t, frame_header_size>(buffer_.data() + buff_offset, frame_header_size)
        );
    }

    std::uint8_t next_seqnum() noexcept { return (*seqnum_)++; }

    void prepare_next_chunk()
    {
        if (should_send_empty_frame_)
        {
            process_header_write(0, next_seqnum(), 0);
            chunk_.reset(0, HEADER_SIZE);
            should_send_empty_frame_ = false;
        }
        else if (total_bytes_written_ < total_bytes_)
        {
            std::size_t offset = total_bytes_written_;
            std::size_t remaining = total_bytes_ - total_bytes_written_;
            std::size_t size = (std::min)(max_frame_size_, remaining);
            process_header_write(static_cast<std::uint32_t>(size), next_seqnum(), offset);
            chunk_.reset(offset, offset + size + HEADER_SIZE);
            if (remaining == max_frame_size_)
            {
                should_send_empty_frame_ = true;
            }
            total_bytes_written_ += size;
        }
        else
        {
            // We're done
            chunk_.reset();
        }
    }

public:
    message_writer(std::size_t max_frame_size = MAX_PACKET_SIZE) noexcept : max_frame_size_(max_frame_size) {}

    span<std::uint8_t> prepare_buffer(std::size_t msg_size, std::uint8_t& seqnum)
    {
        buffer_.resize(msg_size + HEADER_SIZE);
        total_bytes_ = msg_size;
        total_bytes_written_ = 0;
        should_send_empty_frame_ = msg_size == 0;
        seqnum_ = &seqnum;
        prepare_next_chunk();
        return {buffer_.data() + HEADER_SIZE, msg_size};
    }

    bool done() const noexcept { return chunk_.done(); }

    // This function returns an empty buffer to signal that we're done
    span<const std::uint8_t> next_chunk() const
    {
        BOOST_ASSERT(!done());
        return chunk_.get_chunk(buffer_);
    }

    void on_bytes_written(std::size_t n)
    {
        BOOST_ASSERT(!done());

        // Acknowledge the written bytes
        chunk_.on_bytes_written(n);

        // Prepare the next chunk, if required
        if (chunk_.done())
        {
            prepare_next_chunk();
        }
    }
};

}  // namespace detail
}  // namespace mysql
}  // namespace boost

#endif
