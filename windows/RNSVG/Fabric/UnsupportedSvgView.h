#pragma once

#include "RenderableView.h"

namespace winrt::RNSVG::implementation {

void RegisterUnsupportedSvgComponent(const winrt::hstring& name, const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;

} // namespace winrt::RNSVG::implementation
