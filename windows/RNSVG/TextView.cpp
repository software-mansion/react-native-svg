#include "pch.h"
#include "TextView.h"
#if __has_include("TextView.g.cpp")
#include "TextView.g.cpp"
#endif

#include "D2DHelpers.h"

using namespace winrt;
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
        m_x.Append(item.To<RNSVG::SVGLength>());
      }
    } else if (propertyName == "y") {
      m_y.Clear();
      for (auto const &item : propertyValue.AsArray()) {
        m_y.Append(item.To<RNSVG::SVGLength>());
      }
    } else if (propertyName == "dx") {
      m_dx.Clear();
      for (auto const &item : propertyValue.AsArray()) {
        m_dx.Append(item.To<RNSVG::SVGLength>());
      }
    } else if (propertyName == "dy") {
      m_dy.Clear();
      for (auto const &item : propertyValue.AsArray()) {
        m_dy.Append(item.To<RNSVG::SVGLength>());
      }
    } else if (propertyName == "rotate") {
      m_rotate.Clear();
      for (auto const &item : propertyValue.AsArray()) {
        m_rotate.Append(item.To<RNSVG::SVGLength>());
      }
    }
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);
}

void TextView::DrawGroup(RNSVG::D2DDeviceContext const &context, Size const &size) {
  com_ptr<ID2D1DeviceContext> deviceContext{get_self<D2DDeviceContext>(context)->Get()};

  D2D1_MATRIX_3X2_F transform{D2DHelpers::GetTransform(deviceContext.get())};

  bool translateXY{X().Size() > 0 || Y().Size() > 0};
  if (translateXY) {
    float x{X().Size() > 0 ? X().GetAt(0).Value : 0};
    float y{Y().Size() > 0 ? Y().GetAt(0).Value : 0};

    deviceContext->SetTransform(D2D1::Matrix3x2F::Translation({x,y}) * transform);
  }
  __super::DrawGroup(context, size);
  if (translateXY) {
    deviceContext->SetTransform(transform);
  }
}
} // namespace winrt::RNSVG::implementation
