#include "pch.h"
#include "SymbolView.h"
#include "SymbolView.g.cpp"

#include "Utils.h"

using namespace winrt;
using namespace Microsoft::Graphics::Canvas;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
void SymbolView::SaveDefinition() {
  if (auto root{SvgRoot()}) {
    root.Templates().Insert(Id(), *this);
  }
}

void SymbolView::RemoveDefinition() {
  const auto &root{SvgRoot()};
  if (root && root.Templates().HasKey(Id())) {
    root.Templates().Remove(Id());
  }
}

void SymbolView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    if (propertyName == "name") {
      RemoveDefinition();
    } else if (propertyName == "vbWidth") {
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

  if (propertyMap.find("name") != propertyMap.end()) {
    SaveDefinition();
  }
}

void SymbolView::Render(UI::Xaml::CanvasControl const &/*canvas*/, CanvasDrawingSession const &/*session*/) {
  SaveDefinition();
}

} // namespace winrt::RNSVG::implementation
