#pragma once

#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>
#include "RNSVGComponentDescriptor.h"
#include "RNSVGShadowNodes.h"

namespace facebook::react {

using RNSVGCircleComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGCircleShadowNode>;
using RNSVGClipPathComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGClipPathShadowNode>;
using RNSVGDefsComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGDefsShadowNode>;
using RNSVGEllipseComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGEllipseShadowNode>;
using RNSVGFeBlendComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGFeBlendShadowNode>;
using RNSVGFeColorMatrixComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGFeColorMatrixShadowNode>;
using RNSVGFeCompositeComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGFeCompositeShadowNode>;
using RNSVGFeFloodComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGFeFloodShadowNode>;
using RNSVGFeGaussianBlurComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGFeGaussianBlurShadowNode>;
using RNSVGFeMergeComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGFeMergeShadowNode>;
using RNSVGFeOffsetComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGFeOffsetShadowNode>;
using RNSVGFilterComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGFilterShadowNode>;
using RNSVGForeignObjectComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGForeignObjectShadowNode>;
using RNSVGGroupComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGGroupShadowNode>;
using RNSVGLinearGradientComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGLinearGradientShadowNode>;
using RNSVGLineComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGLineShadowNode>;
using RNSVGMarkerComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGMarkerShadowNode>;
using RNSVGMaskComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGMaskShadowNode>;
using RNSVGPathComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGPathShadowNode>;
using RNSVGPatternComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGPatternShadowNode>;
using RNSVGRadialGradientComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGRadialGradientShadowNode>;
using RNSVGRectComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGRectShadowNode>;
using RNSVGSymbolComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGSymbolShadowNode>;
using RNSVGTextComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGTextShadowNode>;
using RNSVGTextPathComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGTextPathShadowNode>;
using RNSVGTSpanComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGTSpanShadowNode>;
using RNSVGUseComponentDescriptor =
    RNSVGComponentDescriptor<RNSVGUseShadowNode>;

} // namespace facebook::react
