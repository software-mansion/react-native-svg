#pragma once

#include <react/renderer/core/PropsParserContext.h>
#include "RNSVGRenderableProps.h"

namespace facebook::react {

class RNSVGGroupProps final : public RNSVGRenderableProps {
 public:
  RNSVGGroupProps();
  RNSVGGroupProps(
      const PropsParserContext& context,
      const RNSVGGroupProps& sourceProps,
      const RawProps& rawProps);

  // Group-specific: font properties
  folly::dynamic fontSize;
  folly::dynamic fontWeight;
  folly::dynamic font;
};

} // namespace facebook::react
