/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


#import "RNSVGTextPath.h"
#import "RNSVGBezierPath.h"

@implementation RNSVGTextPath

- (void)renderLayerTo:(CGContextRef)context
{
    [self renderGroupTo:context];
}

- (CGPathRef)getPath:(CGContextRef)context
{
    return [self getGroupPath:context];
}

- (RNSVGBezierPath *)getBezierPath
{
    RNSVGSvgView *svg = [self getSvgView];
    RNSVGNode *template = [svg getDefinedTemplate:self.href];
    
    if ([template class] != [RNSVGPath class]) {
        // warning about this.
        return nil;
    }
    
    RNSVGPath *path = template;
    return [[RNSVGBezierPath alloc] initWithBezierCurves:[path getBezierCurves]];
}

@end
