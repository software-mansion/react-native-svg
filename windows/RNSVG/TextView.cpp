#include "pch.h"
#include "TextView.h"
#include "TextView.g.cpp"

#include "D2DHelpers.h"

using namespace winrt::Microsoft::ReactNative;

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

void TextView::DrawGroup(IInspectable const &context, Size size) {
  com_ptr<ID2D1DeviceContext1> deviceContext;
  copy_to_abi(context, *deviceContext.put_void());

  D2D1_MATRIX_3X2_F transform{D2DHelpers::GetTransform(deviceContext.get())};

  bool translateXY{X().Size() > 0 || Y().Size() > 0};
  if (translateXY) {
    float x{X().Size() > 0 ? X().GetAt(0).Value() : 0};
    float y{Y().Size() > 0 ? Y().GetAt(0).Value() : 0};
    deviceContext->SetTransform(transform * D2DHelpers::AsD2DTransform(Numerics::make_float3x2_translation(x, y)));
  }
  __super::DrawGroup(context, size);
  if (translateXY) {
    deviceContext->SetTransform(transform);
  }
}
} // namespace winrt::RNSVG::implementation
