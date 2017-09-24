//
//  UIBezierPath+FirstLast.h
//  iOS-UIBezierPath-Performance
//
//  Created by Adam Wulf on 2/1/15.
//
//

#import <UIKit/UIKit.h>

@interface UIBezierPath (FirstLast)

// calculates the first point of the path,
// useful if its not already cached
-(CGPoint) lastPointCalculated;

// calculates the last point of the path,
// useful if its not already cached
-(CGPoint) firstPointCalculated;

@end
