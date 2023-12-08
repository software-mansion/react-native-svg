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

#include <react/renderer/components/image/conversions.h>
#include <react/renderer/core/PropsParserContext.h>
#include <react/renderer/core/propsConversions.h>
#include "RNSVGLinearGradientProps.h"

namespace facebook {
namespace react {

RNSVGLinearGradientProps::RNSVGLinearGradientProps(
    const PropsParserContext &context,
    const RNSVGLinearGradientProps &sourceProps,
    const RawProps &rawProps): ViewProps(context, sourceProps, rawProps),

    name(convertRawProp(context, rawProps, "name", sourceProps.name, {})),
    opacity(convertRawProp(context, rawProps, "opacity", sourceProps.opacity, {1.0})),
    matrix(convertRawProp(context, rawProps, "matrix", sourceProps.matrix, {})),
    mask(convertRawProp(context, rawProps, "mask", sourceProps.mask, {})),
    markerStart(convertRawProp(context, rawProps, "markerStart", sourceProps.markerStart, {})),
    markerMid(convertRawProp(context, rawProps, "markerMid", sourceProps.markerMid, {})),
    markerEnd(convertRawProp(context, rawProps, "markerEnd", sourceProps.markerEnd, {})),
    clipPath(convertRawProp(context, rawProps, "clipPath", sourceProps.clipPath, {})),
    clipRule(convertRawProp(context, rawProps, "clipRule", sourceProps.clipRule, {0})),
    responsible(convertRawProp(context, rawProps, "responsible", sourceProps.responsible, {false})),
    display(convertRawProp(context, rawProps, "display", sourceProps.display, {})),
    pointerEvents(convertRawProp(context, rawProps, "pointerEvents", sourceProps.pointerEvents, {})),
    x1(convertRawProp(context, rawProps, "x1", sourceProps.x1, {})),
    y1(convertRawProp(context, rawProps, "y1", sourceProps.y1, {})),
    x2(convertRawProp(context, rawProps, "x2", sourceProps.x2, {})),
    y2(convertRawProp(context, rawProps, "y2", sourceProps.y2, {})),
    gradient(convertRawProp(context, rawProps, "gradient", sourceProps.gradient, {})),
    gradientUnits(convertRawProp(context, rawProps, "gradientUnits", sourceProps.gradientUnits, {0})),
    gradientTransform(convertRawProp(context, rawProps, "gradientTransform", sourceProps.gradientTransform, {}))
    {}
} // namespace react
} // namespace facebook
