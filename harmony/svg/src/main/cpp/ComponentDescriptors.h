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
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANT KIND, EXPRESS OR
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

extern const char RNSVGGroupComponentName[] = "RNSVGGroup";
extern const char RNSVGSvgViewComponentName[] = "RNSVGSvgView";
extern const char RNSVGPathComponentName[] = "RNSVGPath";
extern const char RNSVGRectComponentName[] = "RNSVGRect";
extern const char RNSVGImageComponentName[] = "RNSVGImage";
extern const char RNSVGLinearGradientComponentName[] = "RNSVGLinearGradient";
extern const char RNSVGDefsComponentName[] = "RNSVGDefs";
extern const char RNSVGTextComponentName[] = "RNSVGText";
extern const char RNSVGTSpanComponentName[] = "RNSVGTSpan";
extern const char RNSVGClipPathComponentName[] = "RNSVGClipPath";

using RNSVGGroupShadowNode =
    ConcreteViewShadowNode<RNSVGGroupComponentName, RNSVGGroupProps>;

using RNSVGSvgViewShadowNode =
    ConcreteViewShadowNode<RNSVGSvgViewComponentName, RNSVGSvgViewProps>;

using RNSVGPathShadowNode =
    ConcreteViewShadowNode<RNSVGPathComponentName, RNSVGPathProps>;

using RNSVGRectShadowNode =
    ConcreteViewShadowNode<RNSVGRectComponentName, RNSVGRectProps>;

using RNSVGImageShadowNode =
    ConcreteViewShadowNode<RNSVGImageComponentName, RNSVGImageProps>;

using RNSVGLinearGradientShadowNode =
    ConcreteViewShadowNode<RNSVGLinearGradientComponentName, RNSVGLinearGradientProps>;

using RNSVGDefsShadowNode =
    ConcreteViewShadowNode<RNSVGDefsComponentName, RNSVGDefsProps>;

using RNSVGTextShadowNode =
    ConcreteViewShadowNode<RNSVGTextComponentName, RNSVGTextProps>;

using RNSVGTSpanShadowNode = ConcreteViewShadowNode<RNSVGTSpanComponentName, RNSVGTSpanProps>;

using RNSVGClipPathShadowNode = ConcreteViewShadowNode<RNSVGClipPathComponentName, RNSVGClipPathProps>;

using RNSVGGroupComponentDescriptor = ConcreteComponentDescriptor<RNSVGGroupShadowNode>;
using RNSVGSvgViewComponentDescriptor = ConcreteComponentDescriptor<RNSVGSvgViewShadowNode>;
using RNSVGPathComponentDescriptor = ConcreteComponentDescriptor<RNSVGPathShadowNode>;
using RNSVGRectComponentDescriptor = ConcreteComponentDescriptor<RNSVGRectShadowNode>;
using RNSVGImageComponentDescriptor = ConcreteComponentDescriptor<RNSVGImageShadowNode>;
using RNSVGLinearGradientComponentDescriptor = ConcreteComponentDescriptor<RNSVGLinearGradientShadowNode>;
using RNSVGDefsComponentDescriptor = ConcreteComponentDescriptor<RNSVGDefsShadowNode>;
using RNSVGTextComponentDescriptor = ConcreteComponentDescriptor<RNSVGTextShadowNode>;
using RNSVGTSpanComponentDescriptor = ConcreteComponentDescriptor<RNSVGTSpanShadowNode>;
using RNSVGClipPathComponentDescriptor = ConcreteComponentDescriptor<RNSVGClipPathShadowNode>;

} // namespace react
} // namespace facebook