//
//  UIBezierPath+Uncached.h
//  PerformanceBezier
//
//  Created by Adam Wulf on 2/6/15.
//
//

#import <UIKit/UIKit.h>

@interface UIBezierPath (Uncached)

#ifdef MMPreventBezierPerformance
-(void) simulateNoBezierCaching;
#endif

@end
