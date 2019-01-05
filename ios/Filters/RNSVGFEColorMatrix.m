/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGFEColorMatrix.h"
#import "RNSVGNode.h"

@implementation RNSVGFEColorMatrix

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results
    previousFilterResult:(CIImage *)previous
{
    CIImage *inResult = self.in1 ? [results objectForKey:self.in1] : nil;
    CIImage *inputImage = inResult ? inResult : previous;
    CIFilter *filter = [self getCIFilter];

    if (filter) {
        [filter setValue:inputImage forKey:@"inputImage"];
        return [filter valueForKey:@"outputImage"];
    }

    return inputImage;
}

#define deg2rad(degrees)((M_PI * degrees)/180)

- (CIFilter*)getCIFilter
{
    CIFilter* filter = nil;
    NSArray<NSNumber *> *arr = self.values;
    NSUInteger count = [arr count];
    switch (self.type) {
        case SVG_FECOLORMATRIX_TYPE_UNKNOWN:
            return nil;
        case SVG_FECOLORMATRIX_TYPE_MATRIX:
        {
            if (count != 20) {
                return nil;
            }
            CGFloat v[20] = {0};
            for (NSUInteger i = 0; i < count; i++) {
                v[i] = (CGFloat)[arr[i] doubleValue];
            }
            filter = [CIFilter filterWithName:@"CIColorMatrix"];
            [filter setDefaults];
            [filter setValue:[CIVector vectorWithX:v[0] Y:v[1] Z:v[2] W:v[3]] forKey:@"inputRVector"];
            [filter setValue:[CIVector vectorWithX:v[5] Y:v[6] Z:v[7] W:v[8]] forKey:@"inputGVector"];
            [filter setValue:[CIVector vectorWithX:v[10] Y:v[11] Z:v[12] W:v[13]] forKey:@"inputBVector"];
            [filter setValue:[CIVector vectorWithX:v[15] Y:v[16] Z:v[17] W:v[18]] forKey:@"inputAVector"];
            [filter setValue:[CIVector vectorWithX:v[4] Y:v[9] Z:v[14] W:v[19]] forKey:@"inputBiasVector"];
            break;
        }
        case SVG_FECOLORMATRIX_TYPE_SATURATE:
        {
            if (count != 1) {
                return nil;
            }
            float saturation = [arr[0] floatValue];
            filter = [CIFilter filterWithName:@"CIColorControls"];
            [filter setDefaults];
            if ((saturation < 0.0) || (saturation > 3.0))
                NSLog(@"WARNING: Saturation adjustment: %f outside supported range.", saturation);
            [filter setValue:[NSNumber numberWithFloat:saturation] forKey:@"inputSaturation"];
            break;
        }
        case SVG_FECOLORMATRIX_TYPE_HUEROTATE:
        {
            if (count != 1) {
                return nil;
            }
            double deg = [arr[0] doubleValue];
            filter = [CIFilter filterWithName:@"CIHueAdjust"];
            [filter setDefaults];
            float radians = (float)deg2rad(deg);
            [filter setValue:[NSNumber numberWithFloat:radians] forKey:@"inputAngle"];
            break;
        }
        case SVG_FECOLORMATRIX_TYPE_LUMINANCETOALPHA:
        {
            if (count != 0) {
                return nil;
            }
            filter = [CIFilter filterWithName:@"CIColorMatrix"];
            [filter setDefaults];
            CGFloat zero[4] = {0, 0, 0, 0};
            CGFloat alpha[4] = {0.2125, 0.7154, 0.0721, 0};
            [filter setValue:[CIVector vectorWithValues:zero count:4] forKey:@"inputRVector"];
            [filter setValue:[CIVector vectorWithValues:zero count:4] forKey:@"inputGVector"];
            [filter setValue:[CIVector vectorWithValues:zero count:4] forKey:@"inputBVector"];
            [filter setValue:[CIVector vectorWithValues:alpha count:4] forKey:@"inputAVector"];
            [filter setValue:[CIVector vectorWithValues:zero count:4] forKey:@"inputBiasVector"];
            break;
        }
        default:
            return nil;
    }

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

- (void)setType:(RNSVGColorMatrixTypes)type
{
    if (type == _type) {
        return;
    }
    _type = type;
    [self invalidate];
}

- (void)setValues:(NSArray<NSNumber *> *)values
{
    if (values == _values) {
        return;
    }

    _values = values;
    [self invalidate];
}

@end

