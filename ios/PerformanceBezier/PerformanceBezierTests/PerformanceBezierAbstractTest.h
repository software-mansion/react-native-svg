//
//  PerformanceBezierAbstractTest.h
//  PerformanceBezier
//
//  Created by Adam Wulf on 11/20/13.
//  Copyright (c) 2013 Milestone Made, LLC. All rights reserved.
//

#import "PerformanceBezier.h"

@interface PerformanceBezierAbstractTest : XCTestCase

@property (nonatomic, readonly) UIBezierPath* complexShape;

-(CGFloat) round:(CGFloat)val to:(int)digits;

-(BOOL) point:(CGPoint)p1 isNearTo:(CGPoint)p2;

-(BOOL) checkTanPoint:(CGFloat) f1 isLessThan:(CGFloat)f2;
-(BOOL) check:(CGFloat) f1 isLessThan:(CGFloat)f2 within:(CGFloat)marginOfError;

@end

