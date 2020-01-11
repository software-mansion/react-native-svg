/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGForeignObject.h"
#import "RNSVGNode.h"
#import "RCTUIManager.h"
#import "RCTUIManagerObserverCoordinator.h"

@implementation RNSVGForeignObject
{
    RCTEventDispatcher *_eventDispatcher;
    bool _ready;
}

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    return nil;
}

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher
{
  RCTAssertParam(eventDispatcher);

    if ((self = [super init])) {
        _eventDispatcher = eventDispatcher;
        [_eventDispatcher.bridge.uiManager.observerCoordinator addObserver:self];
    }
    return self;
}

- (void)parseReference
{
    self.dirty = false;
}

- (void)uiManagerDidPerformMounting:(RCTUIManager *)manager
{
  [manager addUIBlock:^(__unused RCTUIManager *uiManager, __unused NSDictionary<NSNumber *, UIView *> *viewRegistry) {
      if (!self->_ready) {
          [self invalidate];
      }
  }];
}

- (void)renderChildTo:(CGContextRef)context rect:(CGRect)rect node:(UIView*)node
{
    node.hidden = false;
    self->_ready = [node drawViewHierarchyInRect:rect afterScreenUpdates:true];
    [node.layer renderInContext:context];
    node.hidden = true;
}

- (void)renderLayerTo:(CGContextRef)context rect:(CGRect)rect
{
    [self clip:context];
    CGContextTranslateCTM(context, [self relativeOnWidth:self.x], [self relativeOnHeight:self.y]);
    CGRect clip = CGRectMake(
                             0,
                             0,
                             [self relativeOnWidth:self.foreignObjectwidth],
                             [self relativeOnHeight:self.foreignObjectheight]
                             );
    CGContextClipToRect(context, clip);
    [super renderLayerTo:context rect:rect];
}

- (void)setX:(RNSVGLength *)x
{
    if ([x isEqualTo:_x]) {
        return;
    }

    _x = x;
    [self invalidate];
}

- (void)setY:(RNSVGLength *)y
{
    if ([y isEqualTo:_y]) {
        return;
    }

    _y = y;
    [self invalidate];
}

- (void)setForeignObjectwidth:(RNSVGLength *)foreignObjectwidth
{
    if ([foreignObjectwidth isEqualTo:_foreignObjectwidth]) {
        return;
    }

    _foreignObjectwidth = foreignObjectwidth;
    [self invalidate];
}

- (void)setForeignObjectheight:(RNSVGLength *)foreignObjectheight
{
    if ([foreignObjectheight isEqualTo:_foreignObjectheight]) {
        return;
    }

    _foreignObjectheight = foreignObjectheight;
    [self invalidate];
}

@end

