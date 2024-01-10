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

#include <glog/logging.h>
#include "ComponentDescriptors.h"
#include "RNSVGGroupNapiBinder.h"
#include "RNSVGSvgViewNapiBinder.h"
#include "RNSVGPathNapiBinder.h"
#include "RNSVGRectNapiBinder.h"
#include "RNSVGImageNapiBinder.h"
#include "RNSVGCircleNapiBinder.h"
#include "RNSVGEllipseNapiBinder.h"
#include "RNSVGLinearGradientNapiBinder.h"
#include "RNSVGDefsNapiBinder.h"
#include "RNSVGTextNapiBinder.h"
#include "RNSVGTSpanNapiBinder.h"
#include "RNSVGClipPathNapiBinder.h"
#include "RNSVGMaskNapiBinder.h"
#include "RNSVGUseNapiBinder.h"

#include "RNSVGGroupJSIBinder.h"
#include "RNSVGSvgViewJSIBinder.h"
#include "RNSVGPathJSIBinder.h"
#include "RNSVGRectJSIBinder.h"
#include "RNSVGImageJSIBinder.h"
#include "RNSVGCircleJSIBinder.h"
#include "RNSVGEllipseJSIBinder.h"
#include "RNSVGLinearGradientJSIBinder.h"
#include "RNSVGDefsJSIBinder.h"
#include "RNSVGTextJSIBinder.h"
#include "RNSVGTSpanJSIBinder.h"
#include "RNSVGClipPathJSIBinder.h"
#include "RNSVGMaskJSIBinder.h"
#include "RNSVGUseJSIBinder.h"

#include "SVGPackage.h"

using namespace rnoh;
using namespace facebook;

std::vector<react::ComponentDescriptorProvider> SVGPackage::createComponentDescriptorProviders()
{
    return {react::concreteComponentDescriptorProvider<react::RNSVGSvgViewComponentDescriptor>(),
            react::concreteComponentDescriptorProvider<react::RNSVGGroupComponentDescriptor>(),
            react::concreteComponentDescriptorProvider<react::RNSVGPathComponentDescriptor>(),
            react::concreteComponentDescriptorProvider<react::RNSVGRectComponentDescriptor>(),
            react::concreteComponentDescriptorProvider<react::RNSVGImageComponentDescriptor>(),
            react::concreteComponentDescriptorProvider<react::RNSVGCircleComponentDescriptor>(),
            react::concreteComponentDescriptorProvider<react::RNSVGEllipseComponentDescriptor>(),
            react::concreteComponentDescriptorProvider<react::RNSVGLinearGradientComponentDescriptor>(),
            react::concreteComponentDescriptorProvider<react::RNSVGDefsComponentDescriptor>(),
            react::concreteComponentDescriptorProvider<react::RNSVGTextComponentDescriptor>(),
            react::concreteComponentDescriptorProvider<react::RNSVGTSpanComponentDescriptor>(),
            react::concreteComponentDescriptorProvider<react::RNSVGClipPathComponentDescriptor>(),
            react::concreteComponentDescriptorProvider<react::RNSVGMaskComponentDescriptor>(),
            react::concreteComponentDescriptorProvider<react::RNSVGUseComponentDescriptor>()};
}

ComponentNapiBinderByString rnoh::SVGPackage::createComponentNapiBinderByName()
{
    return {{"RNSVGSvgView", std::make_shared<RNSVGSvgViewNapiBinder>()},
            {"RNSVGGroup", std::make_shared<RNSVGGroupNapiBinder>()},
            {"RNSVGPath", std::make_shared<RNSVGPathNapiBinder>()},
            {"RNSVGRect", std::make_shared<RNSVGRectNapiBinder>()},
            {"RNSVGImage", std::make_shared<RNSVGImageNapiBinder>()},
            {"RNSVGCircle", std::make_shared<RNSVGCircleNapiBinder>()},
            {"RNSVGEllipse", std::make_shared<RNSVGEllipseNapiBinder>()},
            {"RNSVGLinearGradient", std::make_shared<RNSVGLinearGradientNapiBinder>()},
            {"RNSVGDefs", std::make_shared<RNSVGDefsNapiBinder>()},
            {"RNSVGText", std::make_shared<RNSVGTextNapiBinder>()},
            {"RNSVGTSpan", std::make_shared<RNSVGTSpanNapiBinder>()},
            {"RNSVGClipPath", std::make_shared<RNSVGClipPathNapiBinder>()},
            {"RNSVGMask", std::make_shared<RNSVGMaskNapiBinder>()},
            {"RNSVGUse", std::make_shared<RNSVGUseNapiBinder>()}};
}

ComponentJSIBinderByString rnoh::SVGPackage::createComponentJSIBinderByName()
{
    return {{"RNSVGSvgView", std::make_shared<RNSVGSvgViewJSIBinder>()},
            {"RNSVGGroup", std::make_shared<RNSVGGroupJSIBinder>()},
            {"RNSVGPath", std::make_shared<RNSVGPathJSIBinder>()},
            {"RNSVGRect", std::make_shared<RNSVGRectJSIBinder>()},
            {"RNSVGImage", std::make_shared<RNSVGImageJSIBinder>()},
            {"RNSVGCircle", std::make_shared<RNSVGCircleJSIBinder>()},
            {"RNSVGEllipse", std::make_shared<RNSVGEllipseJSIBinder>()},
            {"RNSVGLinearGradient", std::make_shared<RNSVGLinearGradientJSIBinder>()},
            {"RNSVGDefs", std::make_shared<RNSVGDefsJSIBinder>()},
            {"RNSVGText", std::make_shared<RNSVGTextJSIBinder>()},
            {"RNSVGTSpan", std::make_shared<RNSVGTSpanJSIBinder>()},
            {"RNSVGClipPath", std::make_shared<RNSVGClipPathJSIBinder>()},
            {"RNSVGMask", std::make_shared<RNSVGMaskJSIBinder>()},
            {"RNSVGUse", std::make_shared<RNSVGUseJSIBinder>()}};
};