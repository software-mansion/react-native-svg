
/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <react/renderer/core/ConcreteComponentDescriptor.h>

#include "RNSVGShadowNodes.h"

namespace facebook {
namespace react {

using RNSVGCircleComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGCircleShadowNode>;
using RNSVGClipPathComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGClipPathShadowNode>;
using RNSVGDefsComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGDefsShadowNode>;
using RNSVGEllipseComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGEllipseShadowNode>;
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

} // namespace react
} // namespace facebook
