/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGFEBlend.h"
#import "RNSVGNode.h"

@implementation RNSVGFEBlend

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results
    previousFilterResult:(CIImage *)previous
{
    CIImage *inResult = self.in1 ? [results objectForKey:self.in1] : nil;
    CIImage *backgroundImage = [results objectForKey:self.in2];
    CIImage *inputImage = inResult ? inResult : previous;
    CIFilter *filter = [self getCIFilter];
    
    if (filter && inputImage && backgroundImage) {
        [filter setValue:inputImage forKey:@"inputImage"];
        [filter setValue:backgroundImage forKey:@"inputBackgroundImage"];
        return [filter valueForKey:@"outputImage"];
    }
    
    return inputImage;
}

- (CIFilter*)getCIFilter
{
    CIFilter* filter = nil;
    
    switch (self.mode) {
        case SVG_FEBLEND_MODE_UNKNOWN:
            return nil;
        case SVG_FEBLEND_MODE_NORMAL:
            filter = [CIFilter filterWithName:@"CISourceOverCompositing"];
            break;
        case SVG_FEBLEND_MODE_MULTIPLY:
            filter = [CIFilter filterWithName:@"CIMultiplyBlendMode"];
            break;
        case SVG_FEBLEND_MODE_SCREEN:
            filter = [CIFilter filterWithName:@"CIScreenBlendMode"];
            break;
        case SVG_FEBLEND_MODE_DARKEN:
            filter = [CIFilter filterWithName:@"CIDarkenBlendMode"];
            break;
        case SVG_FEBLEND_MODE_LIGHTEN:
            filter = [CIFilter filterWithName:@"CILightenBlendMode"];
            break;
        default:
            NSLog(@"Unhandled blend mode: %i", self.mode);
            return nil;
    }
    
    [filter setDefaults];
    
    return filter;
}

- (void)setIn1:(NSString *)in1
{
    if ([in1 isEqualToString:_in1]) {
        return;
    }
    
    _in1 = in1;
    [self invalidate];
}

- (void)setIn2:(NSString *)in2
{
    if ([in2 isEqualToString:_in2]) {
        return;
    }
    
    _in2 = in2;
    [self invalidate];
}

- (void)setMode:(RNSVGBlendModeTypes)mode
{
    if (mode == _mode) {
        return;
    }
    _mode = mode;
    [self invalidate];
}

@end

