/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGRenderable.h"

@implementation RNSVGRenderable
{
    NSMutableDictionary *_originProperties;
    NSArray *_lastMergedList;
    RNSVGPercentageConverter *_widthConverter;
    RNSVGPercentageConverter *_heightConverter;
    CGRect _contextBoundingBox;
    CGRect _renderBoundingBox;
    BOOL _fillEvenodd;
    CGPathRef _hitArea;
}

- (id)init
{
    if (self = [super init]) {
        _fillOpacity = 1;
        _strokeOpacity = 1;
        _strokeWidth = 0;
    }
    return self;
}

- (void)setFill:(RNSVGBrush *)fill
{
    if (fill == _fill) {
        return;
    }
    [self invalidate];
    _fill = fill;
}

- (void)setFillOpacity:(CGFloat)fillOpacity
{
    if (fillOpacity == _fillOpacity) {
        return;
    }
    [self invalidate];
    _fillOpacity = fillOpacity;
}

- (void)setFillRule:(RNSVGCGFCRule)fillRule
{
    if (fillRule == _fillRule) {
        return;
    }
    [self invalidate];
    _fillEvenodd = fillRule == kRNSVGCGFCRuleEvenodd;
    _fillRule = fillRule;
}

- (void)setStroke:(RNSVGBrush *)stroke
{
    if (stroke == _stroke) {
        return;
    }
    [self invalidate];
    _stroke = stroke;
}

- (void)setStrokeOpacity:(CGFloat)strokeOpacity
{
    if (strokeOpacity == _strokeOpacity) {
        return;
    }
    [self invalidate];
    _strokeOpacity = strokeOpacity;
}

- (void)setStrokeWidth:(CGFloat)strokeWidth
{
    if (strokeWidth == _strokeWidth) {
        return;
    }
    [self invalidate];
    _strokeWidth = strokeWidth;
}

- (void)setStrokeLinecap:(CGLineCap)strokeLinecap
{
    if (strokeLinecap == _strokeLinecap) {
        return;
    }
    [self invalidate];
    _strokeLinecap = strokeLinecap;
}

- (void)setStrokeJoin:(CGLineJoin)strokeLinejoin
{
    if (strokeLinejoin == _strokeLinejoin) {
        return;
    }
    [self invalidate];
    _strokeLinejoin = strokeLinejoin;
}

- (void)setStrokeMiterlimit:(CGFloat)strokeMiterlimit
{
    if (strokeMiterlimit == _strokeMiterlimit) {
        return;
    }
    [self invalidate];
    _strokeMiterlimit = strokeMiterlimit;
}

- (void)setStrokeDasharray:(RNSVGCGFloatArray)strokeDasharray
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
    if (strokeDashoffset == _strokeDashoffset) {
        return;
    }
    [self invalidate];
    _strokeDashoffset = strokeDashoffset;
}

- (void)setPropList:(NSArray<NSString *> *)propList
{
    if (propList == _propList) {
        return;
    }
    _attributeList = [propList copy];
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
    // This needs to be painted on a layer before being composited.
    CGContextSaveGState(context);
    CGContextConcatCTM(context, self.matrix);
    CGContextSetAlpha(context, self.opacity);
    
    [self beginTransparencyLayer:context];
    [self renderLayerTo:context];
    [self endTransparencyLayer:context];
    
    CGContextRestoreGState(context);
}


- (void)renderLayerTo:(CGContextRef)context
{
    BOOL shouldStroke = self.stroke && self.strokeWidth;
    
    if (!self.fill && !shouldStroke) {
        return;
    }
    
    CGPathRef path = [self getPath:context];
    [self setHitArea:path];
    
    if (self.opacity == 0) {
        return;
    }
    
    CGPathDrawingMode mode = kCGPathStroke;
    BOOL fillColor = YES;
    [self clip:context];
    
    if (self.fill) {
        mode = _fillEvenodd ? kCGPathEOFill : kCGPathFill;
        fillColor = [self.fill applyFillColor:context opacity:self.fillOpacity];
        
        if (!fillColor) {
            CGContextSaveGState(context);
            CGContextAddPath(context, path);
            CGContextClip(context);
            [self.fill paint:context
                     opacity:self.fillOpacity
              brushConverter:[[self getSvgView] getDefinedBrushConverter:self.fill.brushRef]
             ];
            CGContextRestoreGState(context);
            
            if (!shouldStroke) {
                return;
            }
        }
    }
    
    if (shouldStroke) {
        CGContextSetLineWidth(context, self.strokeWidth);
        CGContextSetLineCap(context, self.strokeLinecap);
        CGContextSetLineJoin(context, self.strokeLinejoin);
        RNSVGCGFloatArray dash = self.strokeDasharray;
        
        if (dash.count) {
            CGContextSetLineDash(context, self.strokeDashoffset, dash.array, dash.count);
        }
        
        BOOL strokeColor = [self.stroke applyStrokeColor:context opacity:self.strokeOpacity];
        
        if (!fillColor || !strokeColor) {
            CGContextAddPath(context, path);
            CGContextReplacePathWithStrokedPath(context);
            CGContextClip(context);
        }
        
        if (!strokeColor) {
            [self.stroke paint:context
                       opacity:self.strokeOpacity
                brushConverter:[[self getSvgView] getDefinedBrushConverter:self.stroke.brushRef]
            ];
            return;
        } else if (self.fill) {
            mode = _fillEvenodd ? kCGPathEOFillStroke : kCGPathFillStroke;
        }
    }
    
    CGContextAddPath(context, path);
    CGContextDrawPath(context, mode);
}

- (void)setHitArea:(CGPathRef)path
{
    CGPathRelease(_hitArea);
    if ([self getSvgView].responsible) {
        // Add path to hitArea
        CGMutablePathRef hitArea = CGPathCreateMutableCopy(path);
        
        if (self.stroke && self.strokeWidth) {
            // Add stroke to hitArea
            CGPathRef strokePath = CGPathCreateCopyByStrokingPath(hitArea, nil, self.strokeWidth, self.strokeLinecap, self.strokeLinejoin, self.strokeMiterlimit);
            CGPathAddPath(hitArea, nil, strokePath);
            CGPathRelease(strokePath);
        }
        
        _hitArea = CGPathRetain(CFAutorelease(CGPathCreateCopy(hitArea)));
        CGPathRelease(hitArea);
    }

}

// hitTest delagate
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    return [self hitTest:point withEvent:event withTransform:CGAffineTransformMakeRotation(0)];
}

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event withTransform:(CGAffineTransform)transform
{
    if (!_hitArea) {
        return nil;
    }
    
    if (self.active) {
        if (!event) {
            self.active = NO;
        }
        return self;
    }
    
    CGAffineTransform matrix = CGAffineTransformConcat(self.matrix, transform);
    CGPathRef hitArea = CGPathCreateCopyByTransformingPath(_hitArea, &matrix);
    BOOL contains = CGPathContainsPoint(hitArea, nil, point, NO);
    CGPathRelease(hitArea);
    
    if (contains) {
        CGPathRef clipPath = [self getClipPath];
        
        if (!clipPath) {
            return self;
        } else {
            CGPathRef transformedClipPath = CGPathCreateCopyByTransformingPath(clipPath, &matrix);
            BOOL result = CGPathContainsPoint(transformedClipPath, nil, point, self.clipRule == kRNSVGCGFCRuleEvenodd);
            CGPathRelease(transformedClipPath);
            return result ? self : nil;
        }
    } else {
        return nil;
    }
}

- (void)setContextBoundingBox:(CGRect)contextBoundingBox
{
    _contextBoundingBox = contextBoundingBox;
    _widthConverter = [[RNSVGPercentageConverter alloc] initWithRelativeAndOffset:contextBoundingBox.size.width
                                                                           offset:0];
    _heightConverter = [[RNSVGPercentageConverter alloc] initWithRelativeAndOffset:contextBoundingBox.size.height
                                                                            offset:0];
}

- (RNSVGPercentageConverter *)getWidthConverter
{
    return _widthConverter;
}

- (RNSVGPercentageConverter *)getHeightConverter
{
    return _heightConverter;
}

- (CGRect)getContextBoundingBox
{
    return _contextBoundingBox;
}

- (void)setLayoutBoundingBox:(CGRect)layoutBoundingBox
{
    _renderBoundingBox = layoutBoundingBox;
}

- (CGRect)getLayoutBoundingBox
{
    return _renderBoundingBox;
}

- (CGFloat)getWidthRelatedValue:(NSString *)string
{
    return [_widthConverter stringToFloat:string];
}

- (CGFloat)getHeightRelatedValue:(NSString *)string
{
    return [_heightConverter stringToFloat:string];
}

- (void)mergeProperties:(__kindof RNSVGNode *)target mergeList:(NSArray<NSString *> *)mergeList
{
    
    [self mergeProperties:target mergeList:mergeList inherited:NO];
}

- (void)mergeProperties:(__kindof RNSVGNode *)target mergeList:(NSArray<NSString *> *)mergeList inherited:(BOOL)inherited
{
    _lastMergedList = mergeList;
    
    if (mergeList.count == 0) {
        return;
    }
    
    NSMutableArray* attributeList = [self.propList mutableCopy];
    
    _originProperties = [[NSMutableDictionary alloc] init];
    
    for (NSString *key in mergeList) {
        if (inherited) {
            if (![attributeList containsObject:key]) {
                [attributeList addObject:key];
                [_originProperties setValue:[self valueForKey:key] forKey:key];
                [self setValue:[target valueForKey:key] forKey:key];
            }
        } else {
            [_originProperties setValue:[self valueForKey:key] forKey:key];
            [self setValue:[target valueForKey:key] forKey:key];
        }
    }
    
    _attributeList = [attributeList copy];
}

- (void)resetProperties
{
    for (NSString *key in _lastMergedList) {
        [self setValue:[_originProperties valueForKey:key] forKey:key];
    }
    _attributeList = [_propList copy];
}

@end
