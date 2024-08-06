/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <react/renderer/core/LayoutConstraints.h>

namespace facebook {
namespace react {

Size measureSvgView(
    LayoutConstraints const &layoutConstraints,
    Float vbWidth,
    Float vbHeight);

} // namespace react
} // namespace facebook
