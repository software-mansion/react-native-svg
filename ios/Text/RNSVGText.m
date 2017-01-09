/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGText.h"
#import "RNSVGTextPath.h"
#import <React/RCTFont.h>
#import <CoreText/CoreText.h>

@implementation RNSVGText
{
    RNSVGText *_textRoot;
}

- (void)setTextAnchor:(RNSVGTextAnchor)textAnchor
{
    [self invalidate];
    _textAnchor = textAnchor;
}

- (void)renderLayerTo:(CGContextRef)context
{
    [self clip:context];
    CGContextSaveGState(context);
    CGAffineTransform transform = CGAffineTransformMakeTranslation([self getShift:context path:nil], 0);
    CGContextConcatCTM(context, transform);
    [self renderGroupTo:context];
    [self resetTextPathAttributes];
    CGContextRestoreGState(context);
}

- (CGPathRef)getPath:(CGContextRef)context
{
    CGPathRef path = [self getGroupPath:context];
    CGAffineTransform transform = CGAffineTransformMakeTranslation([self getShift:context path:path], 0);
    CGPathRef transformedPath = CGPathCreateCopyByTransformingPath(path, &transform);
    
    // check memory leaks here
    //CGPathRelease(path);
    return (CGPathRef)CFAutorelease(transformedPath);
}

- (CGPathRef)getGroupPath:(CGContextRef)context
{
    CGPathRef groupPath = [super getPath:context];
    [self resetTextPathAttributes];
    return groupPath;
}

- (CGFloat)getShift:(CGContextRef)context path:(CGPathRef)path
{
    if (path == nil) {
        path = [self getGroupPath:context];
    }
    
    CGFloat width = CGRectGetWidth(CGPathGetBoundingBox(path));
    
    switch ([self getComputedTextAnchor]) {
        case kRNSVGTextAnchorMiddle:
            return -width / 2;
        case kRNSVGTextAnchorEnd:
            return -width;
        default:
            return 0;
    }
}

- (RNSVGTextAnchor)getComputedTextAnchor
{
    RNSVGTextAnchor anchor = self.textAnchor;
    if (self.subviews.count > 0) {
        RNSVGText *child = [self.subviews objectAtIndex:0];
        
        while (child.subviews.count && anchor == kRNSVGTextAnchorAuto) {
            anchor = child.textAnchor;
            child = [child.subviews objectAtIndex:0];
        }
    }
    return anchor;
}

- (BOOL)extendFontFromInheritedFont:(NSMutableDictionary *)font inheritedFont:(NSDictionary *)inheritedFont
{
    NSString *fontFamily = font[@"fontFamily"];
    NSNumber *fontSize = font[@"fontSize"];
    NSString *fontWeight = font[@"fontWeight"];
    NSString *fontStyle = font[@"fontStyle"];

    BOOL fontAttributesSet = YES;
    if (!fontFamily && inheritedFont[@"fontFamily"]) {
        [font setObject:inheritedFont[@"fontFamily"] forKey:@"fontFamily"];
        fontAttributesSet = NO;
    }
    
    if (fontSize == nil && inheritedFont[@"fontSize"] != nil) {
        [font setObject:inheritedFont[@"fontSize"] forKey:@"fontSize"];
        fontAttributesSet = NO;
    }
    
    if (!fontWeight && inheritedFont[@"fontWeight"]) {
        [font setObject:inheritedFont[@"fontWeight"] forKey:@"fontWeight"];
        fontAttributesSet = NO;
    }
    
    if (!fontStyle && inheritedFont[@"fontStyle"]) {
        [font setObject:inheritedFont[@"fontStyle"] forKey:@"fontStyle"];
        fontAttributesSet = NO;
    }
    
    return fontAttributesSet;
}

- (CTFontRef)getComputedFont
{
    NSMutableDictionary *fontDict = [[NSMutableDictionary alloc] init];
    [self traverseTextSuperviews:^(__kindof RNSVGText *node) {
        return [self extendFontFromInheritedFont:fontDict inheritedFont:node.font];
    }];
    
    NSString *fontFamily = fontDict[@"fontFamily"];
    BOOL fontFamilyFound = NO;
    NSArray *supportedFontFamilyNames = [UIFont familyNames];
    
    if ([supportedFontFamilyNames containsObject:fontFamily]) {
        fontFamilyFound = YES;
    } else {
        for (NSString *fontFamilyName in supportedFontFamilyNames) {
            if ([[UIFont fontNamesForFamilyName: fontFamilyName] containsObject:fontFamily]) {
                fontFamilyFound = YES;
                break;
            }
        }
    }
    fontFamily = fontFamilyFound ? fontFamily : nil;
    
    return (__bridge CTFontRef)[RCTFont updateFont:nil
                                        withFamily:fontFamily
                                              size:fontDict[@"fontSize"]
                                            weight:fontDict[@"fontWeight"]
                                             style:fontDict[@"fontStyle"]
                                           variant:nil scaleMultiplier:1.0];
}

- (RNSVGGlyphPoint)getComputedGlyphPoint:(NSUInteger *)index glyphOffset:(CGPoint)glyphOffset
{
    __block RNSVGGlyphPoint point;
    point.isDeltaXSet = point.isDeltaYSet = point.isPositionXSet = point.isPositionYSet = NO;
    
    [self traverseTextSuperviews:^(__kindof RNSVGText *node) {
        if ([node class] != [RNSVGTextPath class]) {
            NSUInteger index = node.lastIndex;
            
            if (!point.isPositionXSet && node.positionX && !index) {
                point.positionX = [self getWidthRelatedValue:node.positionX];
                point.isPositionXSet = YES;
            }
            
            if (!point.isDeltaXSet && node.deltaX.count > index) {
                point.deltaX = [[node.deltaX objectAtIndex:index] floatValue];
                point.isDeltaXSet = YES;
            }
            
            if (!point.isPositionYSet && node.positionY && !index) {
                point.positionY = [self getHeightRelatedValue:node.positionY];
                point.isPositionYSet = YES;
            }
            
            if (!point.isDeltaYSet && node.deltaY.count > index) {
                point.deltaY = [[node.deltaY objectAtIndex:index] floatValue];
                point.isDeltaYSet = YES;
            }
            node.lastIndex++;
        }
        return YES;
    }];
    
    CGPoint lineOffset = [self getGlyphLineOffset];
    CGFloat lastX = lineOffset.x;
    CGFloat lastY = lineOffset.y;
    
    if (point.isPositionXSet) {
        lastX = point.positionX;
    }
    
    if (point.isPositionYSet) {
        lastY = point.positionY;
    }
    
    if (point.isDeltaXSet) {
        lastX += point.deltaX;
    }
    
    if (point.isDeltaYSet) {
        lastY += point.deltaY;
    }
    
    [self getTextRoot].lastX = lastX;
    [self getTextRoot].lastY = lastY;
    
    point.x = lastX + glyphOffset.x;
    point.y = lastY + glyphOffset.y;

    return point;
}


- (void)traverseTextSuperviews:(BOOL (^)(__kindof RNSVGText *node))block
{
    RNSVGText *targetView = self;
    block(self);
    
    while (targetView && [targetView class] != [RNSVGText class]) {
        if (![targetView isKindOfClass:[RNSVGText class]]) {
            //todo: throw exception here
            break;
        }
        
        targetView = [targetView superview];
        block(targetView);
    }
}

- (RNSVGText *)getTextRoot
{
    if (!_textRoot) {
        _textRoot = self;
        while (_textRoot && [_textRoot class] != [RNSVGText class]) {
            if (![_textRoot isKindOfClass:[RNSVGText class]]) {
                //todo: throw exception here
                break;
            }
            _textRoot = [_textRoot superview];
        }
    }
    
    return _textRoot;
}

- (CGPoint)getGlyphLineOffset
{
    RNSVGText *text = [self getTextRoot];
    return CGPointMake(text.lastX, text.lastY);
}

// reset Text path related attributes
- (void)resetTextPathAttributes
{
    self.lastIndex = 0;
    self.lastX = self.lastY = 0;
}

@end
