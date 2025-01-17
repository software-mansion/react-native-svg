#include "pch.h"
#include "DefsView.h"
#if __has_include("DefsView.g.cpp")
#include "DefsView.g.cpp"
#endif

using namespace winrt;

namespace winrt::RNSVG::implementation {

void DefsView::Draw(RNSVG::D2DDeviceContext const& /*deviceContext*/, Size const & /*size*/) {}
} // namespace winrt::RNSVG::implementation
