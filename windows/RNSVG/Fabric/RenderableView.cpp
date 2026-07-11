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

  // extractFill.ts (JS) intentionally leaves `fill` unset and out of `propList` when an
  // element never declares `fill`, so that native inherits it from the parent (e.g. a root
  // <Svg fill="none">). SetCommonSvgProps only calls SetAttributeValue for attributes present
  // in propList, so OnRender above leaves this freshly created D2D SVG element's `fill`
  // attribute completely unset in that case. Because this tree is rebuilt from scratch via
  // CreateChild()/SetAttributeValue() every frame (SvgView::Draw creates a new
  // ID2D1SvgDocument on every Invalidate) rather than parsed from a full <svg> document, D2D
  // does not retroactively cascade an unset presentation attribute from its parent - it
  // resolves to the SVG spec's black initial paint instead, reproducing the exact bug the JS
  // fix was meant to eliminate. Direct2D's paint model (D2D1_SVG_PAINT_TYPE) has no INHERIT
  // value, so setting the literal string "inherit" via SetAttributeValue is not meaningful for
  // `fill`/`stroke` - we resolve inheritance ourselves instead, by copying the parent
  // element's already-resolved `fill` paint onto this element. Parent nodes are always
  // rendered (and thus resolved by this same logic) before their children in
  // SvgView::RecurseRenderNode, so by induction this correctly propagates the nearest
  // explicit ancestor's fill all the way down, and bottoms out at the SVG spec's black
  // default when no ancestor - including the document root, which never has `fill` set (see
  // SvgView::Draw) - ever declared one either.
  if (!m_spD2DSvgElement->IsAttributeSpecified(SvgStrings::fillAttributeName, nullptr)) {
    winrt::com_ptr<ID2D1SvgPaint> parentPaint;
    winrt::com_ptr<ID2D1SvgPaint> childPaint;
    if (SUCCEEDED(svgElement.GetAttributeValue(SvgStrings::fillAttributeName, parentPaint.put())) && parentPaint &&
        SUCCEEDED(m_spD2DSvgElement->GetAttributeValue(SvgStrings::fillAttributeName, childPaint.put())) && childPaint) {
      D2D1_SVG_PAINT_TYPE paintType = parentPaint->GetPaintType();
      childPaint->SetPaintType(paintType);
      if (paintType == D2D1_SVG_PAINT_TYPE_COLOR) {
        D2D1_COLOR_F color;
        parentPaint->GetColor(&color);
        childPaint->SetColor(color);
      } else if (
          paintType == D2D1_SVG_PAINT_TYPE_URI || paintType == D2D1_SVG_PAINT_TYPE_URI_NONE ||
          paintType == D2D1_SVG_PAINT_TYPE_URI_COLOR || paintType == D2D1_SVG_PAINT_TYPE_URI_CURRENT_COLOR) {
        UINT32 idLen = parentPaint->GetIdLength();
        if (idLen > 0) {
          std::wstring id(idLen, L'\0');
          parentPaint->GetId(&id[0], idLen + 1);
          childPaint->SetId(id.c_str());
        }
      }
    }
  }

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
