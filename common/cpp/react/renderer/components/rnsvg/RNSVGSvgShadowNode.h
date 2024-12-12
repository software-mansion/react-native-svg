#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnsvg/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/components/view/conversions.h>
#include <react/renderer/core/LayoutConstraints.h>
#include <react/renderer/core/LayoutContext.h>

namespace facebook::react {

template <const char *componentName, typename ViewPropsT = ViewProps>
class RNSVGSvgShadowNode final
    : public ConcreteViewShadowNode<componentName, ViewPropsT> {
 public:
  RNSVGSvgShadowNode(
      const ShadowNodeFragment &fragment,
      const ShadowNodeFamily::Shared &family,
      ShadowNodeTraits traits)
      : ConcreteViewShadowNode<componentName, ViewPropsT>(
            fragment,
            family,
            traits) {
    initialize();
  }

  RNSVGSvgShadowNode(
      const ShadowNode &sourceShadowNode,
      const ShadowNodeFragment &fragment)
      : ConcreteViewShadowNode<componentName, ViewPropsT>(
            sourceShadowNode,
            fragment) {
    initialize();
  }

  void layout(LayoutContext layoutContext) {
    auto affectedNodes = layoutContext.affectedNodes;
    layoutContext.affectedNodes = nullptr;
    YogaLayoutableShadowNode::layout(layoutContext);
    layoutContext.affectedNodes = affectedNodes;
  }

 private:
  void initialize() {
    auto style = this->yogaNode_.style();

    const auto &props = this->getConcreteProps();
    auto width = parseLength(props.bbWidth);
    auto height = parseLength(props.bbHeight);

    bool hasViewBox = props.vbWidth != 0 && props.vbHeight != 0;
    bool widthIsAuto = width.unit() == yoga::Unit::Auto;
    bool heightIsAuto = height.unit() == yoga::Unit::Auto;

    if (!hasViewBox) {
      if (widthIsAuto) {
        style.setDimension(yoga::Dimension::Width, yoga::value::points(300));
      }
      if (heightIsAuto) {
        style.setDimension(yoga::Dimension::Height, yoga::value::points(150));
      }
    } else if (widthIsAuto || heightIsAuto) {
      auto aspectRatio = props.vbWidth / props.vbHeight;
      style.setAspectRatio(yoga::FloatOptional(aspectRatio));
      if (widthIsAuto && heightIsAuto) {
        style.setDimension(yoga::Dimension::Width, yoga::value::percent(100));
      } else if (heightIsAuto) {
        style.setDimension(yoga::Dimension::Height, yoga::value::undefined());
      } else if (widthIsAuto) {
        style.setDimension(yoga::Dimension::Width, yoga::value::undefined());
      }
    }

    this->yogaNode_.setStyle(style);
    this->yogaNode_.setDirty(true);
  }

  yoga::Style::Length parseLength(folly::dynamic length) {
    yoga::Style::Length len;
    PropsParserContext propsPareserContext =
        PropsParserContext(0, ContextContainer());
    fromRawValue(propsPareserContext, RawValue(length), len);
    return len;
  }
};

} // namespace facebook::react
