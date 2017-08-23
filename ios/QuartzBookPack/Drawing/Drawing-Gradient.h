/*
 
 Erica Sadun, http://ericasadun.com
 
 */

#import <Foundation/Foundation.h>
#import "BezierFunctions.h"

#define COLOR_LEVEL(_selector_, _alpha_) [([UIColor _selector_])colorWithAlphaComponent:_alpha_]
#define WHITE_LEVEL(_amt_, _alpha_) [UIColor colorWithWhite:(_amt_) alpha:(_alpha_)]

// Gradient drawing styles
#define LIMIT_GRADIENT_EXTENT 0
#define BEFORE_START kCGGradientDrawsBeforeStartLocation
#define AFTER_END kCGGradientDrawsAfterEndLocation
#define KEEP_DRAWING kCGGradientDrawsAfterEndLocation | kCGGradientDrawsBeforeStartLocation

typedef __attribute__((NSObject)) CGGradientRef GradientObject;

@interface Gradient : NSObject
@property (nonatomic, readonly) CGGradientRef gradient;
+ (instancetype) gradientWithColors: (NSArray *) colors locations: (NSArray *) locations;
+ (instancetype) gradientFrom: (UIColor *) color1 to: (UIColor *) color2;

+ (instancetype) rainbow;
+ (instancetype) linearGloss:(UIColor *) color;
+ (instancetype) gradientUsingInterpolationBlock: (InterpolationBlock) block between: (UIColor *) c1 and: (UIColor *) c2;
+ (instancetype) easeInGradientBetween: (UIColor *) c1 and:(UIColor *) c2;
+ (instancetype) easeInOutGradientBetween: (UIColor *) c1 and:(UIColor *) c2;
+ (instancetype) easeOutGradientBetween: (UIColor *) c1 and:(UIColor *) c2;

- (void) drawFrom:(CGPoint) p1 toPoint: (CGPoint) p2 style: (int) mask;
- (void) drawRadialFrom:(CGPoint) p1 toPoint: (CGPoint) p2 radii: (CGPoint) radii style: (int) mask;

- (void) drawTopToBottom: (CGRect) rect;
- (void) drawBottomToTop: (CGRect) rect;
- (void) drawLeftToRight: (CGRect) rect;
- (void) drawFrom:(CGPoint) p1 toPoint: (CGPoint) p2;
- (void) drawAlongAngle: (CGFloat) angle in:(CGRect) rect;

- (void) drawBasicRadial: (CGRect) rect;
- (void) drawRadialFrom: (CGPoint) p1 toPoint: (CGPoint) p2;
@end;
