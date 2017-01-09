/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGPathParser.h"
#import <React/RCTLog.h>

@implementation RNSVGPathParser : NSObject 
{
    NSString* _d;
    NSString* _originD;
    NSRegularExpression* _pathRegularExpression;
    double _penX;
    double _penY;
    double _penDownX;
    double _penDownY;
    double _pivotX;
    double _pivotY;
    BOOL _valid;
    BOOL _penDownSet;
}

- (instancetype) initWithPathString:(NSString *)d
{
    if (self = [super init]) {
        NSRegularExpression* decimalRegularExpression = [[NSRegularExpression alloc] initWithPattern:@"(\\.\\d+)(?=\\-?\\.)" options:0 error:nil];
        _originD = d;
        _d = [decimalRegularExpression stringByReplacingMatchesInString:d options:0 range:NSMakeRange(0, [d length]) withTemplate:@"$1\,"];
        _pathRegularExpression = [[NSRegularExpression alloc] initWithPattern:@"[a-df-z]|[\\-+]?(?:[\\d.]e[\\-+]?|[^\\s\\-+,a-z])+" options:NSRegularExpressionCaseInsensitive error:nil];
    }
    return self;
}

- (CGPathRef)getPath
{
    CGMutablePathRef path = CGPathCreateMutable();
    NSArray<NSTextCheckingResult *>* results = [_pathRegularExpression matchesInString:_d options:0 range:NSMakeRange(0, [_d length])];

    int count = [results count];
    if (count) {
        NSUInteger i = 0;
        #define NEXT_VALUE [self getNextValue:results[i++]]
        #define NEXT_DOUBLE [self double:NEXT_VALUE]
        #define NEXT_BOOL [self bool:NEXT_VALUE]
        NSString* lastCommand;
        NSString* command = NEXT_VALUE;
        
        @try {
            while (command) {
                if ([command isEqualToString:@"m"]) { // moveTo command
                    [self move:path x:NEXT_DOUBLE y:NEXT_DOUBLE];
                } else if ([command isEqualToString:@"M"]) {
                    [self moveTo:path x:NEXT_DOUBLE y:NEXT_DOUBLE];
                } else if ([command isEqualToString:@"l"]) { // lineTo command
                    [self line:path x:NEXT_DOUBLE y:NEXT_DOUBLE];
                } else if ([command isEqualToString:@"L"]) {
                    [self lineTo:path x:NEXT_DOUBLE y:NEXT_DOUBLE];
                } else if ([command isEqualToString:@"h"]) { // horizontalTo command
                    [self line:path x:NEXT_DOUBLE y:0];
                } else if ([command isEqualToString:@"H"]) {
                    [self lineTo:path x:NEXT_DOUBLE y:_penY];
                } else if ([command isEqualToString:@"v"]) { // verticalTo command
                    [self line:path x:0 y:NEXT_DOUBLE];
                } else if ([command isEqualToString:@"V"]) {
                    [self lineTo:path x:_penX y:NEXT_DOUBLE];
                } else if ([command isEqualToString:@"c"]) { // curveTo command
                    [self curve:path c1x:NEXT_DOUBLE c1y:NEXT_DOUBLE c2x:NEXT_DOUBLE c2y:NEXT_DOUBLE ex:NEXT_DOUBLE ey:NEXT_DOUBLE];
                } else if ([command isEqualToString:@"C"]) {
                    [self curveTo:path c1x:NEXT_DOUBLE c1y:NEXT_DOUBLE c2x:NEXT_DOUBLE c2y:NEXT_DOUBLE ex:NEXT_DOUBLE ey:NEXT_DOUBLE];
                } else if ([command isEqualToString:@"s"]) { // smoothCurveTo command
                    [self smoothCurve:path c1x:NEXT_DOUBLE c1y:NEXT_DOUBLE ex:NEXT_DOUBLE ey:NEXT_DOUBLE];
                } else if ([command isEqualToString:@"S"]) {
                    [self smoothCurveTo:path c1x:NEXT_DOUBLE c1y:NEXT_DOUBLE ex:NEXT_DOUBLE ey:NEXT_DOUBLE];
                } else if ([command isEqualToString:@"q"]) { // quadraticBezierCurveTo command
                    [self quadraticBezierCurve:path c1x:NEXT_DOUBLE c1y:NEXT_DOUBLE c2x:NEXT_DOUBLE c2y:NEXT_DOUBLE];
                } else if ([command isEqualToString:@"Q"]) {
                    [self quadraticBezierCurveTo:path c1x:NEXT_DOUBLE c1y:NEXT_DOUBLE c2x:NEXT_DOUBLE c2y:NEXT_DOUBLE];
                } else if ([command isEqualToString:@"t"]) {// smoothQuadraticBezierCurveTo command
                    [self smoothQuadraticBezierCurve:path c1x:NEXT_DOUBLE c1y:NEXT_DOUBLE];
                } else if ([command isEqualToString:@"T"]) {
                    [self smoothQuadraticBezierCurveTo:path c1x:NEXT_DOUBLE c1y:NEXT_DOUBLE];
                } else if ([command isEqualToString:@"a"]) { // arcTo command
                    [self arc:path rx:NEXT_DOUBLE ry:NEXT_DOUBLE rotation:NEXT_DOUBLE outer:NEXT_BOOL clockwise:NEXT_BOOL x:NEXT_DOUBLE y:NEXT_DOUBLE];
                } else if ([command isEqualToString:@"A"]) {
                    [self arcTo:path rx:NEXT_DOUBLE ry:NEXT_DOUBLE rotation:NEXT_DOUBLE outer:NEXT_BOOL clockwise:NEXT_BOOL x:NEXT_DOUBLE y:NEXT_DOUBLE];
                } else if ([command isEqualToString:@"z"]) { // close command
                    [self close:path];
                } else if ([command isEqualToString:@"Z"]) {
                    [self close:path];
                } else {
                    command = lastCommand;
                    i--;
                    continue;
                }
                
                lastCommand = command;
                if ([lastCommand isEqualToString:@"m"]) {
                    lastCommand = @"l";
                } else if ([lastCommand isEqualToString:@"M"]) {
                    lastCommand = @"L";
                }
                
                command = i < count ? NEXT_VALUE : nil;
            }
        } @catch (NSException *exception) {
            RCTLogWarn(@"Invalid CGPath format: %@", _originD);
            CGPathRelease(path);
            return nil;
        }

    }
    
    return (CGPathRef)CFAutorelease(path);
}

- (NSString *)getNextValue:(NSTextCheckingResult *)result
{
    if (!result) {
        return nil;
    }
    return [_d substringWithRange:NSMakeRange(result.range.location, result.range.length)];
}

- (double)double:(NSString *)value
{
    return [value doubleValue];
}

- (BOOL)bool:(NSString *)value
{
    return ![value isEqualToString:@"0"];
}

- (void)move:(CGPathRef)path x:(double)x y:(double)y
{
    [self moveTo:path x:x + _penX y:y + _penY];
}

- (void)moveTo:(CGPathRef)path x:(double)x y:(double)y
{
    _pivotX = _penX = x;
    _pivotY = _penY = y;
    CGPathMoveToPoint(path, nil, x, y);
}

- (void)line:(CGPathRef)path x:(double)x y:(double)y
{
    [self lineTo:path x:x + _penX y:y + _penY];
}

- (void)lineTo:(CGPathRef)path x:(double)x y:(double)y{
    [self setPenDown];
    _pivotX = _penX = x;
    _pivotY = _penY = y;
    CGPathAddLineToPoint(path, nil, x, y);
}

- (void)curve:(CGPathRef)path c1x:(double)c1x c1y:(double)c1y c2x:(double)c2x c2y:(double)c2y ex:(double)ex ey:(double)ey
{
    [self curveTo:path c1x:c1x + _penX
              c1y:c1y + _penY
              c2x:c2x + _penX
              c2y:c2y + _penY
               ex:ex + _penX
               ey:ey + _penY];
}

- (void)curveTo:(CGPathRef)path c1x:(double)c1x c1y:(double)c1y c2x:(double)c2x c2y:(double)c2y ex:(double)ex ey:(double)ey
{
    _pivotX = ex;
    _pivotY = ey;
    [self curveToPoint:path c1x:(double)c1x c1y:(double)c1y c2x:(double)c2x c2y:(double)c2y ex:(double)ex ey:(double)ey];
}

- (void)curveToPoint:(CGPathRef)path c1x:(double)c1x c1y:(double)c1y c2x:(double)c2x c2y:(double)c2y ex:(double)ex ey:(double)ey
{
    [self setPenDown];
    _penX = ex;
    _penY = ey;
    CGPathAddCurveToPoint(path, nil, c1x, c1y, c2x, c2y, ex, ey);
}

- (void)smoothCurve:(CGPathRef)path c1x:(double)c1x c1y:(double)c1y ex:(double)ex ey:(double)ey
{
    [self smoothCurveTo:path c1x:c1x + _penX c1y:c1y + _penY ex:ex + _penX ey:ey + _penY];
}

- (void)smoothCurveTo:(CGPathRef)path c1x:(double)c1x c1y:(double)c1y ex:(double)ex ey:(double)ey
{
    double c2x = c1x;
    double c2y = c1y;
    c1x = (_penX * 2) - _pivotX;
    c1y = (_penY * 2) - _pivotY;
    _pivotX = c2x;
    _pivotY = c2y;
    [self curveToPoint:path c1x:(double)c1x c1y:(double)c1y c2x:(double)c2x c2y:(double)c2y ex:(double)ex ey:(double)ey];
}

- (void)quadraticBezierCurve:(CGPathRef)path c1x:(double)c1x c1y:(double)c1y c2x:(double)c2x c2y:(double)c2y
{
    [self quadraticBezierCurveTo:path c1x:(double)c1x + _penX c1y:(double)c1y + _penY c2x:(double)c2x + _penX c2y:(double)c2y + _penY];
}

- (void)quadraticBezierCurveTo:(CGPathRef)path c1x:(double)c1x c1y:(double)c1y c2x:(double)c2x c2y:(double)c2y
{
    _pivotX = c1x;
    _pivotY = c1y;
    double ex = c2x;
    double ey = c2y;
    c2x = (ex + c1x * 2) / 3;
    c2y = (ey + c1y * 2) / 3;
    c1x = (_penX + c1x * 2) / 3;
    c1y = (_penY + c1y * 2) / 3;
    [self curveToPoint:path c1x:(double)c1x c1y:(double)c1y c2x:(double)c2x c2y:(double)c2y ex:(double)ex ey:(double)ey];
}

- (void)smoothQuadraticBezierCurve:(CGPathRef)path c1x:(double)c1x c1y:(double)c1y
{
    [self smoothQuadraticBezierCurveTo:path c1x:c1x + _penX c1y:c1y + _penY];
}

- (void)smoothQuadraticBezierCurveTo:(CGPathRef)path c1x:(double)c1x c1y:(double)c1y
{
    double c2x = c1x;
    double c2y = c1y;
    c1x = (_penX * 2) - _pivotX;
    c1y = (_penY * 2) - _pivotY;
    [self quadraticBezierCurveTo:path c1x:c1x c1y:c1y c2x:c2x c2y:c2y];
}

- (void)arc:(CGPathRef)path rx:(double)rx ry:(double)ry rotation:(double)rotation outer:(BOOL)outer clockwise:(BOOL)clockwise x:(double)x y:(double)y
{
    [self arcTo:path rx:rx ry:ry rotation:rotation outer:outer clockwise:clockwise x:x + _penX y:y + _penY];
}

- (void)arcTo:(CGPathRef)path rx:(double)rx ry:(double)ry rotation:(double)rotation outer:(BOOL)outer clockwise:(BOOL)clockwise x:(double)x y:(double)y
{
    double tX = _penX;
    double tY = _penY;
    
    ry = abs(ry == 0 ? (rx == 0 ? (y - tY) : rx) : ry);
    rx = abs(rx == 0 ? (x - tX) : rx);
    
    if (rx == 0 || ry == 0 || (x == tX && y == tY)) {
        [self lineTo:path x:x y:y];
        return;
    }
    
    
    double rad = rotation * M_PI / 180;
    double cosed = cos(rad);
    double sined = sin(rad);
    x -= tX;
    y -= tY;
    // Ellipse Center
    float cx = cosed * x / 2 + sined * y / 2;
    float cy = -sined * x / 2 + cosed * y / 2;
    float rxry = rx * rx * ry * ry;
    float rycx = ry * ry * cx * cx;
    float rxcy = rx * rx * cy * cy;
    float a = rxry - rxcy - rycx;
    
    if (a < 0){
        a = sqrt(1 - a / rxry);
        rx *= a;
        ry *= a;
        cx = x / 2;
        cy = y / 2;
    } else {
        a = sqrt(a / (rxcy + rycx));
        
        if (outer == clockwise) {
            a = -a;
        }
        float cxd = -a * cy * rx / ry;
        float cyd =  a * cx * ry / rx;
        cx = cosed * cxd - sined * cyd + x / 2;
        cy = sined * cxd + cosed * cyd + y / 2;
    }
    
    // Rotation + Scale Transform
    float xx =  cosed / rx;
    float yx = sined / rx;
    float xy = -sined / ry;
    float yy = cosed / ry;
    
    // Start and End Angle
    float sa = atan2(xy * -cx + yy * -cy, xx * -cx + yx * -cy);
    float ea = atan2(xy * (x - cx) + yy * (y - cy), xx * (x - cx) + yx * (y - cy));
    
    cx += tX;
    cy += tY;
    x += tX;
    y += tY;
    
    [self setPenDown];
    
    _penX = _pivotX = x;
    _penY = _pivotY = y;
    
    if (rx != ry || rad != 0) {
        [self arcToBezier:path cx:cx cy:cy rx:rx ry:ry sa:sa ea:ea clockwise:clockwise rad:rad];
    } else {
        CGPathAddArc(path, nil, cx, cy, rx, sa, ea, !clockwise);
    }
}

- (void)arcToBezier:(CGPathRef)path cx:(double)cx cy:(double)cy rx:(double)rx ry:(double)ry sa:(double)sa ea:(double)ea clockwise:(BOOL)clockwise rad:(double)rad
{
    // Inverse Rotation + Scale Transform
    double cosed = cos(rad);
    double sined = sin(rad);
    double xx = cosed * rx;
    double yx = -sined * ry;
    double xy = sined * rx;
    double yy =  cosed * ry;
    
    // Bezier Curve Approximation
    double arc = ea - sa;
    if (arc < 0 && clockwise) {
        arc += M_PI * 2;
    } else if (arc > 0 && !clockwise) {
        arc -= M_PI * 2;
    }
    
    int n = ceil(abs(arc / (M_PI / 2)));
    
    double step = arc / n;
    double k = (4 / 3) * tan(step / 4);
    
    double x = cos(sa);
    double y = sin(sa);
    
    for (int i = 0; i < n; i++){
        double cp1x = x - k * y;
        double cp1y = y + k * x;
        
        sa += step;
        x = cos(sa);
        y = sin(sa);
        
        double cp2x = x + k * y;
        double cp2y = y - k * x;
        
        CGPathAddCurveToPoint(path,
                              nil,
                              cx + xx * cp1x + yx * cp1y,
                              cy + xy * cp1x + yy * cp1y,
                              cx + xx * cp2x + yx * cp2y,
                              cy + xy * cp2x + yy * cp2y,
                              cx + xx * x + yx * y,
                              cy + xy * x + yy * y);
    }
}

- (void)close:(CGPathRef)path
{
    if (_penDownSet) {
        _penX = _penDownX;
        _penY = _penDownY;
        _penDownSet = NO;
        CGPathCloseSubpath(path);
    }
}

- (void)setPenDown
{
    if (!_penDownSet) {
        _penDownX = _penX;
        _penDownY = _penY;
        _penDownSet = YES;
    }
}

@end
