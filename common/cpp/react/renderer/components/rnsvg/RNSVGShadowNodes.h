/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnsvg/Props.h>
#include <react/renderer/core/ConcreteShadowNode.h>
#include <react/renderer/core/ShadowNode.h>

#include "RNSVGNodeShadowNode.h"

namespace facebook {
namespace react {

JSI_EXPORT extern const char RNSVGCircleComponentName[];

/*
 * `ShadowNode` for <RNSVGCircle> component.
 */
using RNSVGCircleShadowNode =
    RNSVGNodeShadowNode<RNSVGCircleComponentName, RNSVGCircleProps>;

JSI_EXPORT extern const char RNSVGClipPathComponentName[];

/*
 * `ShadowNode` for <RNSVGClipPath> component.
 */
using RNSVGClipPathShadowNode =
    RNSVGNodeShadowNode<RNSVGClipPathComponentName, RNSVGClipPathProps>;

JSI_EXPORT extern const char RNSVGDefsComponentName[];

/*
 * `ShadowNode` for <RNSVGDefs> component.
 */
using RNSVGDefsShadowNode =
    RNSVGNodeShadowNode<RNSVGDefsComponentName, RNSVGDefsProps>;

JSI_EXPORT extern const char RNSVGEllipseComponentName[];

/*
 * `ShadowNode` for <RNSVGEllipse> component.
 */
using RNSVGEllipseShadowNode =
    RNSVGNodeShadowNode<RNSVGEllipseComponentName, RNSVGEllipseProps>;

JSI_EXPORT extern const char RNSVGForeignObjectComponentName[];

/*
 * `ShadowNode` for <RNSVGForeignObject> component.
 */
using RNSVGForeignObjectShadowNode = RNSVGNodeShadowNode<
    RNSVGForeignObjectComponentName,
    RNSVGForeignObjectProps>;

JSI_EXPORT extern const char RNSVGGroupComponentName[];

/*
 * `ShadowNode` for <RNSVGGroup> component.
 */
using RNSVGGroupShadowNode =
    RNSVGNodeShadowNode<RNSVGGroupComponentName, RNSVGGroupProps>;

JSI_EXPORT extern const char RNSVGLinearGradientComponentName[];

/*
 * `ShadowNode` for <RNSVGLinearGradient> component.
 */
using RNSVGLinearGradientShadowNode = RNSVGNodeShadowNode<
    RNSVGLinearGradientComponentName,
    RNSVGLinearGradientProps>;

JSI_EXPORT extern const char RNSVGLineComponentName[];

/*
 * `ShadowNode` for <RNSVGLine> component.
 */
using RNSVGLineShadowNode =
    RNSVGNodeShadowNode<RNSVGLineComponentName, RNSVGLineProps>;

JSI_EXPORT extern const char RNSVGMarkerComponentName[];

/*
 * `ShadowNode` for <RNSVGMarker> component.
 */
using RNSVGMarkerShadowNode =
    RNSVGNodeShadowNode<RNSVGMarkerComponentName, RNSVGMarkerProps>;

JSI_EXPORT extern const char RNSVGMaskComponentName[];

/*
 * `ShadowNode` for <RNSVGMask> component.
 */
using RNSVGMaskShadowNode =
    RNSVGNodeShadowNode<RNSVGMaskComponentName, RNSVGMaskProps>;

JSI_EXPORT extern const char RNSVGPathComponentName[];

/*
 * `ShadowNode` for <RNSVGPath> component.
 */
using RNSVGPathShadowNode =
    RNSVGNodeShadowNode<RNSVGPathComponentName, RNSVGPathProps>;

JSI_EXPORT extern const char RNSVGPatternComponentName[];

/*
 * `ShadowNode` for <RNSVGPattern> component.
 */
using RNSVGPatternShadowNode =
    RNSVGNodeShadowNode<RNSVGPatternComponentName, RNSVGPatternProps>;

JSI_EXPORT extern const char RNSVGRadialGradientComponentName[];

/*
 * `ShadowNode` for <RNSVGRadialGradient> component.
 */
using RNSVGRadialGradientShadowNode = RNSVGNodeShadowNode<
    RNSVGRadialGradientComponentName,
    RNSVGRadialGradientProps>;

JSI_EXPORT extern const char RNSVGRectComponentName[];

/*
 * `ShadowNode` for <RNSVGRect> component.
 */
using RNSVGRectShadowNode =
    RNSVGNodeShadowNode<RNSVGRectComponentName, RNSVGRectProps>;

JSI_EXPORT extern const char RNSVGSymbolComponentName[];

/*
 * `ShadowNode` for <RNSVGSymbol> component.
 */
using RNSVGSymbolShadowNode =
    RNSVGNodeShadowNode<RNSVGSymbolComponentName, RNSVGSymbolProps>;

JSI_EXPORT extern const char RNSVGTextComponentName[];

/*
 * `ShadowNode` for <RNSVGText> component.
 */
using RNSVGTextShadowNode =
    RNSVGNodeShadowNode<RNSVGTextComponentName, RNSVGTextProps>;

JSI_EXPORT extern const char RNSVGTextPathComponentName[];

/*
 * `ShadowNode` for <RNSVGTextPath> component.
 */
using RNSVGTextPathShadowNode =
    RNSVGNodeShadowNode<RNSVGTextPathComponentName, RNSVGTextPathProps>;

JSI_EXPORT extern const char RNSVGTSpanComponentName[];

/*
 * `ShadowNode` for <RNSVGTSpan> component.
 */
using RNSVGTSpanShadowNode =
    RNSVGNodeShadowNode<RNSVGTSpanComponentName, RNSVGTSpanProps>;

JSI_EXPORT extern const char RNSVGUseComponentName[];

/*
 * `ShadowNode` for <RNSVGUse> component.
 */
using RNSVGUseShadowNode =
    RNSVGNodeShadowNode<RNSVGUseComponentName, RNSVGUseProps>;

} // namespace react
} // namespace facebook
