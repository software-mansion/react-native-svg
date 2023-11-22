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

struct RNSVGRectFillStruct {
    int type;
    SharedColor payload;
    std::string brushRef;
};

static inline void fromRawValue(const PropsParserContext &context, const RawValue &value, RNSVGRectFillStruct &result) {
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

static inline std::string toString(const RNSVGRectFillStruct &value) { return "[Object RNSVGRectFillStruct]"; }

struct RNSVGRectStrokeStruct {
    int type;
    SharedColor payload;
    std::string brushRef;
};

static inline void fromRawValue(const PropsParserContext &context, const RawValue &value,
                                RNSVGRectStrokeStruct &result) {
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

static inline std::string toString(const RNSVGRectStrokeStruct &value) { return "[Object RNSVGRectStrokeStruct]"; }

class JSI_EXPORT RNSVGRectProps final : public ViewProps {
public:
    RNSVGRectProps() = default;
    RNSVGRectProps(const PropsParserContext &context, const RNSVGRectProps &sourceProps, const RawProps &rawProps);

#pragma mark - Props

    std::string name{};
    Float opacity{1.0};
    std::vector<facebook::react::Float> matrix{};
    std::string mask{};
    std::string markerStart{};
    std::string markerMid{};
    std::string markerEnd{};
    std::string clipPath{};
    int clipRule{0};
    bool responsible{false};
    std::string display{};
    std::string pointerEvents{};
    RNSVGRectFillStruct fill{};
    Float fillOpacity{1.0};
    int fillRule{1};
    RNSVGRectStrokeStruct stroke{};
    Float strokeOpacity{1.0};
    std::string strokeWidth{"1"};
    int strokeLinecap{0};
    int strokeLinejoin{0};
    std::vector<std::string> strokeDasharray{};
    Float strokeDashoffset{0.0};
    Float strokeMiterlimit{0.0};
    int vectorEffect{0};
    std::vector<std::string> propList{};
    std::string x{0};
    std::string y{0};
    std::string height{0};
    std::string width{0};
    std::string rx{0};
    std::string ry{0};
};

} // namespace react
} // namespace facebook