#pragma once

#include <react/renderer/components/view/ViewProps.h>
#include <react/renderer/core/PropsParserContext.h>
#include "RNSVGCommonProps.h"

namespace facebook::react {

// Base props class for all SVG renderable elements (Group, Path, Rect, Circle, etc.)
class RNSVGRenderableProps : public ViewProps {
 public:
  RNSVGRenderableProps();
  RNSVGRenderableProps(
      const PropsParserContext& context,
      const RNSVGRenderableProps& sourceProps,
      const RawProps& rawProps);

  SvgNodeProps node;
  SvgRenderableProps renderable;
};

} // namespace facebook::react
