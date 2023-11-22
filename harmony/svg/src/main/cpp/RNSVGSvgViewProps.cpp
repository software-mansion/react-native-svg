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

#include <react/renderer/components/image/conversions.h>
#include <react/renderer/core/PropsParserContext.h>
#include <react/renderer/core/propsConversions.h>
#include "RNSVGSvgViewProps.h"

namespace facebook {
namespace react {

RNSVGSvgViewProps::RNSVGSvgViewProps(
    const PropsParserContext &context,
    const RNSVGSvgViewProps &sourceProps,
    const RawProps &rawProps): ViewProps(context, sourceProps, rawProps),

    bbWidth(convertRawProp(context, rawProps, "bbWidth", sourceProps.bbWidth, {})),
    bbHeight(convertRawProp(context, rawProps, "bbHeight", sourceProps.bbHeight, {})),
    minX(convertRawProp(context, rawProps, "minX", sourceProps.minX, {0.0})),
    minY(convertRawProp(context, rawProps, "minY", sourceProps.minY, {0.0})),
    vbWidth(convertRawProp(context, rawProps, "vbWidth", sourceProps.vbWidth, {0.0})),
    vbHeight(convertRawProp(context, rawProps, "vbHeight", sourceProps.vbHeight, {0.0})),
    align(convertRawProp(context, rawProps, "align", sourceProps.align, {})),
    meetOrSlice(convertRawProp(context, rawProps, "meetOrSlice", sourceProps.meetOrSlice, {0})),
    tintColor(convertRawProp(context, rawProps, "tintColor", sourceProps.tintColor, {})),
    color(convertRawProp(context, rawProps, "color", sourceProps.color, {})),
    pointerEvents(convertRawProp(context, rawProps, "pointerEvents", sourceProps.pointerEvents, {}))
      {}

} // namespace react
} // namespace facebook
