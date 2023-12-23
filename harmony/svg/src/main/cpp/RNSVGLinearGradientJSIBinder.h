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

#include "RNOHCorePackage/ComponentBinders/ViewComponentJSIBinder.h"

namespace rnoh {

class RNSVGLinearGradientJSIBinder : public ViewComponentJSIBinder {
    facebook::jsi::Object createNativeProps(facebook::jsi::Runtime &rt) override
    {
        auto object = ViewComponentJSIBinder::createNativeProps(rt);
        object.setProperty(rt, "name", "string");
        object.setProperty(rt, "opacity", "float");
        object.setProperty(rt, "matrix", "array");
        object.setProperty(rt, "mask", "float");
        object.setProperty(rt, "markerStart", "string");
        object.setProperty(rt, "markerMid", "string");
        object.setProperty(rt, "markerEnd", "string");
        object.setProperty(rt, "clipPath", "string");
        object.setProperty(rt, "clipRule", "int");
        object.setProperty(rt, "responsible", "boolean");
        object.setProperty(rt, "display", "string");
        object.setProperty(rt, "pointerEvents", "string");
        object.setProperty(rt, "x1", "string");
        object.setProperty(rt, "y1", "string");
        object.setProperty(rt, "x2", "string");
        object.setProperty(rt, "y2", "string");
        object.setProperty(rt, "gradient", "array");
        object.setProperty(rt, "gradientUnits", "int");
        object.setProperty(rt, "gradientTransform", "array");
        return object;
    }

    facebook::jsi::Object createBubblingEventTypes(facebook::jsi::Runtime &rt) override
    {
        return facebook::jsi::Object(rt);
    }
};
} // namespace rnoh