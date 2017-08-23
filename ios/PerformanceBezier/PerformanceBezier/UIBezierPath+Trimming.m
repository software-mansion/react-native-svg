//
//  UIBezierPath+DKFix.m
//  ClippingBezier
//
//  Created by Adam Wulf on 5/9/15.
//
//

#import "UIBezierPath+Trimming.h"
#import <PerformanceBezier/PerformanceBezier.h>
#pragma mark - Subdivide helpers by Alastair J. Houghton
/*
 * Bezier path utility category (trimming)
 *
 * (c) 2004 Alastair J. Houghton
 * All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   1. Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *
 *   2. Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *
 *   3. The name of the author of this software may not be used to endorse
 *      or promote products derived from the software without specific prior
 *      written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER "AS IS" AND ANY EXPRESS
 * OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE COPYRIGHT OWNER BE LIABLE FOR ANY DIRECT, INDIRECT,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */


@implementation UIBezierPath (Trimming)

-(NSInteger) countSubPaths{
    return [[self subPaths] count];
}

/* Return an NSBezierPath corresponding to the first trimLength units
 of this NSBezierPath. */
- (UIBezierPath *)bezierPathByTrimmingToLength:(CGFloat)trimLength
                              withMaximumError:(CGFloat)maxError
{
    UIBezierPath *newPath = [UIBezierPath bezierPath];
    NSInteger    elements = [self elementCount];
    int	         n;
    double       length = 0.0;
    CGPoint      pointForClose = CGPointMake(0.0, 0.0);
    CGPoint      lastPoint = CGPointMake (0.0, 0.0);
    
    for (n = 0; n < elements; ++n) {
        CGPoint		points[3];
        CGPathElement element = [self elementAtIndex:n
                                          associatedPoints:points];
        double		elementLength;
        double		remainingLength = trimLength - length;
        
        if(remainingLength == 0){
            break;
        }
        
        switch (element.type) {
            case kCGPathElementMoveToPoint:
                [newPath moveToPoint:points[0]];
                pointForClose = lastPoint = points[0];
                continue;
                
            case kCGPathElementAddLineToPoint:
                elementLength = distance (lastPoint, points[0]);
                
                if (length + elementLength <= trimLength)
                    [newPath addLineToPoint:points[0]];
                else {
                    double f = remainingLength / elementLength;
                    [newPath addLineToPoint:CGPointMake (lastPoint.x
                                                      + f * (points[0].x - lastPoint.x),
                                                      lastPoint.y
                                                      + f * (points[0].y - lastPoint.y))];
                    return newPath;
                }
                
                length += elementLength;
                lastPoint = points[0];
                break;
                
            case kCGPathElementAddCurveToPoint:
            case kCGPathElementAddQuadCurveToPoint: {
                CGPoint bezier[4];
                if(element.type == kCGPathElementAddCurveToPoint){
                    bezier[0] = lastPoint;
                    bezier[1] = points[0];
                    bezier[2] = points[1];
                    bezier[3] = points[2];
                }else{
                    bezier[0] = lastPoint;
                    bezier[1] = points[0];
                    bezier[2] = points[0];
                    bezier[3] = points[1];
                }
                elementLength = lengthOfBezier (bezier, maxError);
                
                if (length + elementLength <= trimLength)
                    [newPath addCurveToPoint:points[2] controlPoint1:points[0] controlPoint2:points[1]];
                else {
                    CGPoint bez1[4], bez2[4];
                    subdivideBezierAtLength (bezier, bez1, bez2,
                                             remainingLength, maxError);
                    [newPath addCurveToPoint:bez1[3] controlPoint1:bez1[1] controlPoint2:bez1[2]];
                    return newPath;
                }
                
                length += elementLength;
                lastPoint = points[2];
                break;
            }
                
            case kCGPathElementCloseSubpath:
                elementLength = distance (lastPoint, pointForClose);
                
                if (length + elementLength <= trimLength)
                    [newPath closePath];
                else {
                    double f = remainingLength / elementLength;
                    [newPath addLineToPoint:CGPointMake(lastPoint.x
                                                      + f * (points[0].x - lastPoint.x),
                                                      lastPoint.y
                                                      + f * (points[0].y - lastPoint.y))];
                    return newPath;
                }
                
                length += elementLength;
                lastPoint = pointForClose;
                break;
        }
    }
    
    return newPath;
}

// Convenience method
- (UIBezierPath *)bezierPathByTrimmingToLength:(CGFloat)trimLength
{
    return [self bezierPathByTrimmingToLength:trimLength withMaximumError:0.1];
}

/* Return an NSBezierPath corresponding to the part *after* the first
 trimLength units of this NSBezierPath. */
- (UIBezierPath *)bezierPathByTrimmingFromLength:(CGFloat)trimLength
                                withMaximumError:(CGFloat)maxError
{
    UIBezierPath *newPath = [UIBezierPath bezierPath];
    NSInteger    elements = [self elementCount];
    int	         n;
    double       length = 0.0;
    CGPoint      pointForClose = CGPointMake (0.0, 0.0);
    CGPoint      lastPoint = CGPointMake (0.0, 0.0);
    BOOL legitMoveTo = NO;
    
    for (n = 0; n < elements; ++n) {
        CGPoint		points[3];
        CGPathElement element = [self elementAtIndex:n
                                          associatedPoints:points];
        double		elementLength;
        double		remainingLength = trimLength - length;
        
        switch (element.type) {
            case kCGPathElementMoveToPoint:
                if(remainingLength < 0){
                    [newPath moveToPoint:points[0]];
                    legitMoveTo = YES;
                }
                pointForClose = lastPoint = points[0];
                continue;
                
            case kCGPathElementAddLineToPoint:
                elementLength = distance (lastPoint, points[0]);
                
                if (length > trimLength){
                    [newPath addLineToPoint:points[0]];
                }else if (length + elementLength > trimLength) {
                    double f = remainingLength / elementLength;
                    [newPath moveToPoint:CGPointMake (lastPoint.x
                                                      + f * (points[0].x - lastPoint.x),
                                                      lastPoint.y
                                                      + f * (points[0].y - lastPoint.y))];
                    [newPath addLineToPoint:points[0]];
                }
                
                length += elementLength;
                lastPoint = points[0];
                break;
                
            case kCGPathElementAddCurveToPoint:
            case kCGPathElementAddQuadCurveToPoint: {
                CGPoint bezier[4];
                if(element.type == kCGPathElementAddCurveToPoint){
                    bezier[0] = lastPoint;
                    bezier[1] = points[0];
                    bezier[2] = points[1];
                    bezier[3] = points[2];
                }else{
                    bezier[0] = lastPoint;
                    bezier[1] = points[0];
                    bezier[2] = points[0];
                    bezier[3] = points[1];
                }
                elementLength = lengthOfBezier (bezier, maxError);
                
                if (length > trimLength){
                    [newPath addCurveToPoint:points[2]
                            controlPoint1:points[0]
                            controlPoint2:points[1]];
                }else if (length + elementLength > trimLength) {
                    CGPoint bez1[4], bez2[4];
                    subdivideBezierAtLength (bezier, bez1, bez2,
                                             remainingLength, maxError);
                    [newPath moveToPoint:bez2[0]];
                    [newPath addCurveToPoint:bez2[3]
                            controlPoint1:bez2[1]
                            controlPoint2:bez2[2]];
                }
                
                length += elementLength;
                lastPoint = points[2];
                break;
            }
                
            case kCGPathElementCloseSubpath:
                elementLength = distance (lastPoint, pointForClose);
                
                if (length > trimLength){
                    if(legitMoveTo){
                        [newPath closePath];
                    }else{
                        [newPath addLineToPoint:pointForClose];
                    }
                } else if (length + elementLength > trimLength) {
                    double f = remainingLength / elementLength;
                    [newPath moveToPoint:CGPointMake (lastPoint.x
                                                      + f * (points[0].x - lastPoint.x),
                                                      lastPoint.y
                                                      + f * (points[0].y - lastPoint.y))];
                    [newPath addLineToPoint:points[0]];
                }
                
                length += elementLength;
                lastPoint = pointForClose;
                break;
        }
    } 
    
    return newPath;
}

// Convenience method
- (UIBezierPath *)bezierPathByTrimmingFromLength:(CGFloat)trimLength
{
    return [self bezierPathByTrimmingFromLength:trimLength withMaximumError:0.1];
}

- (NSInteger) subpathIndexForElement:(NSInteger) element{
    __block NSInteger subpathIndex = -1;
    __block BOOL lastWasMoveTo = NO;
    [self iteratePathWithBlock:^(CGPathElement element, NSUInteger idx) {
        if(element.type == kCGPathElementMoveToPoint){
            if(!lastWasMoveTo){
                subpathIndex += 1;
            }
            lastWasMoveTo = YES;
        }else{
            lastWasMoveTo = NO;
        }
    }];
    return subpathIndex;
}

- (CGFloat) length{
    __block CGFloat length = 0;
    __block CGPoint lastMoveToPoint = CGPointNotFound;
    __block CGPoint lastElementEndPoint = CGPointNotFound;
    [self iteratePathWithBlock:^(CGPathElement element, NSUInteger idx) {
        if(element.type == kCGPathElementMoveToPoint){
            lastElementEndPoint = element.points[0];
            lastMoveToPoint = element.points[0];
        }else if(element.type == kCGPathElementCloseSubpath){
            length += distance(lastElementEndPoint, lastMoveToPoint);
            lastElementEndPoint = lastMoveToPoint;
        }else if(element.type == kCGPathElementAddLineToPoint){
            length += distance(lastElementEndPoint, element.points[0]);
            lastElementEndPoint = element.points[0];
        }else if(element.type == kCGPathElementAddQuadCurveToPoint ||
                 element.type == kCGPathElementAddCurveToPoint){
            
            CGPoint bez[4];
            bez[0] = lastElementEndPoint;
            
            if(element.type == kCGPathElementAddQuadCurveToPoint){
                bez[1] = element.points[0];
                bez[2] = element.points[0];
                bez[3] = element.points[1];
                lastElementEndPoint = element.points[1];
            }else if(element.type == kCGPathElementAddCurveToPoint){
                bez[1] = element.points[0];
                bez[2] = element.points[1];
                bez[3] = element.points[2];
                lastElementEndPoint = element.points[2];
            }
            
            length += lengthOfBezier(bez, .5);;
        }
    }];
    return length;
}

- (CGFloat) tangentAtStart{
    if([self elementCount] < 2){
        return 0.0;
    }
    
    CGPathElement ele1 = [self elementAtIndex:0];
    CGPathElement ele2 = [self elementAtIndex:1];
    
    if(ele1.type != kCGPathElementMoveToPoint){
        return 0.0;
    }
    
    CGPoint point1 = ele1.points[0];
    CGPoint point2 = CGPointZero;
    
    switch (ele2.type) {
        case kCGPathElementMoveToPoint:
            return 0.0;
            break;
        case kCGPathElementAddCurveToPoint:
        case kCGPathElementAddQuadCurveToPoint:
        case kCGPathElementAddLineToPoint:
            point2 = ele2.points[0];
            break;
        case kCGPathElementCloseSubpath:
            return 0.0;
            break;
    }

    return atan2f( point2.y - point1.y, point2.x - point1.x ) + M_PI;
}

- (CGFloat) tangentAtStartOfSubpath:(NSInteger)index{
    return [[[self subPaths] objectAtIndex:index] tangentAtStart];
}


@end
