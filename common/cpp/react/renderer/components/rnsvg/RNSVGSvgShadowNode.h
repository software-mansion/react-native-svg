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

    bool hasViewBox = props.vbWidth != 0 && props.vbHeight != 0;
    bool isWidthEmpty = props.bbWidth.empty();
    bool isHeightEmpty = props.bbHeight.empty();

    if (!hasViewBox) {
      if (isWidthEmpty) {
        style.setDimension(yoga::Dimension::Width, yoga::value::points(300));
      }
      if (isHeightEmpty) {
        style.setDimension(yoga::Dimension::Height, yoga::value::points(150));
      }
    } else if (isWidthEmpty || isHeightEmpty) {
      auto vbAspectRatio = props.vbWidth / props.vbHeight;
      style.setAspectRatio(yoga::FloatOptional(vbAspectRatio));
      if (isWidthEmpty && isHeightEmpty) {
        style.setDimension(yoga::Dimension::Width, yoga::value::percent(100));
      } else if (isWidthEmpty) {
        style.setDimension(yoga::Dimension::Width, yoga::value::undefined());
      } else if (isHeightEmpty) {
        style.setDimension(yoga::Dimension::Height, yoga::value::undefined());
      }
    }

    bool isWidthAuto =
        props.bbWidth.isString() && props.bbWidth.asString() == "auto";
    bool isHeightAuto =
        props.bbHeight.isString() && props.bbHeight.asString() == "auto";

    if (isWidthAuto) {
      style.setDimension(yoga::Dimension::Width, yoga::value::percent(100));
    }
    if (isHeightAuto) {
      style.setDimension(yoga::Dimension::Height, yoga::value::percent(100));
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
