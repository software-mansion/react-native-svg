/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGShape.h"
#import "RCTLog.h"

@implementation RNSVGShape

- (void)renderLayerTo:(CGContextRef)context
{
    self.d = [self getPath: context];
    [super renderLayerTo:context];
}

- (CGPathRef)getPath:(CGContextRef)context
{
    
    int type = [[self.shape objectForKey:@"type"] intValue];
    CGRect box = CGContextGetClipBoundingBox(context);
    CGMutablePathRef path = CGPathCreateMutable();
    
    float height = CGRectGetHeight(box);
    float width = CGRectGetWidth(box);
    switch (type) {
        case 0:
        {
            // draw circle
            CGFloat cx = [self getActualProp:@"cx" relative:width];
            CGFloat cy = [self getActualProp:@"cy" relative:height];
            
            
            CGFloat r;
            // radius in percentage calculate formula:
            // radius = sqrt(pow((width*percent), 2) + pow((height*percent), 2)) / sqrt(2)
            NSDictionary *prop = [self.shape objectForKey:@"r"];
            CGFloat value = [[prop objectForKey:@"value"] floatValue];
            if ([[prop objectForKey:@"percentage"] integerValue] == 1) {
                r = sqrt(pow((width * value), 2) + pow((height * value), 2)) / sqrt(2);
            } else {
                r = value;
            }
            CGPathAddArc(path, nil, cx, cy, r, 0, 2*M_PI, YES);
            break;
        }
        case 1:
        {
            // draw ellipse
            CGFloat cx = [self getActualProp:@"cx" relative:width];
            CGFloat cy = [self getActualProp:@"cy" relative:height];
            CGFloat rx = [self getActualProp:@"rx" relative:height];
            CGFloat ry = [self getActualProp:@"ry" relative:height];
            CGPathAddEllipseInRect(path, nil, CGRectMake(cx - rx, cy - ry, rx * 2, ry * 2));
            break;
        }
        case 2:
        {
            // draw line
            CGFloat x1 = [self getActualProp:@"x1" relative:height];
            CGFloat y1 = [self getActualProp:@"y1" relative:height];
            CGFloat x2 = [self getActualProp:@"x2" relative:height];
            CGFloat y2 = [self getActualProp:@"y2" relative:height];
            CGPathMoveToPoint(path, nil, x1, y1);
            CGPathAddLineToPoint(path, nil, x2, y2);
            break;
        }
        case 3:
        {
            // draw rect
            CGFloat x = [self getActualProp:@"x" relative:width];
            CGFloat y = [self getActualProp:@"y" relative:height];
            CGFloat w = [self getActualProp:@"width" relative:width];
            CGFloat h = [self getActualProp:@"height" relative:height];
            CGFloat rx = [self getActualProp:@"rx" relative:width];
            CGFloat ry = [self getActualProp:@"ry" relative:height];
            
            
            if (rx != 0 || ry != 0) {
                if (rx == 0) {
                    rx = ry;
                } else if (ry == 0) {
                    ry = rx;
                }
                
                if (rx > w / 2) {
                    rx = w / 2;
                }
                
                if (ry > h / 2) {
                    ry = h / 2;
                }
                
                CGPathAddRoundedRect(path, nil, CGRectMake(x, y, w, h), rx, ry);
            } else {
                CGPathAddRect(path, nil, CGRectMake(x, y, w, h));
            }
            break;
        }
        default:
            RCTLogError(@"Invalid Shape type %d at %@", type, self.shape);
            //CGPathRelease(path);
            
    }
    
    return path;
}

- (CGFloat)getActualProp:(NSString *)name relative:(float)relative
{
    NSDictionary *prop = [self.shape objectForKey:name];
    CGFloat value = [[prop objectForKey:@"value"] floatValue];
    if ([[prop objectForKey:@"percentage"] integerValue] == 1) {
        return relative * value;
    } else {
        return value;
    }
}

@end
