/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <cstdlib>
#include <limits>

#include <react/renderer/core/LayoutContext.h>

#include "RNSVGImageShadowNode.h"

namespace facebook {
namespace react {

const char RNSVGImageComponentName[] = "RNSVGImage";

void RNSVGImageShadowNode::setImageManager(
    const SharedImageManager &imageManager) {
  ensureUnsealed();
  imageManager_ = imageManager;
}

ImageSource RNSVGImageShadowNode::getImageSource() const {
  auto source = getConcreteProps().src;

  auto layoutMetrics = getLayoutMetrics();
  auto size = layoutMetrics.getContentFrame().size;
  auto scale = layoutMetrics.pointScaleFactor;
  source.size = size;
  source.scale = scale;
  return source;
}

void RNSVGImageShadowNode::updateStateIfNeeded() {
  ensureUnsealed();

  auto imageSource = getImageSource();
  auto const &currentState = getStateData();
  bool hasSameImageSource = currentState.getImageSource() == imageSource;

  if (hasSameImageSource) {
    return;
  }

  auto state = RNSVGImageState{
      imageSource,
      imageManager_->requestImage(imageSource, getSurfaceId()),
  };
  setStateData(std::move(state));
}

#pragma mark - LayoutableShadowNode

void RNSVGImageShadowNode::layout(LayoutContext layoutContext) {
  updateStateIfNeeded();
  ConcreteViewShadowNode::layout(layoutContext);
}

} // namespace react
} // namespace facebook
