#pragma once

#include <react/renderer/core/PropsParserContext.h>
#include "RNSVGRenderableProps.h"

namespace facebook::react {

class RNSVGEllipseProps final : public RNSVGRenderableProps {
 public:
  RNSVGEllipseProps();
  RNSVGEllipseProps(
      const PropsParserContext& context,
      const RNSVGEllipseProps& sourceProps,
      const RawProps& rawProps);

  folly::dynamic cx;
  folly::dynamic cy;
  folly::dynamic rx;
  folly::dynamic ry;
};

} // namespace facebook::react
