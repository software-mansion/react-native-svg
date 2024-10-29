#include "pch.h"
#include "SymbolView.h"
#if __has_include("SymbolView.g.cpp")
#include "SymbolView.g.cpp"
#endif

#include "Utils.h"

using namespace winrt;

namespace winrt::RNSVG::implementation {

#ifdef USE_FABRIC
SymbolProps::SymbolProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void SymbolProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

void SymbolView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<winrt::RNSVG::implementation::SymbolProps, SymbolView>(L"RNSVGSymbol", builder);
}

void SymbolView::UpdateProperties(
    const winrt::Microsoft::ReactNative::IComponentProps &props,
    const winrt::Microsoft::ReactNative::IComponentProps &oldProps,
    bool forceUpdate,
    bool invalidate) noexcept {
  auto symbolProps = props.try_as<SymbolProps>();
  if (symbolProps) {
    m_minX = symbolProps->minX;
    m_minY = symbolProps->minY;
    m_vbWidth = symbolProps->vbWidth;
    m_vbHeight = symbolProps->vbHeight;
    m_align = symbolProps->align;
    m_meetOrSlice = symbolProps->meetOrSlice;
  }

  base_type::UpdateProperties(props, oldProps, forceUpdate, invalidate);
}
#else
void SymbolView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    if (propertyName == "vbWidth") {
      m_vbWidth = Utils::JSValueAsFloat(propertyValue);
    } else if (propertyName == "vbHeight") {
      m_vbHeight = Utils::JSValueAsFloat(propertyValue);
    } else if (propertyName == "minX") {
      m_minX = Utils::JSValueAsFloat(propertyValue);
    } else if (propertyName == "minY") {
      m_minY = Utils::JSValueAsFloat(propertyValue);
    } else if (propertyName == "align") {
      m_align = Utils::JSValueAsString(propertyValue);
    } else if (propertyName == "meetOrSlice") {
      m_meetOrSlice = Utils::GetMeetOrSlice(propertyValue);
    }
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);
}
#endif
} // namespace winrt::RNSVG::implementation
