/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "RNSVGSvgViewMeasurement.h"

namespace facebook {
namespace react {

Size measureSvgView(
    LayoutConstraints const &layoutConstraints,
    Float vbWidth,
    Float vbHeight) {
  auto size = layoutConstraints.minimumSize;
  auto minimumSize = layoutConstraints.minimumSize;
  auto maximumSize = layoutConstraints.maximumSize;
  if (vbWidth != 0 && vbHeight != 0) {
    if (minimumSize.width != maximumSize.width) {
      size.width =
          std::min(vbWidth / vbHeight * size.height, maximumSize.width);
    }
    if (minimumSize.height != maximumSize.height) {
      size.height =
          std::min(vbHeight / vbWidth * size.width, maximumSize.height);
    }
  }

  return size;
}

} // namespace react
} // namespace facebook
