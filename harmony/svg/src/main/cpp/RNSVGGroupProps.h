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

#include <jsi/jsi.h>
#include <react/renderer/components/view/ViewProps.h>
#include <react/renderer/core/PropsParserContext.h>
#include <react/renderer/core/propsConversions.h>
#include <react/renderer/graphics/Color.h>
#include <react/renderer/imagemanager/primitives.h>
#include <vector>

namespace facebook {
namespace react {

static inline std::string vectorStringToString(const std::vector<std::string> &value) {
    std::string result = "";
    for (int i = 0; i < value.size(); i++) {
        result = result + value[i];
        if (i != value.size() - 1) {
            result = result + "*";
        }
    }
    return result;
}

static inline std::string vectorFloatToString(const std::vector<facebook::react::Float> &value) {
    std::string result;
    for (int i = 0; i < value.size(); i++) {
        result = result + std::to_string(value[i]);
        if (i != value.size() - 1) {
            result = result + ",";
        }
    }
    return result;
}

struct RNSVGGroupFillStruct {
    int type;
    SharedColor payload;
    std::string brushRef;
};

static inline void fromRawValue(const PropsParserContext &context, const RawValue &value,
                                RNSVGGroupFillStruct &result) {
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

static inline std::string toString(const RNSVGGroupFillStruct &value) { return "[Object RNSVGGroupFillStruct]"; }

struct RNSVGGroupStrokeStruct {
    int type;
    SharedColor payload;
    std::string brushRef;
};

static inline void fromRawValue(const PropsParserContext &context, const RawValue &value,
                                RNSVGGroupStrokeStruct &result) {
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

static inline std::string toString(const RNSVGGroupStrokeStruct &value) { return "[Object RNSVGGroupStrokeStruct]"; }

struct RNSVGGroupFontStruct {
    std::string fontStyle;
    std::string fontVariant;
    std::string fontWeight;
    std::string fontStretch;
    std::string fontSize;
    std::string fontFamily;
    std::string textAnchor;
    std::string textDecoration;
    std::string letterSpacing;
    std::string wordSpacing;
    std::string kerning;
    std::string fontFeatureSettings;
    std::string fontVariantLigatures;
    std::string fontVariationSettings;
};

static inline void fromRawValue(const PropsParserContext &context, const RawValue &value,
                                RNSVGGroupFontStruct &result) {
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

static inline std::string toString(const RNSVGGroupFontStruct &value) { return "[Object RNSVGGroupFontStruct]"; }

class JSI_EXPORT RNSVGGroupProps final : public ViewProps {
public:
    RNSVGGroupProps() = default;
    RNSVGGroupProps(const PropsParserContext &context, const RNSVGGroupProps &sourceProps, const RawProps &rawProps);

#pragma mark - Props

    std::string name{};
    Float opacity{1.0};
    std::vector<Float> matrix{};
    std::string mask{};
    std::string markerStart{};
    std::string markerMid{};
    std::string markerEnd{};
    std::string clipPath{};
    int clipRule{0};
    bool responsible{false};
    std::string display{};
    std::string pointerEvents{};
    RNSVGGroupFillStruct fill{};
    Float fillOpacity{1.0};
    int fillRule{1};
    RNSVGGroupStrokeStruct stroke{};
    Float strokeOpacity{1.0};
    std::string strokeWidth{"1"};
    int strokeLinecap{0};
    int strokeLinejoin{0};
    std::vector<std::string> strokeDasharray{};
    Float strokeDashoffset{0.0};
    Float strokeMiterlimit{0.0};
    int vectorEffect{0};
    std::vector<std::string> propList{};
    std::string fontSize{};
    std::string fontWeight{};
    RNSVGGroupFontStruct font{};
};

} // namespace react
} // namespace facebook