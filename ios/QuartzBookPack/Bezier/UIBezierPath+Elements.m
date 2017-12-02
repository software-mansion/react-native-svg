/*
 
 Erica Sadun, http://ericasadun.com
 
 */

#import "UIBezierPath+Elements.h"
#import "BaseGeometry.h"

#pragma mark - Construction

// Return Bezier path built with the supplied elements
UIBezierPath *BezierPathWithElements(NSArray *elements)
{
    UIBezierPath *path = [UIBezierPath bezierPath];
    for (BezierElement *element in elements)
        [element addToPath:path];
    return path;
}


UIBezierPath *InterpolatedPath(UIBezierPath *path)
{
    return BezierPathWithPoints(path.interpolatedPathPoints);
}

#define POINT(_X_) ([(NSValue *)points[_X_] CGPointValue])

// Pass array with NSValue'd CGRect points
UIBezierPath *BezierPathWithPoints(NSArray *points)
{
    UIBezierPath *path = [UIBezierPath bezierPath];
    if (!points.count)
        return path;
    [path moveToPoint:POINT(0)];
    for (int i = 1; i < points.count; i++)
        [path addLineToPoint:POINT(i)];
    [path closePath];
    return path;
}

#pragma mark - Partial Path

UIBezierPath *CroppedPath(UIBezierPath *path, CGFloat percent)
{
    NSArray *elements = path.elements;
    if (elements.count == 0) return path;
    
    int targetCount = elements.count * percent;
    NSArray *targetElements = [elements subarrayWithRange:NSMakeRange(0, targetCount)];
    UIBezierPath *outputPath = BezierPathWithElements(targetElements);
    return outputPath;
}

UIBezierPath *PathFromPercentToPercent(UIBezierPath *path, CGFloat startPercent, CGFloat endPercent)
{
    NSArray *elements = path.elements;
    if (elements.count == 0) return path;
    
    int targetCount = elements.count * endPercent;
    NSArray *targetElements = [elements subarrayWithRange:NSMakeRange(0, targetCount)];
    UIBezierPath *outputPath = BezierPathWithElements(targetElements);
    return outputPath;
}

#pragma mark - Bezier Elements Category -

@implementation UIBezierPath (Elements)

// Convert one element to BezierElement and save to array
void GetBezierElements(void *info, const CGPathElement *element)
{
    NSMutableArray *bezierElements = (__bridge NSMutableArray *)info;
    if (element)
        [bezierElements addObject:[BezierElement elementWithPathElement:*element]];
}

// Retrieve array of component elements
- (NSArray *) elements
{
    NSMutableArray *elements = [NSMutableArray array];
    CGPathApply(self.CGPath, (__bridge void *)elements, GetBezierElements);
    return elements;
}

#pragma mark - Subpaths
// Subpaths must be well defined
- (NSMutableArray *) subpaths
{
    NSMutableArray *results = [NSMutableArray array];
    UIBezierPath *current = nil;
    NSArray *elements = self.elements;
    
    for (BezierElement *element in elements)
    {
        if (element.elementType == kCGPathElementCloseSubpath)
        {
            [current closePath];
            if (current)
                [results addObject:current];
            current = nil;
            continue;
        }
        
        if (element.elementType == kCGPathElementMoveToPoint)
        {
            if (current)
                [results addObject:current];
            
            current = [UIBezierPath bezierPath];
            [current moveToPoint:element.point];
            continue;
        }
        
        if (current)
            [element addToPath:current];
        else
        {
            NSLog(@"Error: cannot add element to nil path: %@", element.stringValue);
            continue;
        }
    }
    
    if (current)
        [results addObject:current];
    
    return results;
}


// Only collect those points that have destinations
- (NSArray *) destinationPoints
{
    NSMutableArray *array = [NSMutableArray array];
    NSArray *elements = self.elements;
    
    for (BezierElement *element in elements)
        if (!POINT_IS_NULL(element.point))
            [array addObject:[NSValue valueWithCGPoint:element.point]];
    
    return array;
}

// Points and interpolated points
- (NSArray *) interpolatedPathPoints
{
    NSMutableArray *points = [NSMutableArray array];
    BezierElement *current = nil;
    int overkill = 3;
    for (BezierElement *element in self.elements)
    {
        switch (element.elementType)
        {
            case kCGPathElementMoveToPoint:
            case kCGPathElementAddLineToPoint:
                [points addObject:[NSValue valueWithCGPoint:element.point]];
                current = element;
                break;
            case kCGPathElementCloseSubpath:
                current = nil;
                break;
            case kCGPathElementAddCurveToPoint:
            {
                for (int i = 1; i < NUMBER_OF_BEZIER_SAMPLES * overkill; i++)
                {
                    CGFloat percent = (CGFloat) i / (CGFloat) (NUMBER_OF_BEZIER_SAMPLES * overkill);
                    CGPoint p = CubicBezierPoint(percent, current.point, element.controlPoint1, element.controlPoint2, element.point);
                    [points addObject:[NSValue valueWithCGPoint:p]];
                }
                [points addObject:[NSValue valueWithCGPoint:element.point]];
                current = element;
                break;
            }
            case kCGPathElementAddQuadCurveToPoint:
            {
                for (int i = 1; i < NUMBER_OF_BEZIER_SAMPLES * overkill; i++)
                {
                    CGFloat percent = (CGFloat) i / (CGFloat) (NUMBER_OF_BEZIER_SAMPLES * overkill);
                    CGPoint p = QuadBezierPoint(percent, current.point, element.controlPoint1, element.point);
                    [points addObject:[NSValue valueWithCGPoint:p]];
                }
                [points addObject:[NSValue valueWithCGPoint:element.point]];
                current = element;
                break;
            }
        }
    }
    return points;
}

#pragma mark - Array Access

- (NSUInteger) count
{
    return self.elements.count;
}

- (id)objectAtIndexedSubscript:(NSUInteger)idx
{
    NSArray *elements = self.elements;
    if (idx >= elements.count)
        return nil;
    return elements[idx];
}

#pragma mark - Geometry Workaround
- (CGRect) calculatedBounds
{
    // Thank you Ryan Petrich
    return CGPathGetPathBoundingBox(self.CGPath);
}

// Return center of bounds
- (CGPoint) center
{
    return RectGetCenter(self.calculatedBounds);
}

#pragma mark - Reversal Workaround
- (UIBezierPath *) reverseSubpath: (UIBezierPath *) subpath
{
    NSArray *elements = subpath.elements;
    NSArray *reversedElements = [[elements reverseObjectEnumerator] allObjects];
    
    UIBezierPath *newPath = [UIBezierPath bezierPath];
    CopyBezierState(self, newPath);
    BOOL closesSubpath = NO;

    BezierElement *firstElement;
    for (BezierElement *e in elements)
    {
        if (!POINT_IS_NULL(e.point))
        {
            firstElement = e;
            break;
        }
    }

    BezierElement *lastElement;
    for (BezierElement *e in reversedElements)
    {
        if (!POINT_IS_NULL(e.point))
        {
            lastElement = e;
            break;
        }
    }
    
    BezierElement *element = [elements lastObject];
    if (element.elementType == kCGPathElementCloseSubpath)
    {
        if (firstElement)
            [newPath moveToPoint:firstElement.point];
        
        if (lastElement)
            [newPath addLineToPoint:lastElement.point];
        
        closesSubpath = YES;
    }
    else
    {
        [newPath moveToPoint:lastElement.point];
    }

    CFIndex i = 0;
    for (BezierElement *element in reversedElements)
    {
        i++;
        BezierElement *nextElement = nil;
        BezierElement *workElement = [element copy];
        
        if (element.elementType == kCGPathElementCloseSubpath)
            continue;

        if (element == firstElement)
        {
            if (closesSubpath) [newPath closePath];
            continue;
        }        
        
        if (i < reversedElements.count)
        {
            nextElement = reversedElements[i];
            if (!POINT_IS_NULL(workElement.controlPoint2))
            {
                CGPoint tmp = workElement.controlPoint1;
                workElement.controlPoint1 = workElement.controlPoint2;
                workElement.controlPoint2 = tmp;
            }
            workElement.point = nextElement.point;
        }
        
        if (element.elementType == kCGPathElementMoveToPoint)
            workElement.elementType = kCGPathElementAddLineToPoint;
        
        [workElement addToPath:newPath];
    }
    
    return newPath;

}

- (UIBezierPath *) reversed
{
    // [self bezierPathByReversingPath] seriously does not work the
    // way you expect. Radars are filed.
    
    UIBezierPath *reversed = [UIBezierPath bezierPath];
    NSArray *reversedSubpaths = [[self.subpaths reverseObjectEnumerator] allObjects];
    
    for (UIBezierPath *subpath in reversedSubpaths)
    {
        UIBezierPath *p = [self reverseSubpath:subpath];
        if (p)
            [reversed appendPath:p];
    }
    return reversed;
}

#pragma mark - Closing
- (BOOL) subpathIsClosed
{
    NSArray *elements = self.elements;
    
    // A legal closed path must contain 3 elements
    // move, add, close
    if (elements.count < 3)
        return NO;
    
    BezierElement *element = [elements lastObject];
    return element.elementType == kCGPathElementCloseSubpath;
}

- (BOOL) closeSafely
{
    NSArray *elements = self.elements;
    if (elements.count < 2)
        return NO;
    
    BezierElement *element = [elements lastObject];
    if (element.elementType != kCGPathElementCloseSubpath)
    {
        [self closePath];
        return YES;
    }
    
    return NO;
}


#pragma mark - Show the Code
- (void) showTheCode
{
    
    printf("\n- (UIBezierPath *) buildBezierPath\n");
    printf("{\n");
    printf("    UIBezierPath *path = [UIBezierPath bezierPath];\n\n");
    
    NSArray *elements = self.elements;
    for (BezierElement *element in elements)
        [element showTheCode];
    
    printf("    return path;\n");
    printf("}\n\n");
}

- (NSString *) stringValue
{
    NSMutableString *string = [NSMutableString stringWithString:@"\n"];
    NSArray *elements = self.elements;
    for (BezierElement *element in elements)
        [string appendFormat:@"%@\n", element.stringValue];
    
    return string;
}

#pragma mark - Transformations
// Project point from native to dest
CGPoint adjustPoint(CGPoint p, CGRect native, CGRect dest)
{
    CGFloat scaleX = dest.size.width / native.size.width;
    CGFloat scaleY = dest.size.height / native.size.height;
    
    CGPoint point = PointSubtractPoint(p, native.origin);
    point.x *= scaleX;
    point.y *= scaleY;
    CGPoint destPoint = PointAddPoint(point, dest.origin);
    
    return destPoint;
}

// Adjust points by applying block to each element
- (UIBezierPath *) adjustPathElementsWithBlock: (PathBlock) block
{
    UIBezierPath *path = [UIBezierPath bezierPath];
    if (!block)
    {
        [path appendPath:self];
        return path;
    }

    for (BezierElement *element in self.elements)
        [[element elementByApplyingBlock:block] addToPath:path];
    
    return path;
}

// Apply transform
- (UIBezierPath *) pathApplyTransform: (CGAffineTransform) transform
{
    UIBezierPath *copy = [UIBezierPath bezierPath];
    [copy appendPath:self];
    
    CGRect bounding = self.calculatedBounds;
    CGPoint center = RectGetCenter(bounding);
    CGAffineTransform t = CGAffineTransformIdentity;
    t = CGAffineTransformTranslate(t, center.x, center.y);
    t = CGAffineTransformConcat(transform, t);
    t = CGAffineTransformTranslate(t, -center.x, -center.y);
    [copy applyTransform:t];
    
    return copy;
}

- (CGFloat) pathLength
{
    NSArray *elements = self.elements;
    CGPoint current = NULLPOINT;
    CGPoint firstPoint = NULLPOINT;
    float totalPointLength = 0.0f;
    
    for (BezierElement *element in elements)
    {
        totalPointLength += ElementDistanceFromPoint(element, current, firstPoint);
        
        if (element.elementType == kCGPathElementMoveToPoint)
            firstPoint = element.point;
        else if (element.elementType == kCGPathElementCloseSubpath)
            firstPoint = NULLPOINT;
        
        if (element.elementType != kCGPathElementCloseSubpath)
            current = element.point;
    }

    return totalPointLength;
}


// Retrieve the point and slope at a given percent offset -- This is expensive
- (CGPoint) pointAtPercent: (CGFloat) percent withSlope: (CGPoint *) slope
{
    NSArray *elements = self.elements;
    
    if (percent == 0.0f)
    {
        BezierElement *first = [elements objectAtIndex:0];
        return first.point;
    }
    
    float pathLength = self.pathLength;
    float totalDistance = 0.0f;
    
    CGPoint current = NULLPOINT;
    CGPoint firstPoint = NULLPOINT;

    for (BezierElement *element in elements)
    {
        float distance = ElementDistanceFromPoint(element, current, firstPoint);
        CGFloat proposedTotalDistance = totalDistance + distance;
        CGFloat proposedPercent = proposedTotalDistance / pathLength;
        
        if (proposedPercent < percent)
        {
            // consume and continue
            totalDistance = proposedTotalDistance;
            
            if (element.elementType == kCGPathElementMoveToPoint)
                firstPoint = element.point;

            current = element.point;

            continue;
        }
        
        // What percent between p1 and p2?
        CGFloat currentPercent = totalDistance / pathLength;
        CGFloat dPercent = percent - currentPercent;
        CGFloat percentDistance = dPercent * pathLength;
        CGFloat targetPercent = percentDistance / distance;
        
        // Return result
        CGPoint point = InterpolatePointFromElement(element, current, firstPoint, targetPercent, slope);
        return point;
    }
    
    return NULLPOINT;
}

#pragma mark - Inverses
- (UIBezierPath *) inverseInRect: (CGRect) rect
{
    UIBezierPath *path = [UIBezierPath bezierPath];
    CopyBezierState(self, path);
    [path appendPath:self];
    [path appendPath:[UIBezierPath bezierPathWithRect:rect]];
    path.usesEvenOddFillRule = YES;
    return path;
}

- (UIBezierPath *) inverse
{
    return [self inverseInRect:CGRectInfinite];
}

- (UIBezierPath *) boundedInverse
{
    return [self inverseInRect:self.bounds];
}
@end
