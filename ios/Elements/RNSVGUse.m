/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGUse.h"
#import "RNSVGSymbol.h"
#import <React/RCTLog.h>

@implementation RNSVGUse

- (void)setHref:(NSString *)href
{
    if ([href isEqualToString:_href]) {
        return;
    }

    [self invalidate];
    _href = href;
}

- (void)setUsewidth:(NSString *)usewidth
{
    if ([usewidth isEqualToString:_usewidth]) {
        return;
    }

    [self invalidate];
    _usewidth = usewidth;
}

- (void)setUseheight:(NSString *)useheight
{
    if ([useheight isEqualToString:_useheight]) {
        return;
    }

    [self invalidate];
    _useheight = useheight;
}

- (void)renderLayerTo:(CGContextRef)context rect:(CGRect)rect
{
    RNSVGNode* template = [self.svgView getDefinedTemplate:self.href];
    if (template) {
        [self beginTransparencyLayer:context];
        [self clip:context];

        if ([template isKindOfClass:[RNSVGRenderable class]]) {
            [(RNSVGRenderable*)template mergeProperties:self];
        }

        if ([template class] == [RNSVGSymbol class]) {
            RNSVGSymbol *symbol = (RNSVGSymbol*)template;
            [symbol renderSymbolTo:context width:[self relativeOnWidth:self.usewidth] height:[self relativeOnHeight:self.useheight]];
        } else {
            [template renderTo:context rect:rect];
        }

        if ([template isKindOfClass:[RNSVGRenderable class]]) {
            [(RNSVGRenderable*)template resetProperties];
        }

        [self endTransparencyLayer:context];
    } else if (self.href) {
        // TODO: calling yellow box here
        RCTLogWarn(@"`Use` element expected a pre-defined svg template as `href` prop, template named: %@ is not defined.", self.href);
    }
    self.clientRect = template.clientRect;
    self.bounds = template.clientRect;
}

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event {
    const CGPoint transformed = CGPointApplyAffineTransform(point, self.invmatrix);
    RNSVGNode const* template = [self.svgView getDefinedTemplate:self.href];
    if (event) {
        self.active = NO;
    } else if (self.active) {
        return self;
    }
    UIView const* hitChild = [template hitTest:transformed withEvent:event];
    if (hitChild) {
        self.active = YES;
        return self;
    }
    return nil;
}

@end

