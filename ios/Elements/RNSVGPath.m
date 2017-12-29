/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGPath.h"
#import "BezierElement.h"

/* Bezier logic from PerformanceBezier */
/*

 ## License

 <a rel="license" href="http://creativecommons.org/licenses/by/3.0/us/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/3.0/us/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/3.0/us/">Creative Commons Attribution 3.0 United States License</a>.

 For attribution, please include:

 1. Mention original author "Adam Wulf for Loose Leaf app"
 2. Link to https://getlooseleaf.com/opensource/
 3. Link to https://github.com/adamwulf/PerformanceBezier

 */
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
/*
 * (c) 2004 Alastair J. Houghton
 * All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   1. Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *
 *   2. Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *
 *   3. The name of the author of this software may not be used to endorse
 *      or promote products derived from the software without specific prior
 *      written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER "AS IS" AND ANY EXPRESS
 * OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE COPYRIGHT OWNER BE LIABLE FOR ANY DIRECT, INDIRECT,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */
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

@implementation RNSVGPath
{
    CGPathRef _path;
    NSMutableArray *lengths;
    NSMutableArray *lines;
    NSInteger lineCount;
    CGFloat length;
    BOOL isClosed;
    BOOL cached;
}

- (void)getPathLength:(CGFloat*)lengthP lineCount:(NSInteger*)lineCountP lengths:(NSArray* __strong *)lengthsP lines:(NSArray* __strong *)linesP isClosed:(BOOL*)isClosedP
{
    if (!cached) {
        CGPoint origin = CGPointMake (0.0, 0.0);
        CGPoint last = CGPointMake (0.0, 0.0);
        lengths = [NSMutableArray array];
        lines = [NSMutableArray array];
        isClosed = NO;
        lineCount = 0;
        length = 0;

        NSArray *elements = [_d getBezierCurves];
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
                    CGPoint curveTo = element.point;
                    CGPoint ctrl1 = element.controlPoint1;
                    CGPoint ctrl2 = element.elementType == kCGPathElementAddQuadCurveToPoint ? ctrl1 : element.controlPoint2;

                    // this is the bezier for our current element
                    CGPoint bezier[4] = { last, ctrl1, ctrl2, curveTo };
                    NSValue *arr = [NSValue valueWithBytes:&bezier objCType:@encode(CGPoint[4])];
                    NSMutableArray *curves = [NSMutableArray arrayWithObjects:arr, nil];

                    for (NSInteger curveIndex = 0; curveIndex >= 0; curveIndex--) {
                        CGPoint bez[4];
                        [curves[curveIndex] getValue:&bez];
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
                            curveIndex += 2;
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
        cached = YES;
    }
    *lineCountP = lineCount;
    *isClosedP = isClosed;
    *lengthsP = lengths;
    *lengthP = length;
    *linesP = lines;
}

- (void)setD:(RNSVGPathParser *)d
{
    if (d == _d) {
        return;
    }

    [self invalidate];
    _d = d;
    lines = nil;
    lengths = nil;
    cached = false;
    CGPathRelease(_path);
    _path = CGPathRetain([d getPath]);
}

- (CGPathRef)getPath:(CGContextRef)context
{
    return _path;
}

- (void)dealloc
{
    lines = nil;
    lengths = nil;
    CGPathRelease(_path);
}

@end
