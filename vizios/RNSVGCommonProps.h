#pragma once

#include <string>
#include <vector>
#include <react/renderer/components/view/ViewProps.h>
#include <react/renderer/core/PropsParserContext.h>
#include <react/renderer/graphics/Color.h>

namespace facebook::react {

// Shared SVG node properties (present on all SVG elements)
struct SvgNodeProps {
  std::string name;
  Float opacity{1.0f};
  std::vector<Float> matrix;
  std::string mask;
  std::string markerStart;
  std::string markerMid;
  std::string markerEnd;
  std::string clipPath;
  int clipRule{0};
  bool responsible{false};
  std::string display;
  std::string pointerEvents;
};

// Shared SVG renderable properties (fill, stroke, etc.)
struct SvgRenderableProps {
  SharedColor color;
  // fill is stored as a dynamic (can be color or struct with type/payload/brushRef)
  folly::dynamic fill;
  Float fillOpacity{1.0f};
  int fillRule{1};
  folly::dynamic stroke;
  Float strokeOpacity{1.0f};
  folly::dynamic strokeWidth;
  int strokeLinecap{0};
  int strokeLinejoin{0};
  folly::dynamic strokeDasharray;
  Float strokeDashoffset{0.0f};
  Float strokeMiterlimit{0.0f};
  int vectorEffect{0};
  std::vector<std::string> propList;
  std::string filter;
};

// Parse SvgNodeProps from RawProps
SvgNodeProps parseSvgNodeProps(
    const PropsParserContext& context,
    const RawProps& rawProps,
    const SvgNodeProps& sourceProps);

// Parse SvgRenderableProps from RawProps
SvgRenderableProps parseSvgRenderableProps(
    const PropsParserContext& context,
    const RawProps& rawProps,
    const SvgRenderableProps& sourceProps);

} // namespace facebook::react
