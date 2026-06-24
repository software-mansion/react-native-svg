#pragma once

#include <react/renderer/components/view/ViewProps.h>
#include <react/renderer/core/PropsParserContext.h>
#include "RNSVGCommonProps.h"

namespace facebook::react {

class RNSVGSvgViewProps final : public ViewProps {
 public:
  RNSVGSvgViewProps();
  RNSVGSvgViewProps(
      const PropsParserContext& context,
      const RNSVGSvgViewProps& sourceProps,
      const RawProps& rawProps);

  // viewBox components
  Float minX{0.0f};
  Float minY{0.0f};
  Float vbWidth{0.0f};
  Float vbHeight{0.0f};
  std::string align;
  int meetOrSlice{0};

  // Dimensions (can be number or percentage string)
  folly::dynamic bbWidth;
  folly::dynamic bbHeight;

  SharedColor color;
  std::string pointerEvents;
};

} // namespace facebook::react
