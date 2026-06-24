#pragma once

#include <react/renderer/components/view/ViewProps.h>
#include <react/renderer/core/PropsParserContext.h>
#include "RNSVGCommonProps.h"

namespace facebook::react {

class RNSVGLinearGradientProps final : public ViewProps {
 public:
  RNSVGLinearGradientProps();
  RNSVGLinearGradientProps(
      const PropsParserContext& context,
      const RNSVGLinearGradientProps& sourceProps,
      const RawProps& rawProps);

  SvgNodeProps node;

  folly::dynamic x1;
  folly::dynamic y1;
  folly::dynamic x2;
  folly::dynamic y2;
  std::vector<Float> gradient;
  int gradientUnits{0};
  std::vector<Float> gradientTransform;
};

} // namespace facebook::react
