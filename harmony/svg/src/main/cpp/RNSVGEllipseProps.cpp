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
#include "RNSVGEllipseProps.h"

namespace facebook {
    namespace react {

        static inline void fromRawValue(const PropsParserContext &context, const RawValue &value,
                                RNSVGEllipseFillStruct &result) {
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

        static inline std::string toString(const RNSVGEllipseFillStruct &value) {
            return "[Object RNSVGEllipseFillStruct]";
        }

        static inline void fromRawValue(const PropsParserContext &context, const RawValue &value,
                                        RNSVGEllipseStrokeStruct &result) {
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

        static inline std::string toString(const RNSVGEllipseStrokeStruct &value) {
            return "[Object RNSVGEllipseStrokeStruct]";
        }

        RNSVGEllipseProps::RNSVGEllipseProps(const PropsParserContext &context, const RNSVGEllipseProps &sourceProps,
                                           const RawProps &rawProps)
            : ViewProps(context, sourceProps, rawProps),
        
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
              cx(convertRawProp(context, rawProps, "cx", sourceProps.cx, {})),
              cy(convertRawProp(context, rawProps, "cy", sourceProps.cy, {})),
              rx(convertRawProp(context, rawProps, "rx", sourceProps.rx, {})),
              ry(convertRawProp(context, rawProps, "ry", sourceProps.ry, {}))
              {}
    
    } // namespace react
} // namespace facebook
