#pragma once

#include <react/renderer/core/PropsParserContext.h>
#include "RNSVGRenderableProps.h"

namespace facebook::react {

class RNSVGLineProps final : public RNSVGRenderableProps {
 public:
  RNSVGLineProps();
  RNSVGLineProps(
      const PropsParserContext& context,
      const RNSVGLineProps& sourceProps,
      const RawProps& rawProps);

  folly::dynamic x1;
  folly::dynamic y1;
  folly::dynamic x2;
  folly::dynamic y2;
};

} // namespace facebook::react
