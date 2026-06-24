#pragma once

#include <react/renderer/core/PropsParserContext.h>
#include "RNSVGRenderableProps.h"

namespace facebook::react {

class RNSVGRectProps final : public RNSVGRenderableProps {
 public:
  RNSVGRectProps();
  RNSVGRectProps(
      const PropsParserContext& context,
      const RNSVGRectProps& sourceProps,
      const RawProps& rawProps);

  folly::dynamic x;
  folly::dynamic y;
  folly::dynamic width;
  folly::dynamic height;
  folly::dynamic rx;
  folly::dynamic ry;
};

} // namespace facebook::react
