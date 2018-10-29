/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGFEMerge.h"
#import "RNSVGFEMergeNode.h"
#import "RNSVGNode.h"

@implementation RNSVGFEMerge {
    bool _hasSourceGraphicAsLastOutput;
}

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results
    previousFilterResult:(CIImage *)previous
{
    CIFilter *filter;
    CIImage *previousOutput = nil;

    RNSVGFEMergeNode *n;
    for (UIView *node in self.subviews) {
        if ([node isKindOfClass:[RNSVGFEMergeNode class]]) {
            n = (RNSVGFEMergeNode *)node;
            CIImage* inputImage = [results objectForKey:n.in1];
            if (!inputImage) {
                return previousOutput;
            }
            if (!previousOutput) {
                previousOutput = inputImage;
                continue;
            }
            filter = [CIFilter filterWithName:@"CISourceOverCompositing"];
            [filter setDefaults];
            [filter setValue:inputImage forKey:@"inputImage"];
            [filter setValue:previousOutput forKey:@"inputBackgroundImage"];
            previousOutput = [filter valueForKey:@"outputImage"];
        }
    }

    _hasSourceGraphicAsLastOutput = n && [n.in1 isEqualToString:@"SourceGraphic"];

    return previousOutput ? previousOutput : previous;
}

- (BOOL)hasSourceGraphicAsLastOutput
{
    return _hasSourceGraphicAsLastOutput;
}

@end

