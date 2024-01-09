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
#include "RNSVGMaskProps.h"

namespace facebook {
namespace react {

static inline void fromRawValue(const PropsParserContext& context, const RawValue &value, RNSVGMaskFillStruct &result)
{
    auto map = (butter::map<std::string, RawValue>)value;
    
    auto tmp_type = map.find("type");
    if (tmp_type != map.end()) {
        fromRawValue(context, tmp_type->second, result.type);
    }
    auto tmp_payload = map.find("payload");
    if (tmp_payload != map.end()) {
        fromRawValue(context, tmp_payload->second, result.payload);
    }
    auto tmp_brushRef = map.find("brushRef");
    if (tmp_brushRef != map.end()) {
        fromRawValue(context, tmp_brushRef->second, result.brushRef);
    }
}

static inline std::string toString(const RNSVGMaskFillStruct &value)
{
    return "[Object RNSVGMaskFillStruct]";
}

static inline void fromRawValue(const PropsParserContext& context, const RawValue &value, RNSVGMaskStrokeStruct &result)
{
    auto map = (butter::map<std::string, RawValue>)value;
    
    auto tmp_type = map.find("type");
    if (tmp_type != map.end()) {
        fromRawValue(context, tmp_type->second, result.type);
    }
    auto tmp_payload = map.find("payload");
    if (tmp_payload != map.end()) {
        fromRawValue(context, tmp_payload->second, result.payload);
    }
    auto tmp_brushRef = map.find("brushRef");
    if (tmp_brushRef != map.end()) {
        fromRawValue(context, tmp_brushRef->second, result.brushRef);
    }
}

static inline std::string toString(const RNSVGMaskStrokeStruct &value)
{
    return "[Object RNSVGMaskStrokeStruct]";
}

static inline void fromRawValue(const PropsParserContext& context, const RawValue &value, RNSVGMaskFontStruct &result)
{
    auto map = (butter::map<std::string, RawValue>)value;
    
    auto tmp_fontStyle = map.find("fontStyle");
    if (tmp_fontStyle != map.end()) {
        fromRawValue(context, tmp_fontStyle->second, result.fontStyle);
    }
    auto tmp_fontVariant = map.find("fontVariant");
    if (tmp_fontVariant != map.end()) {
        fromRawValue(context, tmp_fontVariant->second, result.fontVariant);
    }
    auto tmp_fontWeight = map.find("fontWeight");
    if (tmp_fontWeight != map.end()) {
        fromRawValue(context, tmp_fontWeight->second, result.fontWeight);
    }
    auto tmp_fontStretch = map.find("fontStretch");
    if (tmp_fontStretch != map.end()) {
        fromRawValue(context, tmp_fontStretch->second, result.fontStretch);
    }
    auto tmp_fontSize = map.find("fontSize");
    if (tmp_fontSize != map.end()) {
        fromRawValue(context, tmp_fontSize->second, result.fontSize);
    }
    auto tmp_fontFamily = map.find("fontFamily");
    if (tmp_fontFamily != map.end()) {
        fromRawValue(context, tmp_fontFamily->second, result.fontFamily);
    }
    auto tmp_textAnchor = map.find("textAnchor");
    if (tmp_textAnchor != map.end()) {
        fromRawValue(context, tmp_textAnchor->second, result.textAnchor);
    }
    auto tmp_textDecoration = map.find("textDecoration");
    if (tmp_textDecoration != map.end()) {
        fromRawValue(context, tmp_textDecoration->second, result.textDecoration);
    }
    auto tmp_letterSpacing = map.find("letterSpacing");
    if (tmp_letterSpacing != map.end()) {
        fromRawValue(context, tmp_letterSpacing->second, result.letterSpacing);
    }
    auto tmp_wordSpacing = map.find("wordSpacing");
    if (tmp_wordSpacing != map.end()) {
        fromRawValue(context, tmp_wordSpacing->second, result.wordSpacing);
    }
    auto tmp_kerning = map.find("kerning");
    if (tmp_kerning != map.end()) {
        fromRawValue(context, tmp_kerning->second, result.kerning);
    }
    auto tmp_fontFeatureSettings = map.find("fontFeatureSettings");
    if (tmp_fontFeatureSettings != map.end()) {
        fromRawValue(context, tmp_fontFeatureSettings->second, result.fontFeatureSettings);
    }
    auto tmp_fontVariantLigatures = map.find("fontVariantLigatures");
    if (tmp_fontVariantLigatures != map.end()) {
        fromRawValue(context, tmp_fontVariantLigatures->second, result.fontVariantLigatures);
    }
    auto tmp_fontVariationSettings = map.find("fontVariationSettings");
    if (tmp_fontVariationSettings != map.end()) {
        fromRawValue(context, tmp_fontVariationSettings->second, result.fontVariationSettings);
    }
}

static inline std::string toString(const RNSVGMaskFontStruct &value)
{
    return "[Object RNSVGMaskFontStruct]";
}

RNSVGMaskProps::RNSVGMaskProps(
    const PropsParserContext &context,
    const RNSVGMaskProps &sourceProps,
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
    fill(convertRawProp(context, rawProps, "fill", sourceProps.fill, {})),
    fillOpacity(convertRawProp(context, rawProps, "fillOpacity", sourceProps.fillOpacity, {1.0})),
    fillRule(convertRawProp(context, rawProps, "fillRule", sourceProps.fillRule, {1})),
    stroke(convertRawProp(context, rawProps, "stroke", sourceProps.stroke, {})),
    strokeOpacity(convertRawProp(context, rawProps, "strokeOpacity", sourceProps.strokeOpacity, {1.0})),
    strokeWidth(convertRawProp(context, rawProps, "strokeWidth", sourceProps.strokeWidth, {"1"})),
    strokeLinecap(convertRawProp(context, rawProps, "strokeLinecap", sourceProps.strokeLinecap, {0})),
    strokeLinejoin(convertRawProp(context, rawProps, "strokeLinejoin", sourceProps.strokeLinejoin, {0})),
    strokeDasharray(convertRawProp(context, rawProps, "strokeDasharray", sourceProps.strokeDasharray, {})),
    strokeDashoffset(convertRawProp(context, rawProps, "strokeDashoffset", sourceProps.strokeDashoffset, {0.0})),
    strokeMiterlimit(convertRawProp(context, rawProps, "strokeMiterlimit", sourceProps.strokeMiterlimit, {0.0})),
    vectorEffect(convertRawProp(context, rawProps, "vectorEffect", sourceProps.vectorEffect, {0})),
    propList(convertRawProp(context, rawProps, "propList", sourceProps.propList, {})),
    fontSize(convertRawProp(context, rawProps, "fontSize", sourceProps.fontSize, {})),
    fontWeight(convertRawProp(context, rawProps, "fontWeight", sourceProps.fontWeight, {})),
    font(convertRawProp(context, rawProps, "font", sourceProps.font, {})),
    x(convertRawProp(context, rawProps, "x", sourceProps.x, {})),
    y(convertRawProp(context, rawProps, "y", sourceProps.y, {})),
    height(convertRawProp(context, rawProps, "height", sourceProps.height, {})),
    width(convertRawProp(context, rawProps, "width", sourceProps.width, {})),
    maskUnits(convertRawProp(context, rawProps, "maskUnits", sourceProps.maskUnits, {0})),
    maskContentUnits(convertRawProp(context, rawProps, "maskContentUnits", sourceProps.maskContentUnits, {0}))
    {}

} // namespace react
} // namespace facebook
