/*
 
 Erica Sadun, http://ericasadun.com
 
 */

#import <Foundation/Foundation.h>
#import "Bezier.h"

// Construct path
UIBezierPath *BezierPathWithElements(NSArray *elements);
UIBezierPath *BezierPathWithPoints(NSArray *points);
UIBezierPath *InterpolatedPath(UIBezierPath *path);

// Partial paths
UIBezierPath *CroppedPath(UIBezierPath *path, CGFloat percent);
UIBezierPath *PathFromPercentToPercent(UIBezierPath *path, CGFloat startPercent, CGFloat endPercent);

/*

 UIBezierPath - Elements Category
 
 */

@interface UIBezierPath (Elements)

@property (nonatomic, readonly) NSArray *elements;
@property (nonatomic, readonly) NSArray *subpaths;

@property (nonatomic, readonly) NSArray *destinationPoints;
@property (nonatomic, readonly) NSArray *interpolatedPathPoints;

@property (nonatomic, readonly) NSUInteger count;
- (id)objectAtIndexedSubscript:(NSUInteger)idx;

@property (nonatomic, readonly) CGPoint center;
@property (nonatomic, readonly) CGRect calculatedBounds;

@property (nonatomic, readonly) UIBezierPath *reversed;
@property (nonatomic, readonly) UIBezierPath *inverse;
@property (nonatomic, readonly) UIBezierPath *boundedInverse;

@property (nonatomic, readonly) BOOL subpathIsClosed;
- (BOOL) closeSafely;

// Measure length
@property (nonatomic, readonly) CGFloat pathLength;
- (CGPoint) pointAtPercent: (CGFloat) percent withSlope: (CGPoint *) slope;

// String Representations
- (void) showTheCode;
- (NSString *) stringValue;

// -- Invert path to arbitrary rectangle
- (UIBezierPath *) inverseInRect: (CGRect) rect;
@end