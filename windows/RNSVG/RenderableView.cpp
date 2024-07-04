#include "pch.h"
#include "RenderableView.h"
#if __has_include("RenderableView.g.cpp")
#include "RenderableView.g.cpp"
#endif

#include "JSValueXaml.h"
#include "SvgView.h"
#include "Utils.h"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
#ifdef USE_FABRIC
SvgNodeCommonProps::SvgNodeCommonProps(
    const winrt::Microsoft::ReactNative::ViewProps &props)
    : m_props(props) {}

void SvgNodeCommonProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

SvgRenderableCommonProps::SvgRenderableCommonProps(
    const winrt::Microsoft::ReactNative::ViewProps &props)
    : base_type(props) {}

void SvgRenderableCommonProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

RenderableView::RenderableView(
    const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args)
    : base_type(args), m_reactContext(args.ReactContext()) {}

void RenderableView::MountChildComponentView(
    const winrt::Microsoft::ReactNative::ComponentView &childComponentView,
    uint32_t index) noexcept {
  const RNSVG::RenderableView &view{*this};
  const auto &group{view.try_as<RNSVG::GroupView>()};
  const auto &child{childComponentView.try_as<IRenderable>()};

  if (group && child) {
    base_type::MountChildComponentView(childComponentView, index);
    child.MergeProperties(*this);

    if (child.IsResponsible() && !IsResponsible()) {
      IsResponsible(true);
    }

    if (auto const &root{SvgRoot()}) {
      root.Invalidate();
    }
  }
}

void RenderableView::UnmountChildComponentView(
    const winrt::Microsoft::ReactNative::ComponentView &childComponentView,
    uint32_t index) noexcept {
  const RNSVG::RenderableView &view{*this};
  const auto &group{view.try_as<RNSVG::GroupView>()};
  const auto &child{childComponentView.try_as<IRenderable>()};

  if (group && child) {
    if (!IsUnloaded()) {
      child.Unload();
    }

    base_type::UnmountChildComponentView(childComponentView, index);

    if (auto const &root{SvgRoot()}) {
      root.Invalidate();
    }
  }
}

void RenderableView::UpdateProps(
    const winrt::Microsoft::ReactNative::IComponentProps &props,
    const winrt::Microsoft::ReactNative::IComponentProps &oldProps) noexcept {
  if (!props && !oldProps)
    return;

  UpdateProperties(props, oldProps);
}

void RenderableView::UpdateProperties(
    const winrt::Microsoft::ReactNative::IComponentProps &props,
    const winrt::Microsoft::ReactNative::IComponentProps &oldProps,
    bool forceUpdate,
    bool invalidate) noexcept {
  auto renderableProps = props.as<SvgRenderableCommonProps>();
  auto oldRenderableProps =
      oldProps ? oldProps.as<SvgRenderableCommonProps>() : nullptr;

  auto const &parent{Parent().try_as<RNSVG::RenderableView>()};

  // propList
  /*
  auto const &propList{propertyMap.find("propList")};
  if (propList != propertyMap.end()) {
    m_propList.clear();
    auto const &propValue{(*propList).second};
    for (auto const &item : propValue.AsArray()) {
      m_propList.push_back(Utils::JSValueAsString(item));
    }
  }
  */

  /*******************************/
  /* REACT_SVG_NODE_COMMON_PROPS */
  /*******************************/

  // name
  // not a prop we want to propagate to child elements so we only set it when forceUpdate = true
  if (forceUpdate && (!oldRenderableProps || renderableProps->name != oldRenderableProps->name)) {
    if (parent) {
      SvgRoot().Templates().Remove(m_id);
    }
    m_id = winrt::to_hstring(Utils::JSValueAsString(renderableProps->name));
    if (parent) {
      SaveDefinition();
    }
  }

  // opacity
  // not a prop we want to propagate to child elements so we only set it when forceUpdate = true
  if (forceUpdate && (!oldRenderableProps || renderableProps->opacity != oldRenderableProps->opacity)) {
    m_opacity = Utils::JSValueAsFloat(renderableProps->opacity, 1.0f);
  }

  // matrix
  if (!oldRenderableProps || renderableProps->matrix != oldRenderableProps->matrix) {
    if (forceUpdate) {
      m_transformMatrix = renderableProps->matrix != std::nullopt
          ? Numerics::float3x2(
                renderableProps->matrix->at(0),
                renderableProps->matrix->at(1),
                renderableProps->matrix->at(2),
                renderableProps->matrix->at(3),
                renderableProps->matrix->at(4),
                renderableProps->matrix->at(5))
          : (parent ? parent.SvgTransform() : Numerics::float3x2::identity());
      if (forceUpdate) {
        // If the optional is null, that generally means the prop was deleted
        m_propSetMap[RNSVG::BaseProp::Matrix] = renderableProps->matrix != std::nullopt;
      }
    }
  }

  // mask - not implemented
  //if (!oldRenderableProps || renderableProps->mask != oldRenderableProps->mask) {
  //  m_maskId = to_hstring(Utils::JSValueAsString(renderableProps->mask));
  //}

  // markerStart - not implemented
  //if (!oldRenderableProps || renderableProps->markerStart != oldRenderableProps->markerStart) {
  //   m_markerStart = to_hstring(Utils::JSValueAsString(renderableProps->markerStart));
  //}

  // markerMid - not implemented
  //if (!oldRenderableProps || renderableProps->markerMid != oldRenderableProps->markerMid) {
  //   m_markerMid = to_hstring(Utils::JSValueAsString(renderableProps->markerMid));
  //}
  
  // markerEnd - not implemented
  //if (!oldRenderableProps || renderableProps->markerEnd != oldRenderableProps->markerEnd) {
  //   m_markerEnd = to_hstring(Utils::JSValueAsString(renderableProps->markerEnd));
  //}

  // clipPath
  // not a prop we want to propagate to child elements so we only set it when forceUpdate = true
  if (forceUpdate && (!oldRenderableProps || renderableProps->clipPath != oldRenderableProps->clipPath)) {
    m_clipPathId = to_hstring(Utils::JSValueAsString(renderableProps->clipPath));
  }

  // responsible
  if (!oldRenderableProps || renderableProps->responsible != oldRenderableProps->responsible) {
    m_isResponsible = renderableProps->responsible != std::nullopt ? *renderableProps->responsible : false;
  }

  // display - not implemented
  //if (!oldRenderableProps || renderableProps->display != oldRenderableProps->display) {
  //  m_display = Utils::JSValueAsString(renderableProps->display);
  //}

  // pointerEvents - not implemented
  /*
  if (!oldRenderableProps || renderableProps->pointerEvents != oldRenderableProps->pointerEvents) {
    m_pointerEvents = Utils::JSValueAsString(renderableProps->pointerEvents);
  }
  */

  /*************************************/
  /* REACT_SVG_RENDERABLE_COMMON_PROPS */
  /*************************************/

  // fill
  if (!oldRenderableProps || renderableProps->fill != oldRenderableProps->fill) {
    bool fillSet{
        renderableProps->propList &&
        std::find(renderableProps->propList->begin(), renderableProps->propList->end(), "fill") !=
            renderableProps->propList->end()};

    if (forceUpdate || !m_propSetMap[RNSVG::BaseProp::Fill]) {
      winrt::Microsoft::ReactNative::Color fallbackColor{winrt::Microsoft::ReactNative::Color::Black()};
      if (renderableProps->fill == std::nullopt && fillSet) {
        fallbackColor = winrt::Microsoft::ReactNative::Color::Transparent();
      } else if (parent) {
        fallbackColor = parent.Fill();
      }

      if (!m_fillBrushId.empty()) {
        m_fillBrushId.clear();
      }

      SetColor(renderableProps->fill, fallbackColor, "fill");
    }
    // forceUpdate = true means the property is being set on an element
    // instead of being inherited from the parent.
    if (forceUpdate) {
      m_propSetMap[RNSVG::BaseProp::Fill] = fillSet;
    }
  }

  // fillOpacity
  if (!oldRenderableProps || renderableProps->fillOpacity != oldRenderableProps->fillOpacity) {
    if (forceUpdate || !m_propSetMap[RNSVG::BaseProp::FillOpacity]) {
      float fallbackValue{parent ? parent.FillOpacity() : 1.0f};
      m_fillOpacity = Utils::JSValueAsFloat(renderableProps->fillOpacity, fallbackValue);
    }
    // forceUpdate = true means the property is being set on an element
    // instead of being inherited from the parent.
    if (forceUpdate) {
      // If the optional is null, that generally means the prop was deleted
      m_propSetMap[RNSVG::BaseProp::FillOpacity] = renderableProps->fillOpacity != std::nullopt;
    }
  }

  // fillRule
  if (!oldRenderableProps || renderableProps->fillRule != oldRenderableProps->fillRule) {
    if (forceUpdate || !m_propSetMap[RNSVG::BaseProp::FillRule]) {
      m_fillRule = renderableProps->fillRule != std::nullopt ? *renderableProps->fillRule
                                                             : (parent ? parent.FillRule() : RNSVG::FillRule::NonZero);
    }
    if (forceUpdate) {
      // If the optional is null, that generally means the prop was deleted
      m_propSetMap[RNSVG::BaseProp::FillRule] = renderableProps->fillRule != std::nullopt;
    }
  }

  // stroke
  if (!oldRenderableProps || renderableProps->stroke != oldRenderableProps->stroke) {
    bool strokeSet{
        renderableProps->propList &&
        std::find(renderableProps->propList->begin(), renderableProps->propList->end(), "stroke") !=
            renderableProps->propList->end()};

    if (forceUpdate || !m_propSetMap[RNSVG::BaseProp::Stroke]) {
      winrt::Microsoft::ReactNative::Color fallbackColor{
          ((parent && !strokeSet) ? parent.Stroke() : winrt::Microsoft::ReactNative::Color::Transparent())};

      if (!m_strokeBrushId.empty()) {
        m_strokeBrushId.clear();
      }

      SetColor(renderableProps->stroke, fallbackColor, "stroke");
    }
    // forceUpdate = true means the property is being set on an element
    // instead of being inherited from the parent.
    if (forceUpdate) {
      m_propSetMap[RNSVG::BaseProp::Stroke] = strokeSet;
    }
  }

  // strokeOpacity
  if (!oldRenderableProps || renderableProps->strokeOpacity != oldRenderableProps->strokeOpacity) {
    if (forceUpdate || !m_propSetMap[RNSVG::BaseProp::StrokeOpacity]) {
      float fallbackValue{parent ? parent.StrokeOpacity() : 1.0f};
      m_strokeOpacity = Utils::JSValueAsFloat(renderableProps->strokeOpacity, fallbackValue);
    }
    // forceUpdate = true means the property is being set on an element
    // instead of being inherited from the parent.
    if (forceUpdate) {
      // If the optional is null, that generally means the prop was deleted
      m_propSetMap[RNSVG::BaseProp::StrokeOpacity] = renderableProps->strokeOpacity != std::nullopt;
    }
  }

  // strokeWidth
  if (!oldRenderableProps || renderableProps->strokeWidth != oldRenderableProps->strokeWidth) {
    if (forceUpdate || !m_propSetMap[RNSVG::BaseProp::StrokeWidth]) {
      m_strokeWidth = (renderableProps->strokeWidth != std::nullopt)
          ? *renderableProps->strokeWidth
          : (parent ? parent.StrokeWidth() : RNSVG::SVGLength{1.0f, RNSVG::LengthType::Pixel});
    }

    // forceUpdate = true means the property is being set on an element
    // instead of being inherited from the parent.
    if (forceUpdate) {
      // If the optional is null, that generally means the prop was deleted
      m_propSetMap[RNSVG::BaseProp::StrokeWidth] = renderableProps->strokeWidth != std::nullopt;
    }
  }

  // strokeLinecap
  if (!oldRenderableProps || renderableProps->strokeLinecap != oldRenderableProps->strokeLinecap) {
    if (forceUpdate || !m_propSetMap[RNSVG::BaseProp::StrokeLineCap]) {
      m_strokeLineCap = renderableProps->strokeLinecap != std::nullopt
          ? *renderableProps->strokeLinecap
          : (parent ? parent.StrokeLineCap() : RNSVG::LineCap::Butt);
    }
    // forceUpdate = true means the property is being set on an element
    // instead of being inherited from the parent.
    if (forceUpdate) {
      // If the optional is null, that generally means the prop was deleted
      m_propSetMap[RNSVG::BaseProp::StrokeLineCap] = renderableProps->strokeLinecap != std::nullopt;
    }
  }

  // strokeLinejoin
  if (!oldRenderableProps || renderableProps->strokeLinejoin != oldRenderableProps->strokeLinejoin) {
    if (forceUpdate || !m_propSetMap[RNSVG::BaseProp::StrokeLineJoin]) {
      m_strokeLineJoin = renderableProps->strokeLinejoin != std::nullopt
          ? *renderableProps->strokeLinejoin
          : (parent ? parent.StrokeLineJoin() : RNSVG::LineJoin::Miter);
    }
    // forceUpdate = true means the property is being set on an element
    // instead of being inherited from the parent.
    if (forceUpdate) {
      // If the optional is null, that generally means the prop was deleted
      m_propSetMap[RNSVG::BaseProp::StrokeLineJoin] = renderableProps->strokeLinejoin != std::nullopt;
    }
  }

  // strokeDasharray
  if (!oldRenderableProps || renderableProps->strokeDasharray != oldRenderableProps->strokeDasharray) {
    if (forceUpdate || !m_propSetMap[RNSVG::BaseProp::StrokeDashArray]) {
      if (renderableProps->strokeDasharray != std::nullopt) {
        m_strokeDashArray.Clear();

        for (auto const &item : *renderableProps->strokeDasharray) {
          m_strokeDashArray.Append(item);
        }
      } else {
        m_strokeDashArray = (parent ? parent.StrokeDashArray() : winrt::single_threaded_vector<RNSVG::SVGLength>());
      }
      if (forceUpdate) {
        // If the optional is null, that generally means the prop was deleted
        m_propSetMap[RNSVG::BaseProp::StrokeDashArray] = renderableProps->strokeDasharray != std::nullopt;
      }
    }
  }

  // strokeDashoffset
  if (!oldRenderableProps || renderableProps->strokeDashoffset != oldRenderableProps->strokeDashoffset) {
    if (forceUpdate || !m_propSetMap[RNSVG::BaseProp::StrokeDashOffset]) {
      float fallbackValue{parent ? parent.StrokeDashOffset() : 0.0f};
      m_strokeDashOffset = Utils::JSValueAsFloat(renderableProps->strokeDashoffset, fallbackValue);
    }
    if (forceUpdate) {
      // If the optional is null, that generally means the prop was deleted
      m_propSetMap[RNSVG::BaseProp::StrokeDashOffset] = renderableProps->strokeDashoffset != std::nullopt;
    }
  }

  // strokeMiterlimit
  if (!oldRenderableProps || renderableProps->strokeMiterlimit != oldRenderableProps->strokeMiterlimit) {
    if (forceUpdate || !m_propSetMap[RNSVG::BaseProp::StrokeMiterLimit]) {
      float fallbackValue{parent ? parent.StrokeMiterLimit() : 0.0f};
      m_strokeMiterLimit = Utils::JSValueAsFloat(renderableProps->strokeMiterlimit, fallbackValue);
    }
    if (forceUpdate) {
      // If the optional is null, that generally means the prop was deleted
      m_propSetMap[RNSVG::BaseProp::StrokeMiterLimit] = renderableProps->strokeMiterlimit != std::nullopt;
    }
  }

  // vectorEffect - not implemented
  /*
  if (!oldRenderableProps || renderableProps->vectorEffect != oldRenderableProps->vectorEffect) {
    if (forceUpdate || !m_propSetMap[RNSVG::BaseProp::VectorEffect]) {
      m_vectorEffect = renderableProps->vectorEffect != std::nullopt
          ? *renderableProps->vectorEffect
          : (parent ? parent.VectorEffect() : RNSVG::VectorEffect::None);
    }
    // forceUpdate = true means the property is being set on an element
    // instead of being inherited from the parent.
    if (forceUpdate) {
      // If the optional is null, that generally means the prop was deleted
      m_propSetMap[RNSVG::BaseProp::VectorEffect] = renderableProps->vectorEffect != std::nullopt;
    }
  }
  */

  m_recreateResources = true;

  if (invalidate && Parent()) {
    SvgRoot().Invalidate();
  }
}
#else
void RenderableView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};
  auto const &parent{SvgParent().try_as<RNSVG::RenderableView>()};

  auto const &propList{propertyMap.find("propList")};
  if (propList != propertyMap.end()) {
    m_propList.clear();
    auto const &propValue{(*propList).second};
    for (auto const &item : propValue.AsArray()) {
      m_propList.push_back(Utils::JSValueAsString(item));
    }
  }

  bool fillSet{std::find(m_propList.begin(), m_propList.end(), "fill") != m_propList.end()};
  bool strokeSet{std::find(m_propList.begin(), m_propList.end(), "stroke") != m_propList.end()};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    auto prop{RNSVG::BaseProp::Unknown};

    // name is not a prop we want to propagate to child elements
    // so we only set it when forceUpdate = true
    if (propertyName == "name" && forceUpdate) {
      if (parent) {
        SvgRoot().Templates().Remove(m_id);
      }
      m_id = to_hstring(Utils::JSValueAsString(propertyValue));
      if (parent) {
        SaveDefinition();
      }
    } else if (propertyName == "strokeWidth") {
      prop = RNSVG::BaseProp::StrokeWidth;
      if (forceUpdate || !m_propSetMap[prop]) {
        auto const &fallbackValue{parent ? parent.StrokeWidth() : RNSVG::SVGLength(1.0f, RNSVG::LengthType::Pixel)};
        m_strokeWidth = Utils::JSValueAsSVGLength(propertyValue, fallbackValue);
      }
    } else if (propertyName == "strokeOpacity") {
      prop = RNSVG::BaseProp::StrokeOpacity;
      if (forceUpdate || !m_propSetMap[prop]) {
        float fallbackValue{parent ? parent.StrokeOpacity() : 1.0f};
        m_strokeOpacity = Utils::JSValueAsFloat(propertyValue, fallbackValue);
      }
    } else if (propertyName == "fillOpacity") {
      prop = RNSVG::BaseProp::FillOpacity;
      if (forceUpdate || !m_propSetMap[prop]) {
        float fallbackValue{parent ? parent.FillOpacity() : 1.0f};
        m_fillOpacity = Utils::JSValueAsFloat(propertyValue, fallbackValue);
      }
    } else if (propertyName == "stroke") {
      prop = RNSVG::BaseProp::Stroke;
      if (forceUpdate || !m_propSetMap[prop]) {
        Windows::UI::Color fallbackColor{(parent && !strokeSet) ? parent.Stroke() : Windows::UI::Colors::Transparent()};

        if (!m_strokeBrushId.empty()) {
          m_strokeBrushId.clear();
        }

        SetColor(propertyValue.AsObject(), fallbackColor, propertyName);
      }
    } else if (propertyName == "fill") {
      prop = RNSVG::BaseProp::Fill;
      if (forceUpdate || !m_propSetMap[prop]) {
        Windows::UI::Color fallbackColor{Windows::UI::Colors::Black()};
        if (propertyValue.IsNull() && fillSet) {
          fallbackColor = Windows::UI::Colors::Transparent();
        } else if (parent) {
          fallbackColor = parent.Fill();
        }

        if (!m_fillBrushId.empty()) {
          m_fillBrushId.clear();
        }

        SetColor(propertyValue.AsObject(), fallbackColor, propertyName);
      }
    } else if (propertyName == "strokeLinecap") {
      prop = RNSVG::BaseProp::StrokeLineCap;
      if (forceUpdate || !m_propSetMap[prop]) {
        if (propertyValue.IsNull()) {
          m_strokeLineCap = parent.StrokeLineCap();
        } else {
          m_strokeLineCap = static_cast<RNSVG::LineCap>(propertyValue.AsInt32());
        }
      }
    } else if (propertyName == "strokeLinejoin") {
      prop = RNSVG::BaseProp::StrokeLineJoin;
      if (forceUpdate || !m_propSetMap[prop]) {
        if (propertyValue.IsNull()) {
          m_strokeLineJoin = parent.StrokeLineJoin();
        } else {
          m_strokeLineJoin = static_cast<RNSVG::LineJoin>(propertyValue.AsInt32());
        }
      }
    } else if (propertyName == "fillRule") {
      prop = RNSVG::BaseProp::FillRule;
      if (forceUpdate || !m_propSetMap[prop]) {
        if (propertyValue.IsNull()) {
          m_fillRule = parent.FillRule();
        } else {
          m_fillRule = static_cast<RNSVG::FillRule>(propertyValue.AsInt32());
        }
      }
    } else if (propertyName == "strokeDashoffset") {
      prop = RNSVG::BaseProp::StrokeDashOffset;
      if (forceUpdate || !m_propSetMap[prop]) {
        float fallbackValue{parent ? parent.StrokeDashOffset() : 0.0f};
        m_strokeDashOffset = Utils::JSValueAsFloat(propertyValue, fallbackValue);
      }
    } else if (propertyName == "strokeMiterlimit") {
      prop = RNSVG::BaseProp::StrokeMiterLimit;
      if (forceUpdate || !m_propSetMap[prop]) {
        float fallbackValue{parent ? parent.StrokeMiterLimit() : 0.0f};
        m_strokeMiterLimit = Utils::JSValueAsFloat(propertyValue, fallbackValue);
      }
    } else if (propertyName == "strokeDasharray") {
      prop = RNSVG::BaseProp::StrokeDashArray;
      if (forceUpdate || !m_propSetMap[prop]) {
        if (propertyValue.IsNull()) {
          m_strokeDashArray = parent.StrokeDashArray();
        } else {
          auto const &asArray = propertyValue.AsArray();

          if (!asArray.empty() && (asArray.size() % 2 == 0)) {
            m_strokeDashArray.Clear();

            for (auto const &item : asArray) {
              m_strokeDashArray.Append(item.To<RNSVG::SVGLength>());
            }
          }
        }
      }
    } else if (propertyName == "matrix") {
      prop = RNSVG::BaseProp::Matrix;
      if (forceUpdate) {
        Numerics::float3x2 fallbackValue{parent ? parent.SvgTransform() : Numerics::make_float3x2_rotation(0)};
        m_transformMatrix = Utils::JSValueAsTransform(propertyValue, fallbackValue);
      }
    } else if (propertyName == "opacity" && forceUpdate) {
      m_opacity = Utils::JSValueAsFloat(propertyValue, 1.0f);
    } else if (propertyName == "clipPath") {
      m_clipPathId = to_hstring(Utils::JSValueAsString(propertyValue));
    }  else if (propertyName == "responsible") {
      m_isResponsible = propertyValue.AsBoolean();
    }

    // forceUpdate = true means the property is being set on an element
    // instead of being inherited from the parent.
    if (forceUpdate && (prop != RNSVG::BaseProp::Unknown)) {
      // If the propertyValue is null, that generally means the prop was deleted
      bool propSet{!propertyValue.IsNull()};

      // The exception being Fill and Stroke due to 'none' coming through as null
      if (prop == RNSVG::BaseProp::Fill) {
        propSet = fillSet;
      } else if (prop == RNSVG::BaseProp::Stroke) {
        propSet = strokeSet;
      }

      m_propSetMap[prop] = propSet;
    }
  }

  m_recreateResources = true;

  if (invalidate && SvgParent()) {
    SvgRoot().Invalidate();
  }
}
#endif

void RenderableView::SaveDefinition() {
  if (m_id != L"") {
    SvgRoot().Templates().Insert(m_id, *this);
  }
}

void RenderableView::Draw(RNSVG::D2DDeviceContext const &context, Size const &size) {
  if (m_recreateResources) {
    CreateGeometry(context);
  }

  if (!Geometry()) {
    return;
  }

  com_ptr<ID2D1Geometry> geometry{get_self<D2DGeometry>(m_geometry)->Get()};
  com_ptr<ID2D1DeviceContext> deviceContext{get_self<D2DDeviceContext>(context)->Get()};

  D2D1_MATRIX_3X2_F transform{D2DHelpers::GetTransform(deviceContext.get())};

  if (m_propSetMap[RNSVG::BaseProp::Matrix]) {
    deviceContext->SetTransform(D2DHelpers::AsD2DTransform(SvgTransform()) * transform);
  }

  com_ptr<ID2D1Factory> factory;
  deviceContext->GetFactory(factory.put());

  com_ptr<ID2D1GeometryGroup> geometryGroup;
  ID2D1Geometry *geometries[] = {geometry.get()};
  check_hresult(factory->CreateGeometryGroup(D2DHelpers::GetFillRule(FillRule()), geometries, 1, geometryGroup.put()));

  geometry = geometryGroup;

  com_ptr<ID2D1Geometry> clipPathGeometry;
  if (ClipPathGeometry(context)) {
    clipPathGeometry = get_self<D2DGeometry>(ClipPathGeometry(context))->Get();
  }

  D2DHelpers::PushOpacityLayer(deviceContext.get(), clipPathGeometry.get(), m_opacity);

  if (FillOpacity()) {
    D2DHelpers::PushOpacityLayer(deviceContext.get(), clipPathGeometry.get(), FillOpacity());

    auto fill{Utils::GetCanvasBrush(FillBrushId(), Fill(), SvgRoot(), geometry, context)};
    deviceContext->FillGeometry(geometry.get(), fill.get());

    deviceContext->PopLayer();
  }

  if (StrokeOpacity()) {
    D2DHelpers::PushOpacityLayer(deviceContext.get(), clipPathGeometry.get(), StrokeOpacity());

    D2D1_CAP_STYLE capStyle{D2DHelpers::GetLineCap(m_strokeLineCap)};
    D2D1_LINE_JOIN lineJoin{D2DHelpers::GetLineJoin(m_strokeLineJoin)};

    D2D1_STROKE_STYLE_PROPERTIES strokeStyleProperties;
    strokeStyleProperties.startCap = capStyle;
    strokeStyleProperties.endCap = capStyle;
    strokeStyleProperties.dashCap = capStyle;
    strokeStyleProperties.lineJoin = lineJoin;
    strokeStyleProperties.dashOffset = StrokeDashOffset();
    strokeStyleProperties.miterLimit = StrokeMiterLimit();
    strokeStyleProperties.dashStyle = D2D1_DASH_STYLE_SOLID;

    float canvasDiagonal{Utils::GetCanvasDiagonal(size)};
    float strokeWidth{Utils::GetAbsoluteLength(StrokeWidth(), canvasDiagonal)};

    float *dashArray = nullptr;
    if (StrokeDashArray().Size() > 0) {
      strokeStyleProperties.dashStyle = D2D1_DASH_STYLE_CUSTOM;
      m_adjustedStrokeDashArray = Utils::GetAdjustedStrokeArray(StrokeDashArray(), strokeWidth, canvasDiagonal);
      dashArray = &m_adjustedStrokeDashArray[0];
    }

    com_ptr<ID2D1StrokeStyle> strokeStyle;
    check_hresult(factory->CreateStrokeStyle(strokeStyleProperties, dashArray, m_strokeDashArray.Size(), strokeStyle.put()));

    auto const stroke{Utils::GetCanvasBrush(StrokeBrushId(), Stroke(), SvgRoot(), geometry, context)};
    deviceContext->DrawGeometry(geometry.get(), stroke.get(), strokeWidth, strokeStyle.get());
    deviceContext->PopLayer();
  }

  deviceContext->PopLayer();

  deviceContext->SetTransform(transform);
}

void RenderableView::MergeProperties(RNSVG::IRenderable const &other) {
  auto view{other.try_as<RNSVG::RenderableView>()};

  for (auto const &prop : m_propSetMap) {
    if (!prop.second && view) {
      switch (prop.first) {
        case RNSVG::BaseProp::Fill:
          m_fill = view.Fill();
          m_fillBrushId = view.FillBrushId();
          break;
        case RNSVG::BaseProp::FillOpacity:
          m_fillOpacity = view.FillOpacity();
          break;
        case RNSVG::BaseProp::FillRule:
          m_fillRule = view.FillRule();
          break;
        case RNSVG::BaseProp::Stroke:
          m_stroke = view.Stroke();
          m_strokeBrushId = view.StrokeBrushId();
          break;
        case RNSVG::BaseProp::StrokeOpacity:
          m_strokeOpacity = view.StrokeOpacity();
          break;
        case RNSVG::BaseProp::StrokeWidth:
          m_strokeWidth = view.StrokeWidth();
          break;
        case RNSVG::BaseProp::StrokeMiterLimit:
          m_strokeMiterLimit = view.StrokeMiterLimit();
          break;
        case RNSVG::BaseProp::StrokeDashOffset:
          m_strokeDashOffset = view.StrokeDashOffset();
          break;
        case RNSVG::BaseProp::StrokeDashArray:
          m_strokeDashArray = view.StrokeDashArray();
          break;
        case RNSVG::BaseProp::StrokeLineCap:
          m_strokeLineCap = view.StrokeLineCap();
          break;
        case RNSVG::BaseProp::StrokeLineJoin:
          m_strokeLineJoin = view.StrokeLineJoin();
          break;
        case RNSVG::BaseProp::Unknown:
        default:
          break;
      }
    }
  }
}

RNSVG::SvgView RenderableView::SvgRoot() {
  if (auto parent = SvgParent()) {
    if (auto const &svgView{parent.try_as<RNSVG::SvgView>()}) {
      if (auto const &svgViewParent = svgView.SvgParent()) {
        if (auto const &parent{svgViewParent.try_as<RNSVG::RenderableView>()}) {
          return parent.SvgRoot();
        } else {
          return svgView;
        }
      } else {
        return svgView;
      }
    } else if (auto const &renderable{parent.try_as<RNSVG::RenderableView>()}) {
      return renderable.SvgRoot();
    }
  }

  return nullptr;
}

RNSVG::D2DGeometry RenderableView::ClipPathGeometry(RNSVG::D2DDeviceContext const &context) {
  if (!m_clipPathId.empty()) {
    if (auto const &clipPath{SvgRoot().Templates().TryLookup(m_clipPathId)}) {
      if (!clipPath.Geometry()) {
        clipPath.CreateGeometry(context);
      }
      return clipPath.Geometry();
    }
  }
  return nullptr;
}

void RenderableView::Unload() {
  if (m_geometry) {
    m_geometry = nullptr;
  }

  m_parent = nullptr;
  m_reactContext = nullptr;
  m_propSetMap.clear();
  m_strokeDashArray.Clear();
  m_isUnloaded = true;

#ifndef USE_FABRIC
  m_propList.clear();
#endif
}

RNSVG::IRenderable RenderableView::HitTest(Point const &point) {
  if (m_geometry) {
    BOOL strokeContainsPoint = FALSE;
    D2D1_POINT_2F pointD2D{point.X, point.Y};

    com_ptr<ID2D1Geometry> geometry{get_self<D2DGeometry>(m_geometry)->Get()};

    if (auto const &svgRoot{SvgRoot()}) {
      float canvasDiagonal{Utils::GetCanvasDiagonal(svgRoot.CanvasSize())};
      float strokeWidth{Utils::GetAbsoluteLength(StrokeWidth(), canvasDiagonal)};

      check_hresult(geometry->StrokeContainsPoint(pointD2D, strokeWidth, nullptr, nullptr, &strokeContainsPoint));
    }

    BOOL fillContainsPoint = FALSE;
    check_hresult(geometry->FillContainsPoint(pointD2D, nullptr, &fillContainsPoint));

    if (fillContainsPoint || strokeContainsPoint) {
      return *this;
    }
  }
  return nullptr;
}

#ifdef USE_FABRIC
void RenderableView::SetColor(
    std::optional<ColorStruct> &color,
    winrt::Microsoft::ReactNative::Color const &fallbackColor,
    std::string propName) {
  if (color == std::nullopt) {
    propName == "fill" ? m_fill = fallbackColor : m_stroke = fallbackColor;
    return;
  }

  switch (color->type) {
    // https://github.com/software-mansion/react-native-svg/blob/main/src/lib/extract/extractBrush.ts#L29
    case 1: {
      propName == "fill" ? m_fillBrushId = winrt::to_hstring(color->brushRef)
                         : m_strokeBrushId = winrt::to_hstring(color->brushRef);
      break;
    }
    // https://github.com/software-mansion/react-native-svg/blob/main/src/lib/extract/extractBrush.ts#L6-L8
    case 2: // currentColor
    case 3: // context-fill
    case 4: // context-stroke
      propName == "fill" ? m_fillBrushId = L"currentColor" : m_strokeBrushId = L"currentColor";
      break;
    default: {
      auto const &c = color->payload ? color->payload : fallbackColor;
      propName == "fill" ? m_fill = c : m_stroke = c;
      break;
    }
  }
}
#else
void RenderableView::SetColor(
    const JSValueObject &propValue,
    Windows::UI::Color const &fallbackColor,
    std::string propName) {
  switch (propValue["type"].AsInt64()) {
    // https://github.com/software-mansion/react-native-svg/blob/main/src/lib/extract/extractBrush.ts#L29
    case 1: {
      auto const &brushId{to_hstring(Utils::JSValueAsString(propValue["brushRef"]))};
      propName == "fill" ? m_fillBrushId = brushId : m_strokeBrushId = brushId;
      break;
    }
    // https://github.com/software-mansion/react-native-svg/blob/main/src/lib/extract/extractBrush.ts#L6-L8
    case 2: // currentColor
    case 3: // context-fill
    case 4: // context-stroke
      propName == "fill" ? m_fillBrushId = L"currentColor" : m_strokeBrushId = L"currentColor";
      break;
    default: {
      auto const &color{Utils::JSValueAsColor(propValue["payload"], fallbackColor)};
      propName == "fill" ? m_fill = color : m_stroke = color;
      break;
    }
  }
}
#endif

} // namespace winrt::RNSVG::implementation
