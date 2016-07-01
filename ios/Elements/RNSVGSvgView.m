/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGSvgView.h"

#import "RNSVGNode.h"
#import "RCTLog.h"

@implementation RNSVGSvgView
{
    NSMutableDictionary *clipPaths;
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
    [super insertReactSubview:subview atIndex:atIndex];
    [self insertSubview:subview atIndex:atIndex];
    [self invalidate];
}

- (void)removeReactSubview:(UIView *)subview
{
    [super removeReactSubview:subview];
    [self invalidate];
}

- (void)didUpdateReactSubviews
{
    // Do nothing, as subviews are inserted by insertReactSubview:
}

- (void)invalidate
{
    [self setNeedsDisplay];
}

- (void)drawRect:(CGRect)rect
{
    CGContextRef context = UIGraphicsGetCurrentContext();
    
    for (RNSVGNode *node in self.subviews) {
        [node renderTo:context];
        
        if (node.responsible && !self.responsible) {
            self.responsible = YES;
        }
    }
}

- (void)reactSetInheritedBackgroundColor:(UIColor *)inheritedBackgroundColor
{
    self.backgroundColor = inheritedBackgroundColor;
}

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    return self.responsible ? [super hitTest:point withEvent:event] : nil;
}

- (void)defineClipPath:(CGPathRef)clipPath clipPathId:(NSString *)clipPathId
{
    if (clipPaths == NULL) {
        clipPaths = [[NSMutableDictionary alloc] init];
    }
    [clipPaths setValue:[NSValue valueWithPointer:clipPath] forKey:clipPathId];
}

- (void)removeClipPath:(NSString *)clipPathId
{
    if (clipPaths != NULL) {
        [clipPaths removeObjectForKey:clipPathId];
    }
}

- (CGPathRef)getDefinedClipPath:(NSString *)clipPathId
{
    return [[clipPaths valueForKey:clipPathId] pointerValue];
}

@end
