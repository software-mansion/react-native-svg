//
//  UIBezierPath+Util.m
//  PerformanceBezier
//
//  Created by Adam Wulf on 5/20/15.
//
//

#import "PerformanceBezier.h"
#import "UIBezierPath+Util.h"
#import "UIBezierPath+Trim.h"
#import "UIBezierPath+Performance.h"

@implementation UIBezierPath (Util)

+(CGFloat) lengthOfBezier:(const CGPoint[4])bez withAccuracy:(CGFloat)accuracy{
    return lengthOfBezier(bez, accuracy);
}

#pragma mark - Subdivide helpers by Alastair J. Houghton
/*
 * Bezier path utility category (trimming)
 *
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

// Subdivide a Bézier (50% subdivision)
inline static void subdivideBezier(const CGPoint bez[4], CGPoint bez1[4], CGPoint bez2[4])
{
    CGPoint q;
    
    bez1[0].x = bez[0].x;
    bez1[0].y = bez[0].y;
    bez2[3].x = bez[3].x;
    bez2[3].y = bez[3].y;
    
    q.x = (bez[1].x + bez[2].x) / 2.0;
    q.y = (bez[1].y + bez[2].y) / 2.0;
    bez1[1].x = (bez[0].x + bez[1].x) / 2.0;
    bez1[1].y = (bez[0].y + bez[1].y) / 2.0;
    bez2[2].x = (bez[2].x + bez[3].x) / 2.0;
    bez2[2].y = (bez[2].y + bez[3].y) / 2.0;
    
    bez1[2].x = (bez1[1].x + q.x) / 2.0;
    bez1[2].y = (bez1[1].y + q.y) / 2.0;
    bez2[1].x = (q.x + bez2[2].x) / 2.0;
    bez2[1].y = (q.y + bez2[2].y) / 2.0;
    
    bez1[3].x = bez2[0].x = (bez1[2].x + bez2[1].x) / 2.0;
    bez1[3].y = bez2[0].y = (bez1[2].y + bez2[1].y) / 2.0;
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


// Length of a curve
CGFloat lengthOfBezier(const  CGPoint bez[4], CGFloat acceptableError)
{
    CGFloat   polyLen = 0.0;
    CGFloat   chordLen = distance(bez[0], bez[3]);
    CGFloat   retLen, errLen;
    NSUInteger n;
    
    for (n = 0; n < 3; ++n)
        polyLen += distance(bez[n], bez[n + 1]);
    
    errLen = polyLen - chordLen;
    
    if (errLen > acceptableError) {
        CGPoint left[4], right[4];
        subdivideBezier (bez, left, right);
        retLen = (lengthOfBezier (left, acceptableError)
                  + lengthOfBezier (right, acceptableError));
    } else {
        retLen = 0.5 * (polyLen + chordLen);
    }
    
    return retLen;
}

// Split a Bézier curve at a specific length
CGFloat subdivideBezierAtLength (const CGPoint bez[4],
                                 CGPoint bez1[4],
                                 CGPoint bez2[4],
                                 CGFloat length,
                                 CGFloat acceptableError)
{
    return subdivideBezierAtLengthWithCache(bez, bez1, bez2, length, acceptableError, NULL);
}

/**
 * will split the input bezier curve at the input length
 * within a given margin of error
 *
 * the two curves will exactly match the original curve
 */
CGFloat subdivideBezierAtLengthWithCache(const CGPoint bez[4],
                                         CGPoint bez1[4],
                                         CGPoint bez2[4],
                                         CGFloat length,
                                         CGFloat acceptableError,
                                         CGFloat* subBezierLengthCache){
    CGFloat top = 1.0, bottom = 0.0;
    CGFloat t, prevT;
    BOOL needsDealloc = NO;
    
    if(!subBezierLengthCache){
        subBezierLengthCache = calloc(1000, sizeof(CGFloat));
        needsDealloc = YES;
    }
    
    prevT = t = 0.5;
    for (;;) {
        CGFloat len1;
        
        subdivideBezierAtT (bez, bez1, bez2, t);
        
        int lengthCacheIndex = (int)floorf(t*1000);
        len1 = subBezierLengthCache[lengthCacheIndex];
        if(!len1){
            len1 = [UIBezierPath lengthOfBezier:bez1 withAccuracy:0.5 * acceptableError];
            subBezierLengthCache[lengthCacheIndex] = len1;
        }
        
        if (fabs (length - len1) < acceptableError){
            return len1;
        }
        
        if (length > len1) {
            bottom = t;
            t = 0.5 * (t + top);
        } else if (length < len1) {
            top = t;
            t = 0.5 * (bottom + t);
        }
        
        if (t == prevT){
            subBezierLengthCache[lengthCacheIndex] = len1;

            if(needsDealloc){
                free(subBezierLengthCache);
            }
            return len1;
        }
        
        prevT = t;
    }
}



//  public domain function by Darel Rex Finley, 2006

//  Determines the intersection point of the line segment defined by points A and B
//  with the line segment defined by points C and D.
//
//  Returns YES if the intersection point was found, and stores that point in X,Y.
//  Returns NO if there is no determinable intersection point, in which case X,Y will
//  be unmodified.

CGPoint lineSegmentIntersection(CGPoint A, CGPoint B, CGPoint C, CGPoint D) {
    
    double  distAB, theCos, theSin, newX, ABpos ;
    
    //  Fail if either line segment is zero-length.
    if ((A.x==B.x && A.y==B.y) || (C.x==D.x && C.y==D.y)) return CGPointNotFound;
    
    //  Fail if the segments share an end-point.
    if ((A.x==C.x && A.y==C.y) ||
        (B.x==C.x && B.y==C.y) ||
        (A.x==D.x && A.y==D.y) ||
        (B.x==D.x && B.y==D.y)) {
        return CGPointNotFound;
    }
    
    //  (1) Translate the system so that point A is on the origin.
    B.x-=A.x; B.y-=A.y;
    C.x-=A.x; C.y-=A.y;
    D.x-=A.x; D.y-=A.y;
    
    //  Discover the length of segment A-B.
    distAB=sqrt(B.x*B.x+B.y*B.y);
    
    //  (2) Rotate the system so that point B is on the positive X axis.
    theCos=B.x/distAB;
    theSin=B.y/distAB;
    newX=C.x*theCos+C.y*theSin;
    C.y  =C.y*theCos-C.x*theSin;
    C.x=newX;
    newX=D.x*theCos+D.y*theSin;
    D.y  =D.y*theCos-D.x*theSin;
    D.x=newX;
    
    //  Fail if segment C-D doesn't cross line A-B.
    if ((C.y<0. && D.y<0.) || (C.y>=0. && D.y>=0.)) return CGPointNotFound;
    
    //  (3) Discover the position of the intersection point along line A-B.
    ABpos=D.x+(C.x-D.x)*D.y/(D.y-C.y);
    
    //  Fail if segment C-D crosses line A-B outside of segment A-B.
    if (ABpos<0. || ABpos>distAB) return CGPointNotFound;
    
    //  (4) Apply the discovered position to line A-B in the original coordinate system.
    //  Success.
    return CGPointMake(A.x+ABpos*theCos, A.y+ABpos*theSin);
}


#pragma mark - Helper


// primary algorithm from:
// http://stackoverflow.com/questions/4089443/find-the-tangent-of-a-point-on-a-cubic-bezier-curve-on-an-iphone
CGPoint bezierTangentAtT(const CGPoint bez[4], CGFloat t)
{
    return CGPointMake(bezierTangent(t, bez[0].x, bez[1].x, bez[2].x, bez[3].x),
                       bezierTangent(t, bez[0].y, bez[1].y, bez[2].y, bez[3].y));
}
CGFloat bezierTangent(CGFloat t, CGFloat a, CGFloat b, CGFloat c, CGFloat d)
{
    CGFloat C1 = ( d - (3.0 * c) + (3.0 * b) - a );
    CGFloat C2 = ( (3.0 * c) - (6.0 * b) + (3.0 * a) );
    CGFloat C3 = ( (3.0 * b) - (3.0 * a) );
    return ( ( 3.0 * C1 * t* t ) + ( 2.0 * C2 * t ) + C3 );
}


/**
 * returns the shortest distance from a point to a line
 */
CGFloat	distanceOfPointToLine(CGPoint point, CGPoint start, CGPoint end){
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
 * returns the distance between two points
 */
CGFloat distance(const CGPoint p1, const CGPoint p2) {
    return sqrt(pow(p2.x - p1.x, 2) + pow(p2.y - p1.y, 2));
}
/**
 * returns the dot product of two coordinates
 */
CGFloat dotProduct(const CGPoint p1, const CGPoint p2) {
    return p1.x * p2.x + p1.y * p2.y;
}


@end
