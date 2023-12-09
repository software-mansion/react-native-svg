/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <react/renderer/core/ConcreteComponentDescriptor.h>

#include "RNSVGSvgViewShadowNode.h"

namespace facebook {
namespace react {

/*
 * Descriptor for <RNSVGSvgView> component.
 */
using RNSVGSvgViewComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGSvgViewShadowNode>;

} // namespace react
} // namespace facebook
