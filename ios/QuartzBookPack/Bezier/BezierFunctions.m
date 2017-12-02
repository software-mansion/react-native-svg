/*
 
 Erica Sadun, http://ericasadun.com
 
 */

#import "Bezier.h"

#pragma mark - Bezier functions
float CubicBezier(float t, float start, float c1, float c2, float end)
{
    CGFloat t_ = (1.0 - t);
    CGFloat tt_ = t_ * t_;
    CGFloat ttt_ = t_ * t_ * t_;
    CGFloat tt = t * t;
    CGFloat ttt = t * t * t;
    
    return start * ttt_
    + 3.0 *  c1 * tt_ * t
    + 3.0 *  c2 * t_ * tt
    + end * ttt;
}

float QuadBezier(float t, float start, float c1, float end)
{
    CGFloat t_ = (1.0 - t);
    CGFloat tt_ = t_ * t_;
    CGFloat tt = t * t;
    
    return start * tt_
    + 2.0 *  c1 * t_ * t
    + end * tt;
}

CGPoint CubicBezierPoint(CGFloat t, CGPoint start, CGPoint c1, CGPoint c2, CGPoint end)
{
    CGPoint result;
    result.x = CubicBezier(t, start.x, c1.x, c2.x, end.x);
    result.y = CubicBezier(t, start.y, c1.y, c2.y, end.y);
    return result;
}

CGPoint QuadBezierPoint(CGFloat t, CGPoint start, CGPoint c1, CGPoint end)
{
    CGPoint result;
    result.x = QuadBezier(t, start.x, c1.x, end.x);
    result.y = QuadBezier(t, start.y, c1.y, end.y);
    return result;
}

float CubicBezierLength(CGPoint start, CGPoint c1, CGPoint c2, CGPoint end)
{
    int steps = NUMBER_OF_BEZIER_SAMPLES;
    CGPoint current;
    CGPoint previous;
    float length = 0.0;
    
    for (int i = 0; i <= steps; i++)
    {
        float t = (float) i / (float) steps;
        current = CubicBezierPoint(t, start, c1, c2, end);
        if (i > 0)
            length += PointDistanceFromPoint(current, previous);
        previous = current;
    }
    
    return length;
}

float QuadBezierLength(CGPoint start, CGPoint c1, CGPoint end)
{
    int steps = NUMBER_OF_BEZIER_SAMPLES;
    CGPoint current;
    CGPoint previous;
    float length = 0.0;
    
    for (int i = 0; i <= steps; i++)
    {
        float t = (float) i / (float) steps;
        current = QuadBezierPoint(t, start, c1, end);
        if (i > 0)
            length += PointDistanceFromPoint(current, previous);
        previous = current;
    }
    
    return length;
}


#pragma mark - Point Percents
#define USE_CURVE_TWEAK 0
#if USE_CURVE_TWEAK
#define CURVETWEAK 0.8
#else
#define CURVETWEAK 1.0
#endif

CGFloat ElementDistanceFromPoint(BezierElement *element, CGPoint point, CGPoint startPoint)
{
    CGFloat distance = 0.0f;
    switch (element.elementType)
    {
        case kCGPathElementMoveToPoint:
            return 0.0f;
        case kCGPathElementCloseSubpath:
            return PointDistanceFromPoint(point, startPoint);
        case kCGPathElementAddLineToPoint:
            return PointDistanceFromPoint(point, element.point);
        case kCGPathElementAddCurveToPoint:
            return CubicBezierLength(point, element.controlPoint1, element.controlPoint2, element.point) * CURVETWEAK;
        case kCGPathElementAddQuadCurveToPoint:
            return QuadBezierLength(point, element.controlPoint1, element.point) * CURVETWEAK;
    }
    
    return distance;
}

// Centralize for both close subpath and add line to point
CGPoint InterpolateLineSegment(CGPoint p1, CGPoint p2, CGFloat percent, CGPoint *slope)
{
    CGFloat dx = p2.x - p1.x;
    CGFloat dy = p2.y - p1.y;
    
    if (slope)
        *slope = CGPointMake(dx, dy);
    
    CGFloat px = p1.x + dx * percent;
    CGFloat py = p1.y + dy * percent;
    
    return CGPointMake(px, py);
}

// Interpolate along element
CGPoint InterpolatePointFromElement(BezierElement *element, CGPoint point, CGPoint startPoint, CGFloat percent, CGPoint *slope)
{
    switch (element.elementType)
    {
        case kCGPathElementMoveToPoint:
        {
            // No distance
            if (slope)
                *slope = CGPointMake(INFINITY, INFINITY);
            return point;
        }
            
        case kCGPathElementCloseSubpath:
        {
            // from self.point to firstPoint
            CGPoint p = InterpolateLineSegment(point, startPoint, percent, slope);
            return p;
        }
            
        case kCGPathElementAddLineToPoint:
        {
            // from point to self.point
            CGPoint p = InterpolateLineSegment(point, element.point, percent, slope);
            return p;
        }
            
        case kCGPathElementAddQuadCurveToPoint:
        {
            // from point to self.point
            CGPoint p = QuadBezierPoint(percent, point, element.controlPoint1, element.point);
            CGFloat dx = p.x - QuadBezier(percent * 0.9, point.x, element.controlPoint1.x, element.point.x);
            CGFloat dy = p.y - QuadBezier(percent * 0.9, point.y, element.controlPoint1.y, element.point.y);
            if (slope)
                *slope = CGPointMake(dx, dy);
            return p;
        }
            
        case kCGPathElementAddCurveToPoint:
        {
            // from point to self.point
            CGPoint p = CubicBezierPoint(percent, point, element.controlPoint1, element.controlPoint2, element.point);
            CGFloat dx = p.x - CubicBezier(percent * 0.9, point.x, element.controlPoint1.x, element.controlPoint2.x, element.point.x);
            CGFloat dy = p.y - CubicBezier(percent * 0.9, point.y, element.controlPoint1.y, element.controlPoint2.y, element.point.y);
            if (slope)
                *slope = CGPointMake(dx, dy);
            return p;
        }
    }
    
    return NULLPOINT;
}

CGFloat EaseIn(CGFloat currentTime, int factor)
{
    return powf(currentTime, factor);
}

CGFloat EaseOut(CGFloat currentTime, int factor)
{
    return 1 - powf((1 - currentTime), factor);
}

CGFloat EaseInOut(CGFloat currentTime, int factor)
{
    currentTime = currentTime * 2.0;
    if (currentTime < 1)
        return (0.5 * pow(currentTime, factor));
    currentTime -= 2.0;
    if (factor % 2)
        return 0.5 * (pow(currentTime, factor) + 2.0);
    return 0.5 * (2.0 - pow(currentTime, factor));
}