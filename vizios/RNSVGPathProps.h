#pragma once

#include <react/renderer/core/PropsParserContext.h>
#include "RNSVGRenderableProps.h"

namespace facebook::react {

class RNSVGPathProps final : public RNSVGRenderableProps {
 public:
  RNSVGPathProps();
  RNSVGPathProps(
      const PropsParserContext& context,
      const RNSVGPathProps& sourceProps,
      const RawProps& rawProps);

  std::string d; // SVG path data
};

} // namespace facebook::react
