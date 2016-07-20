/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGUse.h"
#import "RCTLog.h"

@implementation RNSVGUse

- (void)setMergeList:(NSArray<NSString *> *)mergeList
{
    if (mergeList == _mergeList) {
        return;
    }
    _mergeList = mergeList;
    [self invalidate];
}

- (void)renderLayerTo:(CGContextRef)context
{
    RNSVGNode* template = [[self getSvgView] getDefinedTemplate:self.href];
    if (template) {
        [template mergeProperties:self mergeList:self.mergeList];
        [template renderTo:context];
        [template resetProperties];
    } else if (self.href) {
        // TODO: calling yellow box here
        RCTLogWarn(@"`Use` element expected a pre-defined svg template as `href` prop, template named: %@ is not defined.", self.href);
    }
}

@end

