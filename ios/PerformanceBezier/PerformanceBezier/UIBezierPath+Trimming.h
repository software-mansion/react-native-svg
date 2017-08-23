//
//  UIBezierPath+DKFix.h
//  ClippingBezier
//
//  Created by Adam Wulf on 5/9/15.
//
//

#import <UIKit/UIKit.h>

@interface UIBezierPath (Trimming)

-(void) appendPathRemovingInitialMoveToPoint:(UIBezierPath*)otherPath;

-(NSArray*) subPaths;

-(NSInteger) countSubPaths;

- (NSInteger) subpathIndexForElement:(NSInteger) element;

- (CGFloat) length;

- (CGFloat) tangentAtStart;

- (CGFloat) tangentAtStartOfSubpath:(NSInteger)index;

- (UIBezierPath*) bezierPathByTrimmingFromLength:(CGFloat)trimLength;

- (UIBezierPath*) bezierPathByTrimmingToLength:(CGFloat)trimLength;

- (UIBezierPath*) bezierPathByTrimmingToLength:(CGFloat)trimLength withMaximumError:(CGFloat)err;

@end
