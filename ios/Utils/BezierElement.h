/*
 
 Erica Sadun, http://ericasadun.com
 
 */


#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>

#define NULLPOINT CGRectNull.origin
#define POINT_IS_NULL(_POINT_) CGPointEqualToPoint(_POINT_, NULLPOINT)

@interface BezierElement : NSObject

// Element storage
@property (nonatomic, assign) CGPathElementType elementType;
@property (nonatomic, assign) CGPoint point;
@property (nonatomic, assign) CGPoint controlPoint1;
@property (nonatomic, assign) CGPoint controlPoint2;

// Instance creation
+ (instancetype) elementWithPathElement: (CGPathElement) element;

@end;

