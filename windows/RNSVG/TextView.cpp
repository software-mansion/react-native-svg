#include "pch.h"
#include "TextView.h"
#include "TextView.g.cpp"

using namespace winrt;
using namespace Microsoft::Graphics::Canvas;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
void TextView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    if (propertyName == "x") {
      m_x.Clear();
      for (auto const &item : propertyValue.AsArray()) {
        m_x.Append(SVGLength::From(item));
      }
    } else if (propertyName == "y") {
      m_y.Clear();
      for (auto const &item : propertyValue.AsArray()) {
        m_y.Append(SVGLength::From(item));
      }
    } else if (propertyName == "dx") {
      m_dx.Clear();
      for (auto const &item : propertyValue.AsArray()) {
        m_dx.Append(SVGLength::From(item));
      }
    } else if (propertyName == "dy") {
      m_dy.Clear();
      for (auto const &item : propertyValue.AsArray()) {
        m_dy.Append(SVGLength::From(item));
      }
    } else if (propertyName == "rotate") {
      m_rotate.Clear();
      for (auto const &item : propertyValue.AsArray()) {
        m_rotate.Append(SVGLength::From(item));
      }
    }
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);
}

void TextView::RenderGroup(UI::Xaml::CanvasControl const &canvas, CanvasDrawingSession const &session) {
  auto const &transform{session.Transform()};
  bool translateXY{X().Size() > 0 || Y().Size() > 0};
  if (translateXY) {
    float x{X().Size() > 0 ? X().GetAt(0).Value() : 0};
    float y{Y().Size() > 0 ? Y().GetAt(0).Value() : 0};
    session.Transform(transform * Numerics::make_float3x2_translation(x, y));
  }
  __super::RenderGroup(canvas, session);
  if (translateXY) {
    session.Transform(transform);
  }
}
} // namespace winrt::RNSVG::implementation
