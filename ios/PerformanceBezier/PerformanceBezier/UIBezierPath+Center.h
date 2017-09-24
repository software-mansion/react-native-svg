//
//  UIBezierPath+Center.h
//  ios-hand-shadows
//
//  Created by Adam Wulf on 2/2/15.
//  Copyright (c) 2015 Milestone Made. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIBezierPath (Center)

// returns a point in the center of
// the path's bounds
-(CGPoint) center;

@end
