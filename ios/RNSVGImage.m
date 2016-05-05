/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGImage.h"
#import "RCTConvert+RNSVG.h"
#import "RCTLog.h"

@implementation RNSVGImage
{
    CGImageRef image;
}
- (void)setSrc:(id)src
{
    if (src == _src) {
        return;
    }
    _src = src;
    CGImageRelease(image);
    image = CGImageRetain([RCTConvert CGImage:src]);
    [self invalidate];
}

- (void)setLayout:(NSDictionary *)layout
{
    if (layout == _layout) {
        return;
    }
    _layout = layout;
    [self invalidate];
}

- (void)dealloc
{
    CGImageRelease(image);
}

- (void)renderLayerTo:(CGContextRef)context
{
    CGRect box = CGContextGetClipBoundingBox(context);
    float height = CGRectGetHeight(box);
    float width = CGRectGetWidth(box);
    
    CGFloat x = [self getActualProp:@"x" relative:width];
    CGFloat y = [self getActualProp:@"y" relative:height];
    CGFloat w = [self getActualProp:@"width" relative:width];
    CGFloat h = [self getActualProp:@"height" relative:height];
    [self clip:context];
    CGContextSaveGState(context);
    CGContextTranslateCTM(context, 0, h);
    CGContextScaleCTM(context, 1.0, -1.0);
    CGContextDrawImage(context, CGRectMake(x, -y, w, h), image);
    CGContextRestoreGState(context);
}

- (CGFloat)getActualProp:(NSString *)name relative:(float)relative
{
    NSDictionary *prop = [self.layout objectForKey:name];
    return [super getActualProp:prop relative:relative];

}

@end
