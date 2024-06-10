/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/rnsvg/EventEmitters.h>
#include <react/renderer/components/rnsvg/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/imagemanager/ImageManager.h>
#include <react/renderer/imagemanager/primitives.h>

#include "RNSVGImageState.h"

namespace facebook {
namespace react {

JSI_EXPORT extern const char RNSVGImageComponentName[];

/*
 * `ShadowNode` for <RNSVGImage> component.
 */
class JSI_EXPORT RNSVGImageShadowNode final : public ConcreteViewShadowNode<
                                                  RNSVGImageComponentName,
                                                  RNSVGImageProps,
                                                  RNSVGImageEventEmitter,
                                                  RNSVGImageState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  static ShadowNodeTraits BaseTraits() {
    auto traits = ConcreteViewShadowNode::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::LeafYogaNode);
    return traits;
  }

  /*
   * Associates a shared `ImageManager` with the node.
   */
  void setImageManager(const SharedImageManager &imageManager);

  static RNSVGImageState initialStateData(
      Props::Shared const &props,
      ShadowNodeFamily::Shared const &family,
      ComponentDescriptor const &componentDescriptor) {
    auto imageSource = ImageSource{ImageSource::Type::Invalid};
    return {imageSource, {imageSource, nullptr, {}}};
  }

#pragma mark - LayoutableShadowNode

  void layout(LayoutContext layoutContext) override;

 private:
  ImageSource getImageSource() const;

  SharedImageManager imageManager_;

  void updateStateIfNeeded();
};

} // namespace react
} // namespace facebook
