//
//  UIBezierPath+Clockwise.h
//  PerformanceBezier
//
//  Created by Adam Wulf on 1/7/14.
//  Copyright (c) 2014 Milestone Made, LLC. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIBezierPath (Clockwise)

//
// returns YES if the path elements curve
// around in clockwise direction
-(BOOL) isClockwise;

@end
