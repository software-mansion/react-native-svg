/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>
#include <react/renderer/imagemanager/ImageRequest.h>
#include <react/renderer/imagemanager/primitives.h>

#ifdef ANDROID
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif

namespace facebook {
namespace react {

/*
 * State for <Image> component.
 */
class JSI_EXPORT RNSVGImageState final {
 public:
  RNSVGImageState(ImageSource const &imageSource, ImageRequest imageRequest)
      : imageSource_(imageSource),
        imageRequest_(
            std::make_shared<ImageRequest>(std::move(imageRequest))){};

  /*
   * Returns stored ImageSource object.
   */
  ImageSource getImageSource() const;

  /*
   * Exposes for reading stored `ImageRequest` object.
   * `ImageRequest` object cannot be copied or moved from `ImageLocalData`.
   */
  ImageRequest const &getImageRequest() const;

#ifdef ANDROID
  RNSVGImageState(RNSVGImageState const &previousState, folly::dynamic data){};

  /*
   * Empty implementation for Android because it doesn't use this class.
   */
  folly::dynamic getDynamic() const {
    return {};
  };

  MapBuffer getMapBuffer() const {
    return MapBufferBuilder::EMPTY();
  };
#endif

 private:
  ImageSource imageSource_;
  std::shared_ptr<ImageRequest> imageRequest_;
};

} // namespace react
} // namespace facebook
