//
//  UIBezierPath+FirstLast.m
//  iOS-UIBezierPath-Performance
//
//  Created by Adam Wulf on 2/1/15.
//
//

#import "UIBezierPath+FirstLast.h"
#import "UIBezierPath+NSOSX.h"

@implementation UIBezierPath (FirstLast)

-(CGPoint) lastPointCalculated{
    __block CGPoint firstPoint = CGPointZero;
    __block CGPoint lastPoint = CGPointZero;
    [self iteratePathWithBlock:^(CGPathElement element, NSUInteger idx) {
        CGPoint currPoint = CGPointZero;
        if(element.type == kCGPathElementMoveToPoint){
            currPoint = element.points[0];
            firstPoint = currPoint;
        }else if(element.type == kCGPathElementAddLineToPoint){
            currPoint = element.points[0];
        }else if(element.type == kCGPathElementCloseSubpath){
            currPoint = firstPoint;
        }else if(element.type == kCGPathElementAddCurveToPoint){
            currPoint = element.points[2];
        }else if(element.type == kCGPathElementAddQuadCurveToPoint){
            currPoint = element.points[1];
        }
        if(idx == 0){
            // path should've begun with a moveTo,
            // but this is a sanity check for malformed
            // paths
            firstPoint = currPoint;
        }
        lastPoint = currPoint;
    }];
    return lastPoint;
}

-(CGPoint) firstPointCalculated{
    __block CGPoint firstPoint = CGPointZero;
    [self iteratePathWithBlock:^(CGPathElement element, NSUInteger idx) {
        if(idx == 0){
            if(element.type == kCGPathElementMoveToPoint ||
               element.type == kCGPathElementAddLineToPoint){
                firstPoint = element.points[0];
            }else if(element.type == kCGPathElementCloseSubpath){
                firstPoint = firstPoint;
            }else if(element.type == kCGPathElementAddCurveToPoint){
                firstPoint = element.points[2];
            }else if(element.type == kCGPathElementAddQuadCurveToPoint){
                firstPoint = element.points[1];
            }
        }
    }];
    return firstPoint;
}

@end
