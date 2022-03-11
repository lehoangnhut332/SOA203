// Copyright © 2020 igor . ikonopistsev at gmail
// This work is free. You can redistribute it and/or modify it under the
// terms of the Do What The Fuck You Want To Public License, Version 2,
// as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.

#pragma once

#include <cstddef>
#include <cstdint>

namespace stomptalk {

// x86_64
struct fnv1a
{
    using type = std::uint64_t;
    constexpr static auto salt = type{ 0xcbf29ce484222325ull };

    constexpr static auto calc(char ch, type hval = salt) noexcept
    {
        hval ^= static_cast<type>(ch);
        hval += (hval << 1) + (hval << 4) + (hval << 5) +
            (hval << 7) + (hval << 8) + (hval << 40);
        return hval;
    }

    constexpr auto operator()(const char *ptr) const noexcept
    {
        auto hval = salt;
        while (*ptr != '\0')
        {            
            hval ^= static_cast<std::size_t>(*ptr++);
            hval += (hval << 1) + (hval << 4) + (hval << 5) +
                (hval << 7) + (hval << 8) + (hval << 40);
        }
        return hval;
    }

    auto operator()(std::size_t& len, const char *ptr) const noexcept
    {
        auto hval = salt;
        const char *p = ptr;
        while (*p != '\0')
        {
            hval ^= static_cast<type>(*p++);
            hval += (hval << 1) + (hval << 4) + (hval << 5) +
                (hval << 7) + (hval << 8) + (hval << 40);
        }
        len = static_cast<std::size_t>(p - ptr);
        return hval;
    }

    constexpr auto operator()(const char *p, const char *e) const noexcept
    {
        auto hval = salt;
        while (p < e)
        {
            hval ^= static_cast<type>(*p++);
            hval += (hval << 1) + (hval << 4) + (hval << 5) +
                (hval << 7) + (hval << 8) + (hval << 40);
        }
        return hval;
    }

    constexpr auto operator()(const char *ptr, std::size_t len) const noexcept
    {
        auto p = static_cast<const char*>(ptr);
        return this->operator()(p, p + len);
    }

    template<class T>
    constexpr static auto calc_hash(typename T::const_iterator p,
        typename T::const_iterator e) noexcept
    {
        auto hval = salt;
        while (p < e)
        {
            hval ^= static_cast<type>(*p++);
            hval += (hval << 1) + (hval << 4) + (hval << 5) +
                (hval << 7) + (hval << 8) + (hval << 40);
        }
        return hval;
    }
};

} // namespace stomptalk
