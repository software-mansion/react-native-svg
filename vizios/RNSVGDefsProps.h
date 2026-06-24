#pragma once

#include <react/renderer/components/view/ViewProps.h>
#include <react/renderer/core/PropsParserContext.h>
#include "RNSVGCommonProps.h"

namespace facebook::react {

class RNSVGDefsProps final : public ViewProps {
 public:
  RNSVGDefsProps();
  RNSVGDefsProps(
      const PropsParserContext& context,
      const RNSVGDefsProps& sourceProps,
      const RawProps& rawProps);

  SvgNodeProps node;
};

} // namespace facebook::react
