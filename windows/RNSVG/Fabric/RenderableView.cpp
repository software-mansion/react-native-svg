#include "pch.h"
#include "RenderableView.h"

#include "SvgView.h"
#include "D2DHelpers.h"

namespace winrt::Microsoft::ReactNative {

void WriteValue(IJSValueWriter const &writer, const D2D1_SVG_LENGTH &value) noexcept {
  if (value.units == D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_PERCENTAGE) {
    writer.WriteString(winrt::to_hstring(std::to_string(value.value) + "%"));
  } else {
    writer.WriteDouble(value.value);
  }
}

void ReadValue(IJSValueReader const &reader, /*out*/ D2D1_SVG_LENGTH &value) noexcept {
  switch (reader.ValueType()) {
    case JSValueType::String: {
      auto str = to_string(reader.GetString());

      auto strLength{str.size()};
      if (strLength == 0 || str == "normal") {
        value.units = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER;
        value.value = 0.0;
        return;
      } else if (str.back() == '%') {
        value.units = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_PERCENTAGE;
        value.value = std::stof(str.substr(0, strLength - 1), nullptr);
        return;
      } else if (strLength > 2) {
        auto end{strLength - 2};
        auto lastTwo{str.substr(end)};

        if (lastTwo == "px") {
          value.units = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER;
        } else if (lastTwo == "em") {
          value.units = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER;
          // value.unit = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_EM;
        } else if (lastTwo == "ex") {
          // value.unit = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_EX;
          value.units = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER;
        } else if (lastTwo == "cm") {
          // value.unit = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_CM;
          value.units = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER;
        } else if (lastTwo == "mm") {
          // value.unit = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_MM;
          value.units = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER;
        } else if (lastTwo == "in") {
          // value.unit = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_INCH;
          value.units = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER;
        } else if (lastTwo == "pt") {
          // value.unit = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_POINT;
          value.units = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER;
        } else if (lastTwo == "pc") {
          // value.unit = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_PICA;
          value.units = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER;
        } else {
          value.units = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER;
          end = strLength;
        }

        value.value = std::stof(str.substr(0, end), nullptr);
        return;
      }

      value.units = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER;
      value.value = std::stof(str, nullptr);
    }
      return;
    case JSValueType::Int64:
      value.units = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER;
      value.value = static_cast<float>(reader.GetInt64());
      return;
    case JSValueType::Double:
      value.units = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER;
      value.value = static_cast<float>(reader.GetDouble());
      return;
    default:
      value.units = D2D1_SVG_LENGTH_UNITS::D2D1_SVG_LENGTH_UNITS_NUMBER;
      value.value = 0.0f;
      return;
  }
}

}

namespace winrt::RNSVG::implementation {

HRESULT
SetColorMode(
    const SvgView &svgView,
    ID2D1SvgElement &element,
    const std::wstring &attribute,
    const ColorStruct &colorProp) noexcept {
  HRESULT hr = S_OK;
  if (colorProp.type == 0 /*Native Color*/) {
    hr = element.SetAttributeValue(
        attribute.c_str(), D2DHelpers::AsD2DColor(colorProp.payload.AsWindowsColor(svgView.Theme())));
  } else if (colorProp.type == 1 /*Brush ref*/) {
    std::wstring namedRefStr = L"url(#" + colorProp.brushRef + L")";
    hr = element.SetAttributeValue(
        attribute.c_str(), D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG, namedRefStr.c_str());
  } else if (colorProp.type == 2 /*Current Color*/) {
    hr = element.SetAttributeValue(
        attribute.c_str(), D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG, L"currentColor");
  } else if (colorProp.type == 3 /*context-fill*/) {
    hr = element.SetAttributeValue(
        attribute.c_str(), D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG, L"context-fill");
  } else if (colorProp.type == 4 /*context-stroke*/) {
    hr = element.SetAttributeValue(
        attribute.c_str(), D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG, L"context-fill");
  }

  assert(hr == S_OK);
  return hr;
}


void RenderableView::Invalidate(const winrt::Microsoft::ReactNative::ComponentView &view) {
  winrt::com_ptr<winrt::RNSVG::implementation::ISvgView> svgView{nullptr};
  auto current = view.Parent();
  while (current && !svgView) {
    svgView = current.UserData().try_as<winrt::RNSVG::implementation::ISvgView>();
    current = current.Parent();
  }

  if (svgView) {
    svgView->Invalidate();
  }
}

void RenderableView::MountChildComponentView(
    const winrt::Microsoft::ReactNative::ComponentView &parent,
    const winrt::Microsoft::ReactNative::MountChildComponentViewArgs &) noexcept {
  Invalidate(parent);
}

void RenderableView::UnmountChildComponentView(
    const winrt::Microsoft::ReactNative::ComponentView &parent,
    const winrt::Microsoft::ReactNative::UnmountChildComponentViewArgs &) noexcept {
  Invalidate(parent);
}

void RenderableView::UpdateProps(
    const winrt::Microsoft::ReactNative::ComponentView & /*view*/,
    const winrt::Microsoft::ReactNative::IComponentProps &props,
    const winrt::Microsoft::ReactNative::IComponentProps &) noexcept {
  m_props = props;
}

void RenderableView::FinalizeUpates(
    const winrt::Microsoft::ReactNative::ComponentView &view,
    winrt::Microsoft::ReactNative::ComponentViewUpdateMask) noexcept {
  Invalidate(view);
}

ID2D1SvgElement &RenderableView::Render(const SvgView &svgView, ID2D1SvgDocument& document, ID2D1SvgElement &svgElement) noexcept {
  svgElement.CreateChild(GetSvgElementName(), m_spD2DSvgElement.put());
  OnRender(svgView, document, *m_spD2DSvgElement);
  return *m_spD2DSvgElement;
}

bool RenderableView::IsSupported() const noexcept {
  return true;
}
void RenderableView::OnRender(
    const SvgView & /*svgView*/,
    ID2D1SvgDocument & /*document*/,
    ID2D1SvgElement & /*element*/) noexcept {
  assert(false);
}

} // namespace winrt::RNSVG::implementation
