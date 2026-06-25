#pragma once

#include <react/renderer/components/view/ViewProps.h>
#include <react/renderer/core/PropsParserContext.h>

namespace facebook::react {

class RNSVGSvgViewProps final : public ViewProps {
 public:
  RNSVGSvgViewProps();
  RNSVGSvgViewProps(
      const PropsParserContext& context,
      const RNSVGSvgViewProps& sourceProps,
      const RawProps& rawProps);

  // URI for loading SVG from a remote/local source (used by SvgUri)
  std::string svgUri;

  // viewBox components (optional)
  Float minX{0.0f};
  Float minY{0.0f};
  Float vbWidth{0.0f};
  Float vbHeight{0.0f};
};

} // namespace facebook::react
