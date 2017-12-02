//
//  UIBezierPath+Clockwise.m
//  PerformanceBezier
//
//  Created by Adam Wulf on 1/7/14.
//  Copyright (c) 2014 Milestone Made, LLC. All rights reserved.
//

#import "UIBezierPath+Clockwise.h"
#import "PerformanceBezier.h"

@implementation UIBezierPath (Clockwise)

-(BOOL) isClockwise{
    
    __block CGPoint lastMoveTo = CGPointZero;
    __block CGPoint lastPoint = CGPointZero;
    __block CGFloat sum = 0;
    [self iteratePathWithBlock:^(CGPathElement element, NSUInteger idx){
        if(element.type == kCGPathElementMoveToPoint){
            lastMoveTo = element.points[0];
            lastPoint = lastMoveTo;
        }else if(element.type == kCGPathElementAddLineToPoint){
            sum += [self calculateAreaFor:element.points[0] andPoint:lastPoint];
            lastPoint = element.points[0];
        }else if(element.type == kCGPathElementAddQuadCurveToPoint){
            sum += [self calculateAreaFor:element.points[0] andPoint:lastPoint];
            sum += [self calculateAreaFor:element.points[1] andPoint:element.points[0]];
            lastPoint = element.points[1];
        }else if(element.type == kCGPathElementAddCurveToPoint){
            sum += [self calculateAreaFor:element.points[0] andPoint:lastPoint];
            sum += [self calculateAreaFor:element.points[1] andPoint:element.points[0]];
            sum += [self calculateAreaFor:element.points[2] andPoint:element.points[1]];
            lastPoint = element.points[2];
        }else if(element.type == kCGPathElementCloseSubpath){
            sum += [self calculateAreaFor:lastMoveTo andPoint:lastPoint];
            lastPoint = element.points[0];
            lastPoint = lastMoveTo;
        }
    }];
    return sum >= 0;
}


- (CGFloat) calculateAreaFor:(CGPoint)point1 andPoint:(CGPoint)point2{
    return (point2.x - point1.x) * (point2.y + point1.y);
}


@end
