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
#include "RNOH/Package.h"
#include <glog/logging.h>

#include "RNOH/ArkTSComponentInstance.h"
using namespace rnoh;
using namespace facebook;

class SVGComponentInstanceFactoryDelegate : public ComponentInstanceFactoryDelegate {
public:
    using ComponentInstanceFactoryDelegate::ComponentInstanceFactoryDelegate;

    ComponentInstance::Shared create(ComponentInstance::Context ctx) override {
        if (ctx.componentName == "RNSVGSvgView") {
            return std::make_shared<ArkTSComponentInstance>(ctx);
        } else if (ctx.componentName == "RNSVGGroup") {
            return std::make_shared<ArkTSComponentInstance>(ctx);
        } else if (ctx.componentName == "RNSVGPath") {
            return std::make_shared<ArkTSComponentInstance>(ctx);
        } else if (ctx.componentName == "RNSVGRect") {
            return std::make_shared<ArkTSComponentInstance>(ctx);
        } else if (ctx.componentName == "RNSVGImage") {
            return std::make_shared<ArkTSComponentInstance>(ctx);
        } else if (ctx.componentName == "RNSVGCircle") {
            return std::make_shared<ArkTSComponentInstance>(ctx);
        } else if (ctx.componentName == "RNSVGEllipse") {
            return std::make_shared<ArkTSComponentInstance>(ctx);
        } else if (ctx.componentName == "RNSVGLinearGradient") {
            return std::make_shared<ArkTSComponentInstance>(ctx);
        } else if (ctx.componentName == "RNSVGDefs") {
            return std::make_shared<ArkTSComponentInstance>(ctx);
        } else if (ctx.componentName == "RNSVGText") {
            return std::make_shared<ArkTSComponentInstance>(ctx);
        } else if (ctx.componentName == "RNSVGTSpan") {
            return std::make_shared<ArkTSComponentInstance>(ctx);
        } else if (ctx.componentName == "RNSVGClipPath") {
            return std::make_shared<ArkTSComponentInstance>(ctx);
        } else if (ctx.componentName == "RNSVGMask") {
            return std::make_shared<ArkTSComponentInstance>(ctx);
        } else if (ctx.componentName == "RNSVGUse") {
            return std::make_shared<ArkTSComponentInstance>(ctx);
        }
        return nullptr;
    }
};

namespace rnoh {

class SVGPackage : public Package {
public:
    explicit SVGPackage(Package::Context ctx) : Package(ctx) {}

    ComponentInstanceFactoryDelegate::Shared createComponentInstanceFactoryDelegate() override {
            return std::make_shared<SVGComponentInstanceFactoryDelegate>(m_ctx);
    }

    std::vector<facebook::react::ComponentDescriptorProvider> createComponentDescriptorProviders() override;
    
    ComponentNapiBinderByString createComponentNapiBinderByName() override;
    
    ComponentJSIBinderByString createComponentJSIBinderByName() override;
};
} // namespace rnoh