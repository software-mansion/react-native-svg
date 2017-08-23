//
//  UIBezierPath+NSOSX.h
//  PaintingSample
//
//  Created by Adam Wulf on 10/5/12.
//
//

#import <UIKit/UIKit.h>

@interface UIBezierPath (NSOSX)

// A flattened version of the path object.
@property(nonatomic,readonly) UIBezierPath* bezierPathByFlatteningPath;
// returns the number of elements in this path
@property(nonatomic,readonly) NSInteger elementCount;
// YES if the path is made without curves, NO otherwise
@property(nonatomic,assign) BOOL isFlat;

-(UIBezierPath*) bezierPathByFlatteningPathAndImmutable:(BOOL)returnCopy;

// returns the element at the given index, and also
// fills the points[] array with the element's points.
// the points property of the CGPathElement is owned by
// the internal cache, so if you need the points, you should
// retrieve them through the points parameter.
- (CGPathElement)elementAtIndex:(NSInteger)index associatedPoints:(CGPoint[])points;

// returns the element at the given index. If you also need
// access to the element's points, then use the method above.
- (CGPathElement)elementAtIndex:(NSInteger)index;

// modifies the element at the index to have the input
// points associated with it. This allows modifying the
// path in place
- (void)setAssociatedPoints:(CGPoint[])points atIndex:(NSInteger)index;

// returns the bounds of the path including its control points
-(CGRect) controlPointBounds;

// iterate over each element in the path with the input block
-(void) iteratePathWithBlock:(void (^)(CGPathElement element,NSUInteger idx))block;

// helper method to return the number of points for any input element
// based on its type. ie, an element of type
// kCGPathElementAddCurveToPoint returns 3
+(NSInteger) numberOfPointsForElement:(CGPathElement)element;

// helper method to copy a path element to a new element.
// Note: you are responsible for calling free(yourElement.points)
// when you are done with its return value.
+(CGPathElement*) copyCGPathElement:(CGPathElement*)element;

@end
