/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <react/renderer/core/ConcreteComponentDescriptor.h>

#include "RNSVGSvgViewAndroidShadowNode.h"

namespace facebook {
namespace react {

/*
 * Descriptor for <RNSVGSvgViewAndroid> component.
 */
using RNSVGSvgViewAndroidComponentDescriptor =
    ConcreteComponentDescriptor<RNSVGSvgViewAndroidShadowNode>;

} // namespace react
} // namespace facebook
