#pragma once

#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSVGShadowNodes.h"

namespace facebook::react {

using RNSVGCircleComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGCircleShadowNode>;
using RNSVGClipPathComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGClipPathShadowNode>;
using RNSVGDefsComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGDefsShadowNode>;
using RNSVGEllipseComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGEllipseShadowNode>;
using RNSVGFeBlendComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGFeBlendShadowNode>;
using RNSVGFeColorMatrixComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGFeColorMatrixShadowNode>;
using RNSVGFeCompositeComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGFeCompositeShadowNode>;
using RNSVGFeFloodComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGFeFloodShadowNode>;
using RNSVGFeGaussianBlurComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGFeGaussianBlurShadowNode>;
using RNSVGFeMergeComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGFeMergeShadowNode>;
using RNSVGFeOffsetComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGFeOffsetShadowNode>;
using RNSVGFilterComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGFilterShadowNode>;
using RNSVGForeignObjectComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGForeignObjectShadowNode>;
using RNSVGGroupComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGGroupShadowNode>;
using RNSVGLinearGradientComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGLinearGradientShadowNode>;
using RNSVGLineComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGLineShadowNode>;
using RNSVGMarkerComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGMarkerShadowNode>;
using RNSVGMaskComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGMaskShadowNode>;
using RNSVGPathComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGPathShadowNode>;
using RNSVGPatternComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGPatternShadowNode>;
using RNSVGRadialGradientComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGRadialGradientShadowNode>;
using RNSVGRectComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGRectShadowNode>;
using RNSVGSymbolComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGSymbolShadowNode>;
using RNSVGTextComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGTextShadowNode>;
using RNSVGTextPathComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGTextPathShadowNode>;
using RNSVGTSpanComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGTSpanShadowNode>;
using RNSVGUseComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGUseShadowNode>;

} // namespace facebook::react
