#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnsvg/EventEmitters.h>
#include <react/renderer/components/rnsvg/Props.h>
#include "RNSVGConcreteShadowNode.h"
#include "RNSVGImageState.h"

namespace facebook::react {

JSI_EXPORT extern const char RNSVGCircleComponentName[];

/*
 * `ShadowNode` for <RNSVGCircle> component.
 */
using RNSVGCircleShadowNode =
    RNSVGConcreteShadowNode<RNSVGCircleComponentName, RNSVGCircleProps>;

JSI_EXPORT extern const char RNSVGClipPathComponentName[];

/*
 * `ShadowNode` for <RNSVGClipPath> component.
 */
using RNSVGClipPathShadowNode =
    RNSVGConcreteShadowNode<RNSVGClipPathComponentName, RNSVGClipPathProps>;

JSI_EXPORT extern const char RNSVGDefsComponentName[];

/*
 * `ShadowNode` for <RNSVGDefs> component.
 */
using RNSVGDefsShadowNode =
    RNSVGConcreteShadowNode<RNSVGDefsComponentName, RNSVGDefsProps>;

JSI_EXPORT extern const char RNSVGEllipseComponentName[];

/*
 * `ShadowNode` for <RNSVGEllipse> component.
 */
using RNSVGEllipseShadowNode =
    RNSVGConcreteShadowNode<RNSVGEllipseComponentName, RNSVGEllipseProps>;

JSI_EXPORT extern const char RNSVGFeBlendComponentName[];

/*
 * `ShadowNode` for <RNSVGFeBlend> component.
 */
using RNSVGFeBlendShadowNode =
    RNSVGConcreteShadowNode<RNSVGFeBlendComponentName, RNSVGFeBlendProps>;

JSI_EXPORT extern const char RNSVGFeColorMatrixComponentName[];

/*
 * `ShadowNode` for <RNSVGFeColorMatrix> component.
 */
using RNSVGFeColorMatrixShadowNode = RNSVGConcreteShadowNode<
    RNSVGFeColorMatrixComponentName,
    RNSVGFeColorMatrixProps>;

JSI_EXPORT extern const char RNSVGFeCompositeComponentName[];

/*
 * `ShadowNode` for <RNSVGFeComposite> component.
 */
using RNSVGFeCompositeShadowNode = RNSVGConcreteShadowNode<
    RNSVGFeCompositeComponentName,
    RNSVGFeCompositeProps>;

JSI_EXPORT extern const char RNSVGFeFloodComponentName[];

/*
 * `ShadowNode` for <RNSVGFeFlood> component.
 */
using RNSVGFeFloodShadowNode =
    RNSVGConcreteShadowNode<RNSVGFeFloodComponentName, RNSVGFeFloodProps>;

JSI_EXPORT extern const char RNSVGFeGaussianBlurComponentName[];

/*
 * `ShadowNode` for <RNSVGFeGaussianBlur> component.
 */
using RNSVGFeGaussianBlurShadowNode = RNSVGConcreteShadowNode<
    RNSVGFeGaussianBlurComponentName,
    RNSVGFeGaussianBlurProps>;

JSI_EXPORT extern const char RNSVGFeMergeComponentName[];

/*
 * `ShadowNode` for <RNSVGFeMerge> component.
 */
using RNSVGFeMergeShadowNode =
    RNSVGConcreteShadowNode<RNSVGFeMergeComponentName, RNSVGFeMergeProps>;

JSI_EXPORT extern const char RNSVGFeOffsetComponentName[];

/*
 * `ShadowNode` for <RNSVGFeOffset> component.
 */
using RNSVGFeOffsetShadowNode =
    RNSVGConcreteShadowNode<RNSVGFeOffsetComponentName, RNSVGFeOffsetProps>;

JSI_EXPORT extern const char RNSVGFilterComponentName[];

/*
 * `ShadowNode` for <RNSVGFilter> component.
 */
using RNSVGFilterShadowNode =
    RNSVGConcreteShadowNode<RNSVGFilterComponentName, RNSVGFilterProps>;

JSI_EXPORT extern const char RNSVGForeignObjectComponentName[];

/*
 * `ShadowNode` for <RNSVGForeignObject> component.
 */
using RNSVGForeignObjectShadowNode = RNSVGConcreteShadowNode<
    RNSVGForeignObjectComponentName,
    RNSVGForeignObjectProps>;

JSI_EXPORT extern const char RNSVGGroupComponentName[];

/*
 * `ShadowNode` for <RNSVGGroup> component.
 */
using RNSVGGroupShadowNode =
    RNSVGConcreteShadowNode<RNSVGGroupComponentName, RNSVGGroupProps>;

JSI_EXPORT extern const char RNSVGLinearGradientComponentName[];

/*
 * `ShadowNode` for <RNSVGLinearGradient> component.
 */
using RNSVGLinearGradientShadowNode = RNSVGConcreteShadowNode<
    RNSVGLinearGradientComponentName,
    RNSVGLinearGradientProps>;

JSI_EXPORT extern const char RNSVGLineComponentName[];

/*
 * `ShadowNode` for <RNSVGLine> component.
 */
using RNSVGLineShadowNode =
    RNSVGConcreteShadowNode<RNSVGLineComponentName, RNSVGLineProps>;

JSI_EXPORT extern const char RNSVGMarkerComponentName[];

/*
 * `ShadowNode` for <RNSVGMarker> component.
 */
using RNSVGMarkerShadowNode =
    RNSVGConcreteShadowNode<RNSVGMarkerComponentName, RNSVGMarkerProps>;

JSI_EXPORT extern const char RNSVGMaskComponentName[];

/*
 * `ShadowNode` for <RNSVGMask> component.
 */
using RNSVGMaskShadowNode =
    RNSVGConcreteShadowNode<RNSVGMaskComponentName, RNSVGMaskProps>;

JSI_EXPORT extern const char RNSVGPathComponentName[];

/*
 * `ShadowNode` for <RNSVGPath> component.
 */
using RNSVGPathShadowNode =
    RNSVGConcreteShadowNode<RNSVGPathComponentName, RNSVGPathProps>;

JSI_EXPORT extern const char RNSVGPatternComponentName[];

/*
 * `ShadowNode` for <RNSVGPattern> component.
 */
using RNSVGPatternShadowNode =
    RNSVGConcreteShadowNode<RNSVGPatternComponentName, RNSVGPatternProps>;

JSI_EXPORT extern const char RNSVGRadialGradientComponentName[];

/*
 * `ShadowNode` for <RNSVGRadialGradient> component.
 */
using RNSVGRadialGradientShadowNode = RNSVGConcreteShadowNode<
    RNSVGRadialGradientComponentName,
    RNSVGRadialGradientProps>;

JSI_EXPORT extern const char RNSVGRectComponentName[];

/*
 * `ShadowNode` for <RNSVGRect> component.
 */
using RNSVGRectShadowNode =
    RNSVGConcreteShadowNode<RNSVGRectComponentName, RNSVGRectProps>;

JSI_EXPORT extern const char RNSVGSymbolComponentName[];

/*
 * `ShadowNode` for <RNSVGSymbol> component.
 */
using RNSVGSymbolShadowNode =
    RNSVGConcreteShadowNode<RNSVGSymbolComponentName, RNSVGSymbolProps>;

JSI_EXPORT extern const char RNSVGTextComponentName[];

/*
 * `ShadowNode` for <RNSVGText> component.
 */
using RNSVGTextShadowNode =
    RNSVGConcreteShadowNode<RNSVGTextComponentName, RNSVGTextProps>;

JSI_EXPORT extern const char RNSVGTextPathComponentName[];

/*
 * `ShadowNode` for <RNSVGTextPath> component.
 */
using RNSVGTextPathShadowNode =
    RNSVGConcreteShadowNode<RNSVGTextPathComponentName, RNSVGTextPathProps>;

JSI_EXPORT extern const char RNSVGTSpanComponentName[];

/*
 * `ShadowNode` for <RNSVGTSpan> component.
 */
using RNSVGTSpanShadowNode =
    RNSVGConcreteShadowNode<RNSVGTSpanComponentName, RNSVGTSpanProps>;

JSI_EXPORT extern const char RNSVGUseComponentName[];

/*
 * `ShadowNode` for <RNSVGUse> component.
 */
using RNSVGUseShadowNode =
    RNSVGConcreteShadowNode<RNSVGUseComponentName, RNSVGUseProps>;

} // namespace facebook::react
