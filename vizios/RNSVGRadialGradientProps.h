#pragma once

#include <react/renderer/components/view/ViewProps.h>
#include <react/renderer/core/PropsParserContext.h>
#include "RNSVGCommonProps.h"

namespace facebook::react {

class RNSVGRadialGradientProps final : public ViewProps {
 public:
  RNSVGRadialGradientProps();
  RNSVGRadialGradientProps(
      const PropsParserContext& context,
      const RNSVGRadialGradientProps& sourceProps,
      const RawProps& rawProps);

  SvgNodeProps node;

  folly::dynamic fx;
  folly::dynamic fy;
  folly::dynamic cx;
  folly::dynamic cy;
  folly::dynamic rx;
  folly::dynamic ry;
  std::vector<Float> gradient;
  int gradientUnits{0};
  std::vector<Float> gradientTransform;
};

} // namespace facebook::react
