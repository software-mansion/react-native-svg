//
//  UIBezierPath+Performance.h
//  PerformanceBezier
//
//  Created by Adam Wulf on 1/31/15.
//  Copyright (c) 2015 Milestone Made, LLC. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "UIBezierPathProperties.h"

CGPoint bezierPointAtT(const CGPoint bez[4], CGFloat t);

@interface UIBezierPath (Performance)

-(UIBezierPathProperties*) pathProperties;

// returns the last point of the bezier path.
// if the path ends with a kCGPathElementClosed,
// then the first point of that subpath is returned
-(CGPoint) lastPoint;

// returns the first point of the bezier path
-(CGPoint) firstPoint;

// returns the tangent at the very end of the path
// in radians
-(CGFloat) tangentAtEnd;

// returns YES if the path is closed (or contains at least 1 closed subpath)
// returns NO otherwise
-(BOOL) isClosed;

// returns the tangent of the bezier path at the given t value
- (CGPoint) tangentOnPathAtElement:(NSInteger)elementIndex andTValue:(CGFloat)tVal;

// for the input bezier curve [start, ctrl1, ctrl2, end]
// return the point at the input T value
+(CGPoint) pointAtT:(CGFloat)t forBezier:(CGPoint*)bez;

// for the input bezier curve [start, ctrl1, ctrl2, end]
// return the tangent at the input T value
+(CGPoint) tangentAtT:(CGFloat)t forBezier:(CGPoint*)bez;

// fill the input point array with [start, ctrl1, ctrl2, end]
// for the element at the given index
-(void) fillBezier:(CGPoint[4])bezier forElement:(NSInteger)elementIndex;

@end
