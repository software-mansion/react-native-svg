#include "pch.h"
#include "RenderableView.h"

#include "SvgView.h"
#include "../D2DHelpers.h"

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

void SetCommonSvgProps(
    const SvgView &svgView,
    ID2D1SvgDocument& document,
    ID2D1SvgElement &element,
    const SvgRenderableCommonProps &commonProps) noexcept {
  HRESULT hr = S_OK;
  if (commonProps.color != std::nullopt) {
    auto color = commonProps.color.value().AsWindowsColor(svgView.Theme());
    hr |= element.SetAttributeValue(SvgStrings::colorAttributeName, D2DHelpers::AsD2DColor(color));
  }

  if (commonProps.propList) {
    for (auto &prop : commonProps.propList.value()) {
      if (prop == "fill") {
        if (commonProps.fill != std::nullopt)
          hr |= SetColorMode(svgView, element, SvgStrings::fillAttributeName, commonProps.fill.value());
        else
          hr |= element.SetAttributeValue(
              SvgStrings::fillAttributeName,
              D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
              SvgStrings::noneAttributeValue);
      } else if (prop == "fillOpacity") {
        if (commonProps.fillOpacity != std::nullopt)
          hr |= element.SetAttributeValue(SvgStrings::fillOpacityAttributeName, commonProps.fillOpacity.value());
      } else if (prop == "fillRule") {
        if (commonProps.fillRule != std::nullopt) {
          hr |= element.SetAttributeValue(SvgStrings::fillRuleAttributeName, commonProps.fillRule.value());
        }
      } else if (prop == "stroke") {
        if (commonProps.stroke != std::nullopt)
          hr |= SetColorMode(svgView, element, SvgStrings::strokeAttributeName, commonProps.stroke.value());
        else
          hr |= element.SetAttributeValue(
              SvgStrings::strokeAttributeName,
              D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
              SvgStrings::noneAttributeValue);
      } else if (prop == "strokeWidth") {
        if (commonProps.strokeWidth != std::nullopt)
          hr |= element.SetAttributeValue(SvgStrings::strokeWidthAttributeName, commonProps.strokeWidth.value());
      } else if (prop == "strokeOpacity") {
        if (commonProps.strokeOpacity != std::nullopt)
          hr |= element.SetAttributeValue(SvgStrings::strokeOpacityAttributeName, commonProps.strokeOpacity.value());
      } else if (prop == "strokeDasharray") {
        if (commonProps.strokeDasharray != std::nullopt && !commonProps.strokeDasharray->empty()) {
          winrt::com_ptr<ID2D1SvgStrokeDashArray> dashArray;
          document.CreateStrokeDashArray(
              &commonProps.strokeDasharray.value()[0],
              static_cast<UINT32>(commonProps.strokeDasharray.value().size()),
              dashArray.put());
          hr |= element.SetAttributeValue(SvgStrings::strokeDashArrayAttributeName, dashArray.get());
        }
      } else if (prop == "strokeDashoffset") {
        if (commonProps.strokeDashoffset != std::nullopt) {
          hr |= element.SetAttributeValue(
              SvgStrings::strokeDashOffsetAttributeName, commonProps.strokeDashoffset.value());
        }
      } else if (prop == "strokeLinecap") {
        if (commonProps.strokeLinecap != std::nullopt) {
          static D2D1_SVG_LINE_CAP supportedCaps[] = {
              D2D1_SVG_LINE_CAP_BUTT, D2D1_SVG_LINE_CAP_ROUND, D2D1_SVG_LINE_CAP_SQUARE};
          hr |= element.SetAttributeValue(
              SvgStrings::strokeLinecapAttributeName, supportedCaps[commonProps.strokeLinecap.value()]);
        }
      } else if (prop == "strokeLinejoin") {
        if (commonProps.strokeLinejoin != std::nullopt) {
          static D2D1_SVG_LINE_JOIN supportedJoins[] = {
              D2D1_SVG_LINE_JOIN_MITER, D2D1_SVG_LINE_JOIN_ROUND, D2D1_SVG_LINE_JOIN_BEVEL};
          hr |= element.SetAttributeValue(
              SvgStrings::strokeLinejoinAttributeName, supportedJoins[commonProps.strokeLinejoin.value()]);
        }
      } else if (prop == "strokeMiterlimit") {
        if (commonProps.strokeMiterlimit != std::nullopt) {
          hr |= element.SetAttributeValue(
              SvgStrings::strokeMiterLimitAttributeName, commonProps.strokeMiterlimit.value());
        }
      }
    }
  }

  if (commonProps.clipPath != std::nullopt) {
    std::wstring namedRefStr = L"url(#" + commonProps.clipPath.value() + L")";
    hr |= element.SetAttributeValue(
        SvgStrings::clipPathAttributeName,
        D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
        namedRefStr.c_str());
  }

  if (commonProps.clipRule != std::nullopt) {
    hr |= element.SetAttributeValue(SvgStrings::clipRuleAttributeName, commonProps.clipRule.value());
  }

  if (commonProps.name != std::nullopt)
    hr |= element.SetAttributeValue(
        SvgStrings::idAttributeName,
        D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
        commonProps.name.value().c_str());

  if (commonProps.opacity != std::nullopt)
    hr |= element.SetAttributeValue(SvgStrings::opacityAttributeName, commonProps.opacity.value());

  if (commonProps.matrix != std::nullopt) {
    auto &matrix = commonProps.matrix.value();
    hr |= element.SetAttributeValue(
        SvgStrings::transformAttributeName,
        D2D1_MATRIX_3X2_F{matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]});
  }

  assert(hr == S_OK);
}

SvgNodeCommonProps::SvgNodeCommonProps(const winrt::Microsoft::ReactNative::ViewProps &props) : m_props(props) {}

void SvgNodeCommonProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

SvgRenderableCommonProps::SvgRenderableCommonProps(const winrt::Microsoft::ReactNative::ViewProps &props)
    : base_type(props) {}

void SvgRenderableCommonProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
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
  m_props = props.as<SvgRenderableCommonProps>();
}

void RenderableView::FinalizeUpates(
    const winrt::Microsoft::ReactNative::ComponentView &view,
    winrt::Microsoft::ReactNative::ComponentViewUpdateMask) noexcept {
  Invalidate(view);
}

ID2D1SvgElement &RenderableView::Render(const SvgView &svgView, ID2D1SvgDocument& document, ID2D1SvgElement &svgElement) noexcept {
  svgElement.CreateChild(GetSvgElementName(), m_spD2DSvgElement.put());
  if (m_props)
    SetCommonSvgProps(svgView, document, *m_spD2DSvgElement, *m_props);
  OnRender(document , *m_spD2DSvgElement);
  return *m_spD2DSvgElement;
}

bool RenderableView::IsSupported() const noexcept {
  return true;
}

void RenderableView::OnRender(ID2D1SvgDocument & /*document*/, ID2D1SvgElement & /*element*/) noexcept {}

} // namespace winrt::RNSVG::implementation
