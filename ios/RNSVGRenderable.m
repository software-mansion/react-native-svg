/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGRenderable.h"
#import "RNSVGPercentageConverter.h"

@implementation RNSVGRenderable
{
    NSMutableDictionary *_originProperties;
    NSArray *_changedList;
    RNSVGPercentageConverter *_widthConverter;
    RNSVGPercentageConverter *_heightConverter;
    CGFloat _contextWidth;
    CGFloat _contextHeight;
    CGRect _boundingBox;
}

- (id)init
{
    if (self = [super init]) {
        _fillOpacity = 1;
        _strokeOpacity = 1;
        _strokeWidth = 1;
    }
    return self;
}

- (void)setHitArea:(CGMutablePathRef)hitArea
{
    if (hitArea == _hitArea) {
        return;
    }
    [self invalidate];
    CGPathRelease(_hitArea);
    _hitArea = hitArea;
}

- (void)setFill:(RNSVGBrush *)fill
{
    [self invalidate];
    _fill = fill;
}

- (void)setStroke:(RNSVGBrush *)stroke
{
    [self invalidate];
    _stroke = stroke;
}

- (void)setStrokeWidth:(CGFloat)strokeWidth
{
    [self invalidate];
    _strokeWidth = strokeWidth;
}

- (void)setStrokeLinecap:(CGLineCap)strokeLinecap
{
    [self invalidate];
    _strokeLinecap = strokeLinecap;
}

- (void)setStrokeJoin:(CGLineJoin)strokeLinejoin
{
    [self invalidate];
    _strokeLinejoin = strokeLinejoin;
}

- (void)setStrokeDash:(RNSVGCGFloatArray)strokeDasharray
{
    if (strokeDasharray.array == _strokeDasharray.array) {
        return;
    }
    if (_strokeDasharray.array) {
        free(_strokeDasharray.array);
    }
    [self invalidate];
    _strokeDasharray = strokeDasharray;
}

- (void)setStrokeDashoffset:(CGFloat)strokeDashoffset
{
    [self invalidate];
    _strokeDashoffset = strokeDashoffset;
}

- (void)setStrokeMiterlimit:(CGFloat)strokeMiterlimit
{
    [self invalidate];
    _strokeMiterlimit = strokeMiterlimit;
}

- (void)setPropList:(NSArray<NSString *> *)propList
{
    if (propList == _propList) {
        return;
    }
    _propList = propList;
    [self invalidate];
}

- (void)dealloc
{
    CGPathRelease(_hitArea);
    if (_strokeDasharray.array) {
        free(_strokeDasharray.array);
    }
}

- (void)renderTo:(CGContextRef)context
{
    if (self.opacity <= 0 || self.opacity >= 1 || (self.fill && self.stroke)) {
        // If we have both fill and stroke, we will need to paint this using normal compositing
        [super renderTo: context];
        return;
    }
    // This is a terminal with only one painting. Therefore we don't need to paint this
    // off-screen. We can just composite it straight onto the buffer.
    CGContextSaveGState(context);
    CGContextConcatCTM(context, self.matrix);
    CGContextSetAlpha(context, self.opacity);
    [self renderClip:context];
    [self renderLayerTo:context];
    CGContextRestoreGState(context);
}

// hitTest delagate
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    CGPathRef clipPath  = self.clipPath;
    if (self.hitArea && CGPathContainsPoint(self.hitArea, nil, point, NO)) {
        if (!clipPath) {
            return self;
        } else {
            return CGPathContainsPoint(clipPath, nil, point, NO) ? self : nil;
        }
    } else {
        return nil;
    }
}


- (void)setBoundingBox:(CGContextRef)context
{
    _boundingBox = CGContextGetClipBoundingBox(context);
    _widthConverter = [[RNSVGPercentageConverter alloc] initWithRelativeAndOffset:CGRectGetWidth(_boundingBox) offset:0];
    _heightConverter = [[RNSVGPercentageConverter alloc] initWithRelativeAndOffset:CGRectGetHeight(_boundingBox) offset:0];
}

- (CGFloat)getWidthRelatedValue:(NSString *)string
{
    return [_widthConverter stringToFloat:string];
}

- (CGFloat)getHeightRelatedValue:(NSString *)string
{
    return [_heightConverter stringToFloat:string];
}

- (CGFloat)getContextWidth
{
    return CGRectGetWidth(_boundingBox);
}

- (CGFloat)getContextHeight
{
    return CGRectGetHeight(_boundingBox);
}

- (CGFloat)getContextX
{
    return CGRectGetMinX(_boundingBox);
}

- (CGFloat)getContextY
{
    return CGRectGetMinY(_boundingBox);
}

- (void)mergeProperties:(__kindof RNSVGNode *)target mergeList:(NSArray<NSString *> *)mergeList
{
    
    [self mergeProperties:target mergeList:mergeList inherited:NO];
}

- (void)mergeProperties:(__kindof RNSVGNode *)target mergeList:(NSArray<NSString *> *)mergeList inherited:(BOOL)inherited
{
    if (mergeList.count == 0) {
        return;
    }
    
    if (!inherited) {
        _originProperties = [[NSMutableDictionary alloc] init];
        _changedList = mergeList;
    }
    
    for (NSString *key in mergeList) {
        if (inherited) {
            [self inheritProperty:target propName:key];
        } else {
            [_originProperties setValue:[self valueForKey:key] forKey:key];
            [self setValue:[target valueForKey:key] forKey:key];
        }
    }
}

- (void)resetProperties
{
    if (_changedList) {
        for (NSString *key in _changedList) {
            [self setValue:[_originProperties valueForKey:key] forKey:key];
        }
    }
    _changedList = nil;
}

- (void)inheritProperty:(__kindof RNSVGNode *)parent propName:(NSString *)propName
{
    if (![self.propList containsObject:propName]) {
        // add prop to propList
        NSMutableArray *copy = [self.propList mutableCopy];
        [copy addObject:propName];
        self.propList = [copy copy];
        
        [self setValue:[parent valueForKey:propName] forKey:propName];
    }
}

- (void)renderLayerTo:(CGContextRef)context
{
    // abstract
}

@end
