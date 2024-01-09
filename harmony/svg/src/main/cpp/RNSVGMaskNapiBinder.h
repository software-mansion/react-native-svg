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

#include "RNOHCorePackage/ComponentBinders/ViewComponentNapiBinder.h"
#include "RNOH/ArkJS.h"
#include "RNSVGMaskProps.h"

namespace rnoh {

class RNSVGMaskNapiBinder : public ViewComponentNapiBinder {
public:
    napi_value createProps(napi_env env, facebook::react::ShadowView const shadowView) override
    {
        napi_value napiViewProps = ViewComponentNapiBinder::createProps(env, shadowView);
        auto propsObjBuilder = ArkJS(env).getObjectBuilder(napiViewProps);
        if (auto props = std::dynamic_pointer_cast<const facebook::react::RNSVGMaskProps>(shadowView.props)) {
            propsObjBuilder.addProperty("name", props->name)
                .addProperty("opacity", props->opacity)
                .addProperty("mask", props->mask)
                .addProperty("markerStart", props->markerStart)
                .addProperty("markerMid", props->markerMid)
                .addProperty("markerEnd", props->markerEnd)
                .addProperty("clipPath", props->clipPath)
                .addProperty("clipRule", props->clipRule)
                .addProperty("responsible", props->responsible)
                .addProperty("display", props->display)
                .addProperty("pointerEvents", props->pointerEvents)
                .addProperty("fillOpacity", props->fillOpacity)
                .addProperty("fillRule", props->fillRule)
                .addProperty("strokeOpacity", props->strokeOpacity)
                .addProperty("strokeWidth", props->strokeWidth)
                .addProperty("strokeLinecap", props->strokeLinecap)
                .addProperty("strokeLinejoin", props->strokeLinejoin)
                .addProperty("strokeDashoffset", props->strokeDashoffset)
                .addProperty("strokeMiterlimit", props->strokeMiterlimit)
                .addProperty("vectorEffect", props->vectorEffect)
                .addProperty("fontSize", props->fontSize)
                .addProperty("fontWeight", props->fontWeight)
                .addProperty("x", props->x)
                .addProperty("y", props->y)
                .addProperty("height", props->height)
                .addProperty("width", props->width)
                .addProperty("maskUnits", props->maskUnits)
                .addProperty("maskContentUnits", props->maskContentUnits);

            auto matrix = std::vector<napi_value>();
            for (auto item : props->matrix) {
                matrix.push_back(ArkJS(env).createDouble(item));
            }
            propsObjBuilder.addProperty("matrix", ArkJS(env).createArray(matrix));

            auto fillRaw = props->fill;
            auto fillObjBuilder = ArkJS(env).createObjectBuilder();
            fillObjBuilder.addProperty("type", fillRaw.type)
                .addProperty("payload", fillRaw.payload)
                .addProperty("brushRef", fillRaw.brushRef);
            propsObjBuilder.addProperty("fill", fillObjBuilder.build());

            auto strokeRaw = props->stroke;
            auto strokeObjBuilder = ArkJS(env).createObjectBuilder();
            strokeObjBuilder.addProperty("type", strokeRaw.type)
                .addProperty("payload", strokeRaw.payload)
                .addProperty("brushRef", strokeRaw.brushRef);
            propsObjBuilder.addProperty("stroke", strokeObjBuilder.build());
            
            auto strokeDasharray = std::vector<napi_value>();
            auto strokeDasharrayRaw = props->strokeDasharray;

            for (auto item : strokeDasharrayRaw) {
                auto itemObjBuilder = ArkJS(env).createString(item);
                strokeDasharray.push_back(itemObjBuilder);
            }

            auto strokeDasharrayArray = ArkJS(env).createArray(strokeDasharray);

            propsObjBuilder.addProperty("strokeDasharray", strokeDasharrayArray);

            auto propList = std::vector<napi_value>();
            auto propListRaw = props->propList;

            for (auto item : propListRaw) {
                auto itemObjBuilder = ArkJS(env).createString(item);
                propList.push_back(itemObjBuilder);
            }

            auto propListArray = ArkJS(env).createArray(propList);

            propsObjBuilder.addProperty("propList", propListArray);

            auto fontRaw = props->font;
            auto fontObjBuilder = ArkJS(env).createObjectBuilder();
            fontObjBuilder.addProperty("fontStyle", fontRaw.fontStyle)
                .addProperty("fontVariant", fontRaw.fontVariant)
                .addProperty("fontWeight", fontRaw.fontWeight)
                .addProperty("fontStretch", fontRaw.fontStretch)
                .addProperty("fontSize", fontRaw.fontSize)
                .addProperty("fontFamily", fontRaw.fontFamily)
                .addProperty("textAnchor", fontRaw.textAnchor)
                .addProperty("textDecoration", fontRaw.textDecoration)
                .addProperty("letterSpacing", fontRaw.letterSpacing)
                .addProperty("wordSpacing", fontRaw.wordSpacing)
                .addProperty("kerning", fontRaw.kerning)
                .addProperty("fontFeatureSettings", fontRaw.fontFeatureSettings)
                .addProperty("fontVariantLigatures", fontRaw.fontVariantLigatures)
                .addProperty("fontVariationSettings", fontRaw.fontVariationSettings);
            propsObjBuilder.addProperty("font", fontObjBuilder.build());
            return propsObjBuilder.build();
        }
        return napiViewProps;
    };
};
} // namespace rnoh