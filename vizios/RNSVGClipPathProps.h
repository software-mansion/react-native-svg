#pragma once

#include <react/renderer/core/PropsParserContext.h>
#include "RNSVGGroupProps.h"

namespace facebook::react {

// ClipPath has the same props as Group
class RNSVGClipPathProps final : public RNSVGRenderableProps {
 public:
  RNSVGClipPathProps();
  RNSVGClipPathProps(
      const PropsParserContext& context,
      const RNSVGClipPathProps& sourceProps,
      const RawProps& rawProps);

  folly::dynamic fontSize;
  folly::dynamic fontWeight;
  folly::dynamic font;
};

} // namespace facebook::react
