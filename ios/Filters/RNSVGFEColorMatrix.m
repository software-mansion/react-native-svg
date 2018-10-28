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

    NSArray<NSNumber *> *arr = self.values;
    NSUInteger count = [arr count];
    if (count == 20) {
        CGFloat v[20] = {0};
        for (NSUInteger i = 0; i < count; i++) {
            v[i] = (CGFloat)[arr[i] doubleValue];
        }

        CIFilter *colorMatrix = [CIFilter filterWithName:@"CIColorMatrix"];
        [colorMatrix setDefaults];
        [colorMatrix setValue:[CIVector vectorWithValues:v count:4] forKey:@"inputRVector"];
        [colorMatrix setValue:[CIVector vectorWithValues:(v + 4) count:4] forKey:@"inputGVector"];
        [colorMatrix setValue:[CIVector vectorWithValues:(v + 8) count:4] forKey:@"inputBVector"];
        [colorMatrix setValue:[CIVector vectorWithValues:(v + 12) count:4] forKey:@"inputAVector"];
        [colorMatrix setValue:[CIVector vectorWithValues:(v + 16) count:4] forKey:@"inputBiasVector"];

        [colorMatrix setValue:inputImage forKey:@"inputImage"];
        return [colorMatrix valueForKey:@"outputImage"];
    }

    return inputImage;
}

- (void)setIn1:(NSString *)in1
{
    if ([in1 isEqualToString:_in1]) {
        return;
    }

    _in1 = in1;
    [self invalidate];
}

- (void)setType:(RNSVGColorMatrixTypes *)type
{
    if (type == self.type) {
        return;
    }
    self.type = type;
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

