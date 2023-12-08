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

#include <jsi/jsi.h>
#include <react/renderer/components/view/ViewProps.h>
#include <react/renderer/core/PropsParserContext.h>
#include <react/renderer/core/propsConversions.h>
#include <react/renderer/graphics/Color.h>
#include <react/renderer/imagemanager/primitives.h>
#include <vector>

namespace facebook {
namespace react {

struct RNSVGClipPathFillStruct {
    int type;
    SharedColor payload;
    std::string brushRef;
};

struct RNSVGClipPathStrokeStruct {
    int type;
    SharedColor payload;
    std::string brushRef;
};

struct RNSVGClipPathFontStruct {
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

class JSI_EXPORT RNSVGClipPathProps final : public ViewProps {
 public:
  RNSVGClipPathProps() = default;
  RNSVGClipPathProps(const PropsParserContext& context, const RNSVGClipPathProps &sourceProps,
                    const RawProps &rawProps);

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
    RNSVGClipPathFillStruct fill{};
    Float fillOpacity{1.0};
    int fillRule{1};
    RNSVGClipPathStrokeStruct stroke{};
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
    RNSVGClipPathFontStruct font{};
};

} // namespace react
} // namespace facebook