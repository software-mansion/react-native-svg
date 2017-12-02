//
//  UIBezierPath+Trim.m
//  PerformanceBezier
//
//  Created by Adam Wulf on 10/6/12.
//  Copyright (c) 2012 Milestone Made, LLC. All rights reserved.
//

#import "UIBezierPath+Trim.h"
#import <objc/runtime.h>
#import <PerformanceBezier/PerformanceBezier.h>

@implementation UIBezierPath (Trim)

/**
 * this will trim a specific element from a tvalue to a tvalue
 */
-(UIBezierPath*) bezierPathByTrimmingElement:(NSInteger)elementIndex fromTValue:(double)fromTValue toTValue:(double)toTValue{
    __block CGPoint previousEndpoint;
    __block UIBezierPath* outputPath = [UIBezierPath bezierPath];
    [self iteratePathWithBlock:^(CGPathElement element, NSUInteger currentIndex){
        if(currentIndex < elementIndex){
            if(element.type == kCGPathElementMoveToPoint){
                // moveto
                previousEndpoint = element.points[0];
            }else if(element.type == kCGPathElementAddCurveToPoint ){
                // curve
                previousEndpoint = element.points[2];
            }else if(element.type == kCGPathElementAddLineToPoint){
                // line
                previousEndpoint = element.points[0];
            }
        }else if(currentIndex == elementIndex){
            if(element.type == kCGPathElementMoveToPoint){
                // moveto
                previousEndpoint = element.points[0];
                [outputPath moveToPoint:element.points[0]];
            }else if(element.type == kCGPathElementAddCurveToPoint ){
                // curve
                CGPoint bez[4];
                bez[0] = previousEndpoint;
                bez[1] = element.points[0];
                bez[2] = element.points[1];
                bez[3] = element.points[2];
                
                previousEndpoint = element.points[2];
                
                CGPoint left[4], right[4];
                subdivideBezierAtT(bez, left, right, toTValue);
                bez[0] = left[0];
                bez[1] = left[1];
                bez[2] = left[2];
                bez[3] = left[3];
                subdivideBezierAtT(bez, left, right, fromTValue / toTValue);
                [outputPath moveToPoint:right[0]];
                [outputPath addCurveToPoint:right[3] controlPoint1:right[1] controlPoint2:right[2]];
            }else if(element.type == kCGPathElementAddLineToPoint){
                // line
                CGPoint startPoint = CGPointMake(previousEndpoint.x + fromTValue * (element.points[0].x - previousEndpoint.x),
                                                 previousEndpoint.y + fromTValue * (element.points[0].y - previousEndpoint.y));
                CGPoint endPoint = CGPointMake(previousEndpoint.x + toTValue * (element.points[0].x - previousEndpoint.x),
                                               previousEndpoint.y + toTValue * (element.points[0].y - previousEndpoint.y));
                previousEndpoint = element.points[0];
                [outputPath moveToPoint:startPoint];
                [outputPath addLineToPoint:endPoint];
            }
        }
    }];
    
    return outputPath;
}




/**
 * this will trim a uibezier path from the input element index
 * and that element's tvalue. it will return all elements after
 * that input
 */
-(UIBezierPath*) bezierPathByTrimmingFromElement:(NSInteger)elementIndex andTValue:(double)tValue{
    __block CGPoint previousEndpoint;
    __block UIBezierPath* outputPath = [UIBezierPath bezierPath];
    [self iteratePathWithBlock:^(CGPathElement element, NSUInteger currentIndex){
        if(currentIndex < elementIndex){
            if(element.type == kCGPathElementMoveToPoint){
                // moveto
                previousEndpoint = element.points[0];
            }else if(element.type == kCGPathElementAddCurveToPoint ){
                // curve
                previousEndpoint = element.points[2];
            }else if(element.type == kCGPathElementAddLineToPoint){
                // line
                previousEndpoint = element.points[0];
            }
        }else if(currentIndex == elementIndex){
            if(element.type == kCGPathElementMoveToPoint){
                // moveto
                previousEndpoint = element.points[0];
                [outputPath moveToPoint:element.points[0]];
            }else if(element.type == kCGPathElementAddCurveToPoint ){
                // curve
                CGPoint bez[4];
                bez[0] = previousEndpoint;
                bez[1] = element.points[0];
                bez[2] = element.points[1];
                bez[3] = element.points[2];
                
                previousEndpoint = element.points[2];
                
                CGPoint left[4], right[4];
                subdivideBezierAtT(bez, left, right, tValue);
                [outputPath moveToPoint:right[0]];
                [outputPath addCurveToPoint:right[3] controlPoint1:right[1] controlPoint2:right[2]];
            }else if(element.type == kCGPathElementAddLineToPoint){
                // line
                CGPoint startPoint = CGPointMake(previousEndpoint.x + tValue * (element.points[0].x - previousEndpoint.x),
                                                 previousEndpoint.y + tValue * (element.points[0].y - previousEndpoint.y));
                previousEndpoint = element.points[0];
                [outputPath moveToPoint:startPoint];
                [outputPath addLineToPoint:element.points[0]];
            }
        }else if(currentIndex > elementIndex){
            if(element.type == kCGPathElementMoveToPoint){
                // moveto
                previousEndpoint = element.points[0];
                [outputPath moveToPoint:element.points[0]];
            }else if(element.type == kCGPathElementAddCurveToPoint ){
                // curve
                previousEndpoint = element.points[2];
                [outputPath addCurveToPoint:element.points[2] controlPoint1:element.points[0] controlPoint2:element.points[1]];
            }else if(element.type == kCGPathElementAddLineToPoint){
                // line
                previousEndpoint = element.points[0];
                [outputPath addLineToPoint:element.points[0]];
            }
        }
    }];
    
    return outputPath;
}

/**
 * this will trim a uibezier path to the input element index
 * and that element's tvalue. it will return all elements before
 * that input
 */
-(UIBezierPath*) bezierPathByTrimmingToElement:(NSInteger)elementIndex andTValue:(double)tValue{
    __block CGPoint previousEndpoint;
    __block UIBezierPath* outputPath = [UIBezierPath bezierPath];
    [self iteratePathWithBlock:^(CGPathElement element, NSUInteger currentIndex){
        if(currentIndex == elementIndex){
            if(element.type == kCGPathElementMoveToPoint){
                // moveto
                previousEndpoint = element.points[0];
                [outputPath moveToPoint:element.points[0]];
            }else if(element.type == kCGPathElementAddCurveToPoint ){
                // curve
                CGPoint bez[4];
                bez[0] = previousEndpoint;
                bez[1] = element.points[0];
                bez[2] = element.points[1];
                bez[3] = element.points[2];
                
                previousEndpoint = element.points[2];
                
                CGPoint left[4], right[4];
                subdivideBezierAtT(bez, left, right, tValue);
                [outputPath addCurveToPoint:left[3] controlPoint1:left[1] controlPoint2:left[2]];
            }else if(element.type == kCGPathElementAddLineToPoint){
                // line
                CGPoint endPoint = CGPointMake(previousEndpoint.x + tValue * (element.points[0].x - previousEndpoint.x),
                                               previousEndpoint.y + tValue * (element.points[0].y - previousEndpoint.y));
                previousEndpoint = element.points[0];
                [outputPath addLineToPoint:endPoint];
            }
        }else if(currentIndex < elementIndex){
            if(element.type == kCGPathElementMoveToPoint){
                // moveto
                previousEndpoint = element.points[0];
                [outputPath moveToPoint:element.points[0]];
            }else if(element.type == kCGPathElementAddCurveToPoint ){
                // curve
                previousEndpoint = element.points[2];
                [outputPath addCurveToPoint:element.points[2] controlPoint1:element.points[0] controlPoint2:element.points[1]];
            }else if(element.type == kCGPathElementAddLineToPoint){
                // line
                previousEndpoint = element.points[0];
                [outputPath addLineToPoint:element.points[0]];
            }
        }
    }];
    
    return outputPath;
}

+(void) subdivideBezier:(const CGPoint[4])bez intoLeft:(CGPoint[4])bez1 andRight:(CGPoint[4])bez2 atT:(CGFloat)t{
    subdivideBezierAtT(bez, bez1, bez2, t);
}

+(void) subdivideBezier:(const CGPoint[4])bez intoLeft:(CGPoint[4])bez1 andRight:(CGPoint[4])bez2{
    subdivideBezierAtT(bez, bez1, bez2, .5);
}

+(void) subdivideBezier:(const CGPoint[4])bez intoLeft:(CGPoint[4])bez1 andRight:(CGPoint[4])bez2 atLength:(CGFloat)length withAcceptableError:(CGFloat)acceptableError withCache:(CGFloat*) subBezierlengthCache{
    subdivideBezierAtLengthWithCache(bez, bez1, bez2, length, acceptableError,subBezierlengthCache);
}

@end
