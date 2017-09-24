//
//  UIBezierPath+Util.h
//  PerformanceBezier
//
//  Created by Adam Wulf on 5/20/15.
//
//

#import <UIKit/UIKit.h>

@interface UIBezierPath (Util)

+(CGFloat) lengthOfBezier:(const CGPoint[4])bez withAccuracy:(CGFloat)accuracy;

@end

#if defined __cplusplus
extern "C" {
#endif
    
    // simple helper function to return the distance of a point to a line
    CGFloat	distanceOfPointToLine(CGPoint point, CGPoint start, CGPoint end);
    
    // returns the distance between two points
    CGFloat distance(const CGPoint p1, const CGPoint p2);
    
    void	subdivideBezierAtT(const CGPoint bez[4], CGPoint bez1[4], CGPoint bez2[4], CGFloat t);
    
    CGFloat subdivideBezierAtLength (const CGPoint bez[4], CGPoint bez1[4], CGPoint bez2[4], CGFloat length, CGFloat acceptableError);
    
    CGFloat subdivideBezierAtLengthWithCache(const CGPoint bez[4], CGPoint bez1[4], CGPoint bez2[4], CGFloat length, CGFloat acceptableError,
                                             CGFloat* subBezierLengthCache);
    
    CGFloat lengthOfBezier(const  CGPoint bez[4], CGFloat acceptableError);
    
    
    CGPoint lineSegmentIntersection(CGPoint A, CGPoint B, CGPoint C, CGPoint D);
    
    CGPoint bezierTangentAtT(const CGPoint bez[4], CGFloat t);
    
    CGFloat bezierTangent(CGFloat t, CGFloat a, CGFloat b, CGFloat c, CGFloat d);
    
    
    
#if defined __cplusplus
};
#endif

