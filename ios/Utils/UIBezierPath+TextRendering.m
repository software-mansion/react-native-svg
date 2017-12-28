//
//  UIBezierPath+TextRendering.m
//  RNSVG
//
//  Created by Mikael Sand on 27/12/2017.
//

#import "UIBezierPath+TextRendering.h"
#import "BezierElement.h"

static CGFloat idealFlatness = .01;

/**
 * returns the distance between two points
 */
CGFloat distance(CGPoint p1, CGPoint p2)
{
    CGFloat dx = p2.x - p1.x;
    CGFloat dy = p2.y - p1.y;

    return sqrt(dx*dx + dy*dy);
}

/**
 * returns the dot product of two coordinates
 */
CGFloat dotProduct(const CGPoint p1, const CGPoint p2) {
    return p1.x * p2.x + p1.y * p2.y;
}

/**
 * returns the shortest distance from a point to a line
 */
CGFloat distanceOfPointToLine(CGPoint point, CGPoint start, CGPoint end){
    CGPoint v = CGPointMake(end.x - start.x, end.y - start.y);
    CGPoint w = CGPointMake(point.x - start.x, point.y - start.y);
    CGFloat c1 = dotProduct(w, v);
    CGFloat c2 = dotProduct(v, v);
    CGFloat d;
    if (c1 <= 0) {
        d = distance(point, start);
    }
    else if (c2 <= c1) {
        d = distance(point, end);
    }
    else {
        CGFloat b = c1 / c2;
        CGPoint Pb = CGPointMake(start.x + b * v.x, start.y + b * v.y);
        d = distance(point, Pb);
    }
    return d;
}

/**
 * calculate the point on a bezier at time t
 * where 0 < t < 1
 */
CGPoint bezierPointAtT(const CGPoint bez[4], CGFloat t)
{
    CGPoint q;
    CGFloat mt = 1 - t;

    CGPoint bez1[4];
    CGPoint bez2[4];

    q.x = mt * bez[1].x + t * bez[2].x;
    q.y = mt * bez[1].y + t * bez[2].y;
    bez1[1].x = mt * bez[0].x + t * bez[1].x;
    bez1[1].y = mt * bez[0].y + t * bez[1].y;
    bez2[2].x = mt * bez[2].x + t * bez[3].x;
    bez2[2].y = mt * bez[2].y + t * bez[3].y;

    bez1[2].x = mt * bez1[1].x + t * q.x;
    bez1[2].y = mt * bez1[1].y + t * q.y;
    bez2[1].x = mt * q.x + t * bez2[2].x;
    bez2[1].y = mt * q.y + t * bez2[2].y;

    bez1[3].x = bez2[0].x = mt * bez1[2].x + t * bez2[1].x;
    bez1[3].y = bez2[0].y = mt * bez1[2].y + t * bez2[1].y;

    return CGPointMake(bez1[3].x, bez1[3].y);
}

// Subdivide a Bézier (specific division)
void subdivideBezierAtT(const CGPoint bez[4], CGPoint bez1[4], CGPoint bez2[4], CGFloat t)
{
    CGPoint q;
    CGFloat mt = 1 - t;

    bez1[0].x = bez[0].x;
    bez1[0].y = bez[0].y;
    bez2[3].x = bez[3].x;
    bez2[3].y = bez[3].y;

    q.x = mt * bez[1].x + t * bez[2].x;
    q.y = mt * bez[1].y + t * bez[2].y;
    bez1[1].x = mt * bez[0].x + t * bez[1].x;
    bez1[1].y = mt * bez[0].y + t * bez[1].y;
    bez2[2].x = mt * bez[2].x + t * bez[3].x;
    bez2[2].y = mt * bez[2].y + t * bez[3].y;

    bez1[2].x = mt * bez1[1].x + t * q.x;
    bez1[2].y = mt * bez1[1].y + t * q.y;
    bez2[1].x = mt * q.x + t * bez2[2].x;
    bez2[1].y = mt * q.y + t * bez2[2].y;

    bez1[3].x = bez2[0].x = mt * bez1[2].x + t * bez2[1].x;
    bez1[3].y = bez2[0].y = mt * bez1[2].y + t * bez2[1].y;
}

void addLine(CGPoint *last, const CGPoint *next, NSMutableArray *lines, CGFloat *length, NSMutableArray *lengths) {
    NSArray *line = @[[NSValue valueWithCGPoint:*last], [NSValue valueWithCGPoint:*next]];
    [lines addObject:line];
    *length += distance(*last, *next);
    [lengths addObject:[NSNumber numberWithDouble:*length]];
    *last = *next;
}

// Convert one element to BezierElement and save to array
void GetBezierElements(void *info, const CGPathElement *element)
{
    NSMutableArray *bezierElements = (__bridge NSMutableArray *)info;
    if (element)
        [bezierElements addObject:[BezierElement elementWithPathElement:*element]];
}

@implementation UIBezierPath (TextRendering)

// Retrieve array of component elements
- (NSArray *) elements
{
    NSMutableArray *elements = [NSMutableArray array];
    CGPathApply(self.CGPath, (__bridge void *)elements, GetBezierElements);
    return elements;
}

- (void (^)(CGFloat *, NSInteger *, NSMutableArray *, NSMutableArray *, BOOL *)) getTextProperties{
    return ^(CGFloat *lengthP, NSInteger *lineCountP, NSMutableArray * lengths, NSMutableArray * lines, BOOL *isClosedP) {
        CGPoint origin = CGPointMake (0.0, 0.0);
        CGPoint last = CGPointMake (0.0, 0.0);
        NSInteger lineCount = 0;
        CGFloat length = 0;
        BOOL isClosed = NO;
        NSArray * elements = self.elements;
        for (BezierElement *element in elements) {
            switch (element.elementType)
            {
                case kCGPathElementMoveToPoint:
                    origin = last = element.point;
                    break;

                case kCGPathElementAddLineToPoint: {
                    CGPoint next = element.point;
                    addLine(&last, &next, lines, &length, lengths);
                    lineCount++;
                    break;
                }

                case kCGPathElementAddQuadCurveToPoint:
                case kCGPathElementAddCurveToPoint:
                {
                    // handle both curve types gracefully
                    CGPoint curveTo;
                    CGPoint ctrl1;
                    CGPoint ctrl2;
                    if (element.elementType == kCGPathElementAddQuadCurveToPoint) {
                        curveTo = element.point;
                        ctrl1 = element.controlPoint1;
                        ctrl2 = ctrl1;
                    } else if (element.elementType == kCGPathElementAddCurveToPoint) {
                        curveTo = element.point;
                        ctrl1 = element.controlPoint1;
                        ctrl2 = element.controlPoint2;
                    } else {
                        break;
                    }

                    // this is the bezier for our current element
                    CGPoint bezier[4] = { last, ctrl1, ctrl2, curveTo };
                    NSValue *arr = [NSValue valueWithBytes:&bezier objCType:@encode(CGPoint[4])];
                    NSMutableArray *curves = [NSMutableArray arrayWithObjects:arr, nil];

                    NSInteger count = 1;
                    while (count-- > 0) {
                        CGPoint bez[4];
                        [curves[count] getValue:&bez];
                        [curves removeLastObject];

                        // calculate the error rate of the curve vs
                        // a line segement between the start and end points
                        CGPoint onCurve = bezierPointAtT(bez, .5);
                        CGPoint next = bez[3];
                        CGFloat error = distanceOfPointToLine(onCurve, last, next);

                        // if the error is less than our accepted level of error
                        // then add a line, else, split the curve in half
                        if (error <= idealFlatness) {
                            addLine(&last, &next, lines, &length, lengths);
                            lineCount++;
                        } else {
                            CGPoint bez1[4], bez2[4];
                            subdivideBezierAtT(bez, bez1, bez2, .5);
                            [curves addObject:[NSValue valueWithBytes:&bez2 objCType:@encode(CGPoint[4])]];
                            [curves addObject:[NSValue valueWithBytes:&bez1 objCType:@encode(CGPoint[4])]];
                            count += 2;
                        }
                    }
                    last = curveTo;
                    break;
                }

                case kCGPathElementCloseSubpath: {
                    CGPoint next = origin;
                    addLine(&last, &next, lines, &length, lengths);
                    lineCount++;
                    isClosed = YES;
                    break;
                }

                default:
                    break;
            }
        }
        *lineCountP = lineCount;
        *isClosedP = isClosed;
        *lengthP = length;
    };
}
@end

