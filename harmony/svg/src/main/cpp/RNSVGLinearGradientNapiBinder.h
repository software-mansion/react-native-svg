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
#include "RNSVGLinearGradientProps.h"

namespace rnoh {

class RNSVGLinearGradientNapiBinder : public ViewComponentNapiBinder {
public:
    napi_value createProps(napi_env env, facebook::react::ShadowView const shadowView) override
    {
        napi_value napiViewProps = ViewComponentNapiBinder::createProps(env, shadowView);
        auto propsObjBuilder = ArkJS(env).getObjectBuilder(napiViewProps);
        if (auto props = std::dynamic_pointer_cast<const facebook::react::RNSVGLinearGradientProps>(shadowView.props)) {
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
                .addProperty("x1", props->x1)
                .addProperty("y1", props->y1)
                .addProperty("x2", props->x2)
                .addProperty("y2", props->y2)
                .addProperty("gradientUnits", props->gradientUnits);

            auto matrix = std::vector<napi_value>();
            for (auto item : props->matrix) {
                matrix.push_back(ArkJS(env).createDouble(item));
            }
            propsObjBuilder.addProperty("matrix", ArkJS(env).createArray(matrix));
            
            return propsObjBuilder.build();
        }
        return napiViewProps;
    };
};
} // namespace rnoh