//
//  UIBezierPath+Center.m
//  ios-hand-shadows
//
//  Created by Adam Wulf on 2/2/15.
//  Copyright (c) 2015 Milestone Made. All rights reserved.
//

#import "UIBezierPath+Center.h"

@implementation UIBezierPath (Center)


-(CGPoint) center{
    return CGPointMake(CGRectGetMidX(self.bounds), CGRectGetMidY(self.bounds));
}

@end
