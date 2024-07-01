#pragma once

#include <winrt/RNSVG.h>

#ifndef USE_FABRIC
#include "JSValueXaml.h"
#endif

namespace winrt::Microsoft::ReactNative {
void WriteValue(IJSValueWriter const &writer, const winrt::RNSVG::SVGLength &value) noexcept;
void ReadValue(IJSValueReader const &reader, /*out*/ winrt::RNSVG::SVGLength &value) noexcept;
} // namespace winrt::Microsoft::ReactNative