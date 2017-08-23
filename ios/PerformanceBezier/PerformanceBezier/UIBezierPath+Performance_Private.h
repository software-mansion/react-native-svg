//
//  UIBezierPath+Performance_Private.h
//  PerformanceBezier
//
//  Created by Adam Wulf on 10/16/12.
//  Copyright (c) 2012 Milestone Made, LLC. All rights reserved.
//

#ifndef PerformanceBezier_UIBezierPath_Performance_Private_h
#define PerformanceBezier_UIBezierPath_Performance_Private_h

#import "UIBezierPathProperties.h"

@interface UIBezierPath (Performance_Private)

// helper functions for finding points and tangents
// on a bezier curve
CGPoint	bezierPointAtT(const CGPoint bez[4], CGFloat t);
CGPoint bezierTangentAtT(const CGPoint bez[4], CGFloat t);
CGFloat bezierTangent(CGFloat t, CGFloat a, CGFloat b, CGFloat c, CGFloat d);
CGFloat dotProduct(const CGPoint p1, const CGPoint p2);

@end


#endif
