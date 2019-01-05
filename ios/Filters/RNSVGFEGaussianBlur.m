/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGFEGaussianBlur.h"
#import "RNSVGNode.h"

@implementation RNSVGFEGaussianBlur

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results
    previousFilterResult:(CIImage *)previous
{
    CIImage *inResult = self.in1 ? [results objectForKey:self.in1] : nil;
    CIImage *inputImage = inResult ? inResult : previous;

    if (!inputImage)
        return nil;

    CIFilter* filter = [CIFilter filterWithName:@"CIGaussianBlur"];
    [filter setDefaults];
    [filter setValue:inputImage forKey:@"inputImage"];

    float inputRadiusX = [self.stdDeviationX floatValue];
    float inputRadiusY = [self.stdDeviationY floatValue];
    if (inputRadiusX != inputRadiusY) {
        // float inputAspectRatio = inputRadiusX/inputRadiusY;
        // FIXME
    }
    [filter setValue:[NSNumber numberWithFloat:inputRadiusX] forKey:@"inputRadius"];

    return [filter valueForKey:@"outputImage"];
}

- (void)setIn1:(NSString *)in1
{
    if ([in1 isEqualToString:_in1]) {
        return;
    }

    _in1 = in1;
    [self invalidate];
}

- (void)setEdgeMode:(RNSVGEdgeModeValues)edgeMode
{
    if (edgeMode == _edgeMode) {
        return;
    }
    _edgeMode = edgeMode;
    [self invalidate];
}

- (void)setStdDeviationX:(NSNumber *)stdDeviationX
{
    if (stdDeviationX == _stdDeviationX) {
        return;
    }

    _stdDeviationX = stdDeviationX;
    [self invalidate];
}

- (void)setStdDeviationY:(NSNumber *)stdDeviationY
{
    if (stdDeviationY == _stdDeviationY) {
        return;
    }

    _stdDeviationY = stdDeviationY;
    [self invalidate];
}

@end

