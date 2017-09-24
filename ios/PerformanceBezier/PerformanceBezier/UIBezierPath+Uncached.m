//
//  UIBezierPath+Uncached.m
//  PerformanceBezier
//
//  Created by Adam Wulf on 2/6/15.
//
//

#import "UIBezierPath+Uncached.h"
#import "UIBezierPath+NSOSX.h"

@implementation UIBezierPath (Uncached)


#ifdef MMPreventBezierPerformance
-(void) simulateNoBezierCaching{
    [self iteratePathWithBlock:^(CGPathElement ele, NSUInteger idx){
        // noop
    }];
}
#endif

@end
