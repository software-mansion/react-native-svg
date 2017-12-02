//
//  UIBezierPath+Ahmed.h
//  PerformanceBezier
//
//  Created by Adam Wulf on 10/6/12.
//  Copyright (c) 2012 Milestone Made, LLC. All rights reserved.
//
//
//
//
// This category is motivated by the masters thesis of Athar Ahmad
// available at http://www.cis.usouthal.edu/~hain/general/Theses/Ahmad_thesis.pdf
//
// More information available at
// http://www.cis.usouthal.edu/~hain/general/Thesis.htm
//
// subdivide code license in included SubdiviceLicense file

#import <UIKit/UIKit.h>
#include <math.h>



@interface UIBezierPath (Trim)

-(UIBezierPath*) bezierPathByTrimmingElement:(NSInteger)elementIndex fromTValue:(double)fromTValue toTValue:(double)toTValue;
-(UIBezierPath*) bezierPathByTrimmingToElement:(NSInteger)elementIndex andTValue:(double)tValue;
-(UIBezierPath*) bezierPathByTrimmingFromElement:(NSInteger)elementIndex andTValue:(double)tValue;

+(void) subdivideBezier:(const CGPoint[4])bez intoLeft:(CGPoint[4])bez1 andRight:(CGPoint[4])bez2 atT:(CGFloat)t;

+(void) subdivideBezier:(const CGPoint[4])bez intoLeft:(CGPoint[4])bez1 andRight:(CGPoint[4])bez2 atLength:(CGFloat)length withAcceptableError:(CGFloat)acceptableError withCache:(CGFloat*) subBezierlengthCache;


@end
