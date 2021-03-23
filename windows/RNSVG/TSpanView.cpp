#include "pch.h"
#include "TSpanView.h"
#include "TSpanView.g.cpp"

#include "Utils.h"
#include <winrt/Microsoft.Graphics.Canvas.Text.h>

using namespace winrt;
using namespace Microsoft::Graphics::Canvas;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
void TSpanView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap = JSValue::ReadObjectFrom(reader);

  for (auto const &pair : propertyMap) {
    auto const &propertyName = pair.first;
    auto const &propertyValue = pair.second;

    if (propertyName == "content") {
      m_content = propertyValue.AsString();
    }
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);
}

void TSpanView::CreateGeometry(ICanvasResourceCreator const &resourceCreator) {

  Microsoft::Graphics::Canvas::Text::CanvasTextFormat const& textFormat{};
  textFormat.FontSize(FontSize());
  textFormat.FontFamily(FontFamily());
  textFormat.FontWeight(Utils::FontWeightFrom(FontWeight(), SvgParent()));

  Geometry(Geometry::CanvasGeometry::CreateText({resourceCreator, to_hstring(m_content), textFormat, 200, 200}));
}
} // namespace winrt::RNSVG::implementation
