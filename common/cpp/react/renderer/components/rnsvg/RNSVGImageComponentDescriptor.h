/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include <react/renderer/imagemanager/ImageManager.h>
#include <react/utils/ContextContainer.h>

#include "RNSVGImageShadowNode.h"

namespace facebook {
namespace react {

/*
 * Descriptor for <RNSVGImage> component.
 */
class RNSVGImageComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSVGImageShadowNode> {
 public:
  RNSVGImageComponentDescriptor(ComponentDescriptorParameters const &parameters)
      : ConcreteComponentDescriptor(parameters),
        imageManager_(std::make_shared<ImageManager>(contextContainer_)){};

  void adopt(ShadowNode::Unshared const &shadowNode) const override {
    ConcreteComponentDescriptor::adopt(shadowNode);

    auto imageShadowNode =
        std::static_pointer_cast<RNSVGImageShadowNode>(shadowNode);

    // `RNSVGImageShadowNode` uses `ImageManager` to initiate image loading and
    // communicate the loading state and results to mounting layer.
    imageShadowNode->setImageManager(imageManager_);
  }

 private:
  const SharedImageManager imageManager_;
};

} // namespace react
} // namespace facebook
