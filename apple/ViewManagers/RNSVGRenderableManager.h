/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGNodeManager.h"
#import "RNSVGRenderable.h"

#ifdef RN_FABRIC_ENABLED
#import <rnsvg/rnsvg.h>
#endif

@interface RNSVGRenderableManager : RNSVGNodeManager
#ifdef RN_FABRIC_ENABLED
                                    <NativeSvgRenderableModuleSpec>
#endif

- (RNSVGRenderable *)node;

@end
