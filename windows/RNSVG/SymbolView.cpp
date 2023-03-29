#include "pch.h"
#include "SymbolView.h"
#include "SymbolView.g.cpp"

#include "Utils.h"

namespace winrt::RNSVG::implementation {
void SymbolView::UpdateProperties(winrt::Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const winrt::Microsoft::ReactNative::JSValueObject &propertyMap{
      winrt::Microsoft::ReactNative::JSValue::ReadObjectFrom(reader)};

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

} // namespace winrt::RNSVG::implementation
