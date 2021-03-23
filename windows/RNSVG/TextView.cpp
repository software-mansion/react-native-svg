#include "pch.h"
#include "TextView.h"
#include "TextView.g.cpp"

using namespace winrt;
using namespace Microsoft::Graphics::Canvas;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
void TextView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap = JSValue::ReadObjectFrom(reader);

  for (auto const &pair : propertyMap) {
    auto const &propertyName = pair.first;
    auto const &propertyValue = pair.second;

    if (propertyName == "x") {
      for (auto &item : propertyValue.AsArray()) {
        m_x.Append(SVGLength::From(item));
      }
    } else if (propertyName == "y") {
      for (auto &item : propertyValue.AsArray()) {
        m_y.Append(SVGLength::From(item));
      }
    } else if (propertyName == "dx") {
      for (auto &item : propertyValue.AsArray()) {
        m_dx.Append(SVGLength::From(item));
      }
    } else if (propertyName == "dy") {
      for (auto &item : propertyValue.AsArray()) {
        m_dy.Append(SVGLength::From(item));
      }
    } else if (propertyName == "rotate") {
      auto &asArray = propertyValue.AsArray();
      auto type = propertyValue.Type();
    }
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);
}
void TextView::CreateGeometry(Microsoft::Graphics::Canvas::ICanvasResourceCreator const &resourceCreator) {
  __super::CreateGeometry(resourceCreator);
}
} // namespace winrt::RNSVG::implementation
