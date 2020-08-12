#pragma once

#include "stomptalk/hook_base.hpp"

namespace stomptalk {

class parser;
class parser_hook
{
public:
    struct error
    {
        enum type
            : std::size_t
        {
            none = 0,
            too_big,
            inval_reqline,
            inval_method,
            inval_frame,
            next_frame,
            generic
        };
    };

protected:
    hook_base& hook_;

    error::type error_{error::none};
    std::uint64_t content_len_{};

public:
    parser_hook(hook_base& hook)
        : hook_(hook)
    {   }

    void reset() noexcept;

    bool ok() const noexcept
    {
        return error() == error::none;
    }

    error::type error() const noexcept
    {
        return error_;
    }

    void set(error::type error) noexcept
    {
        error_ = error;
    }

    void set(std::uint64_t content_length) noexcept
    {
        content_len_ = content_length;
    }

    std::uint64_t content_length() const noexcept
    {
        return content_len_;
    }

    void on_frame() noexcept;

    void on_method(std::string_view text) noexcept;

    void on_hdr_key(std::string_view text) noexcept;

    void on_hdr_val(std::string_view text) noexcept;

    void on_body(const void* ptr, std::size_t size) noexcept;

    void on_frame_end() noexcept;

    void next_frame() noexcept;
};

} // stomptalk
