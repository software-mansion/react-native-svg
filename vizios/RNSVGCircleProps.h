#pragma once

#include <react/renderer/core/PropsParserContext.h>
#include "RNSVGRenderableProps.h"

namespace facebook::react {

class RNSVGCircleProps final : public RNSVGRenderableProps {
 public:
  RNSVGCircleProps();
  RNSVGCircleProps(
      const PropsParserContext& context,
      const RNSVGCircleProps& sourceProps,
      const RawProps& rawProps);

  folly::dynamic cx;
  folly::dynamic cy;
  folly::dynamic r;
};

} // namespace facebook::react
