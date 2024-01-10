/**
 * MIT License
 *
 * Copyright (C) 2023 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

#pragma once

#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "Props.h"

namespace facebook {
namespace react {

extern const char RN_SVG_SVG_VIEW_COMPONENT_NAME[] = "RNSVGSvgView";
extern const char RN_SVG_GROUP_COMPONENT_NAME[] = "RNSVGGroup";
extern const char RN_SVG_PATH_COMPONENT_NAME[] = "RNSVGPath";
extern const char RN_SVG_RECT_COMPONENT_NAME[] = "RNSVGRect";
extern const char RN_SVG_IMAGE_COMPONENT_NAME[] = "RNSVGImage";
extern const char RN_SVG_CIRCLE_COMPONENT_NAME[] = "RNSVGCircle";
extern const char RN_SVG_ELLIPSE_COMPONENT_NAME[] = "RNSVGEllipse";
extern const char RN_SVG_LINEAR_GRADIENT_COMPONENT_NAME[] = "RNSVGLinearGradient";
extern const char RN_SVG_DEFS_COMPONENT_NAME[] = "RNSVGDefs";
extern const char RN_SVG_TEXT_COMPONENT_NAME[] = "RNSVGText";
extern const char RN_SVG_T_SPAN_COMPONENT_NAME[] = "RNSVGTSpan";
extern const char RN_SVG_CLIP_PATH_COMPONENT_NAME[] = "RNSVGClipPath";
extern const char RN_SVG_MASK_COMPONENT_NAME[] = "RNSVGMask";
extern const char RN_SVG_USE_COMPONENT_NAME[] = "RNSVGUse";

using RNSVGSvgViewShadowNode = ConcreteViewShadowNode<RN_SVG_SVG_VIEW_COMPONENT_NAME, RNSVGSvgViewProps>;

using RNSVGGroupShadowNode = ConcreteViewShadowNode<RN_SVG_GROUP_COMPONENT_NAME, RNSVGGroupProps>;

using RNSVGPathShadowNode = ConcreteViewShadowNode<RN_SVG_PATH_COMPONENT_NAME, RNSVGPathProps>;

using RNSVGRectShadowNode = ConcreteViewShadowNode<RN_SVG_RECT_COMPONENT_NAME, RNSVGRectProps>;

using RNSVGImageShadowNode = ConcreteViewShadowNode<RN_SVG_IMAGE_COMPONENT_NAME, RNSVGImageProps>;

using RNSVGCircleShadowNode = ConcreteViewShadowNode<RN_SVG_CIRCLE_COMPONENT_NAME, RNSVGCircleProps>;

using RNSVGEllipseShadowNode = ConcreteViewShadowNode<RN_SVG_ELLIPSE_COMPONENT_NAME, RNSVGEllipseProps>;

using RNSVGLinearGradientShadowNode = ConcreteViewShadowNode<RN_SVG_LINEAR_GRADIENT_COMPONENT_NAME, RNSVGLinearGradientProps>;

using RNSVGDefsShadowNode = ConcreteViewShadowNode<RN_SVG_DEFS_COMPONENT_NAME, RNSVGDefsProps>;

using RNSVGTextShadowNode = ConcreteViewShadowNode<RN_SVG_TEXT_COMPONENT_NAME, RNSVGTextProps>;

using RNSVGTSpanShadowNode = ConcreteViewShadowNode<RN_SVG_T_SPAN_COMPONENT_NAME, RNSVGTSpanProps>;

using RNSVGClipPathShadowNode = ConcreteViewShadowNode<RN_SVG_CLIP_PATH_COMPONENT_NAME, RNSVGClipPathProps>;

using RNSVGMaskShadowNode = ConcreteViewShadowNode<RN_SVG_MASK_COMPONENT_NAME, RNSVGMaskProps>;

using RNSVGUseShadowNode = ConcreteViewShadowNode<RN_SVG_USE_COMPONENT_NAME, RNSVGUseProps>;

using RNSVGGroupComponentDescriptor = ConcreteComponentDescriptor<RNSVGGroupShadowNode>;
using RNSVGSvgViewComponentDescriptor = ConcreteComponentDescriptor<RNSVGSvgViewShadowNode>;
using RNSVGPathComponentDescriptor = ConcreteComponentDescriptor<RNSVGPathShadowNode>;
using RNSVGRectComponentDescriptor = ConcreteComponentDescriptor<RNSVGRectShadowNode>;
using RNSVGImageComponentDescriptor = ConcreteComponentDescriptor<RNSVGImageShadowNode>;
using RNSVGCircleComponentDescriptor = ConcreteComponentDescriptor<RNSVGCircleShadowNode>;
using RNSVGEllipseComponentDescriptor = ConcreteComponentDescriptor<RNSVGEllipseShadowNode>;
using RNSVGLinearGradientComponentDescriptor = ConcreteComponentDescriptor<RNSVGLinearGradientShadowNode>;
using RNSVGDefsComponentDescriptor = ConcreteComponentDescriptor<RNSVGDefsShadowNode>;
using RNSVGTextComponentDescriptor = ConcreteComponentDescriptor<RNSVGTextShadowNode>;
using RNSVGTSpanComponentDescriptor = ConcreteComponentDescriptor<RNSVGTSpanShadowNode>;
using RNSVGClipPathComponentDescriptor = ConcreteComponentDescriptor<RNSVGClipPathShadowNode>;
using RNSVGMaskComponentDescriptor = ConcreteComponentDescriptor<RNSVGMaskShadowNode>;
using RNSVGUseComponentDescriptor = ConcreteComponentDescriptor<RNSVGUseShadowNode>;

} // namespace react
} // namespace facebook