/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGFEComposite.h"
#import "WKArithmeticFilter.h"
#import "RNSVGNode.h"

@implementation RNSVGFEComposite

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results
    previousFilterResult:(CIImage *)previous
{
    CIFilter *filter = [self getCIFilter:results];
    
    if (filter) {
        return [filter valueForKey:@"outputImage"];
    }
    
    return previous;
}

// Based on: https://github.com/xebecnan/EAWebkit/blob/master/Webkit-owb/WebCore/svg/graphics/filters/cg/SVGFECompositeCg.mm

- (CIFilter*)getCIFilter:(NSMutableDictionary<NSString *, CIImage *> *)results
{
    CIFilter* filter = nil;
    RNSVGCompositeOperators op = self.Operator;
    switch (op) {
        case SVG_FECOMPOSITE_OPERATOR_UNKNOWN:
            return nil;
        case SVG_FECOMPOSITE_OPERATOR_OVER:
            filter = [CIFilter filterWithName:@"CISourceOverCompositing"];
            break;
        case SVG_FECOMPOSITE_OPERATOR_IN:
            filter = [CIFilter filterWithName:@"CISourceInCompositing"];
            break;
        case SVG_FECOMPOSITE_OPERATOR_OUT:
            filter = [CIFilter filterWithName:@"CISourceOutCompositing"];
            break;
        case SVG_FECOMPOSITE_OPERATOR_ATOP:
            filter = [CIFilter filterWithName:@"CISourceAtopCompositing"];
            break;
        case SVG_FECOMPOSITE_OPERATOR_XOR:
            //FIXME: I'm not sure this is right...
            filter = [CIFilter filterWithName:@"CIExclusionBlendMode"];
            break;
        case SVG_FECOMPOSITE_OPERATOR_ARITHMETIC:
            [WKArithmeticFilter class];
            filter = [CIFilter filterWithName:@"WKArithmeticFilter"];
            [filter setValue:[NSNumber numberWithFloat:[self.k1 floatValue]] forKey:@"inputK1"];
            [filter setValue:[NSNumber numberWithFloat:[self.k2 floatValue]] forKey:@"inputK2"];
            [filter setValue:[NSNumber numberWithFloat:[self.k3 floatValue]] forKey:@"inputK3"];
            [filter setValue:[NSNumber numberWithFloat:[self.k4 floatValue]] forKey:@"inputK4"];
            break;
    }
    
    [filter setDefaults];
    CIImage *inputImage = [results objectForKey:self.in1];
    CIImage *backgroundImage = [results objectForKey:self.in2];
    
    [filter setValue:inputImage forKey:@"inputImage"];
    [filter setValue:backgroundImage forKey:@"inputBackgroundImage"];
    
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

- (void)setOperator:(RNSVGCompositeOperators)_operator
{
    if (_operator == _Operator) {
        return;
    }
    _Operator = _operator;
    [self invalidate];
}

- (void)setK1:(NSNumber *)k1
{
    if ([k1 isEqualToNumber:_k1]) {
        return;
    }
    _k1 = k1;
    [self invalidate];
}

- (void)setK2:(NSNumber *)k2
{
    if ([k2 isEqualToNumber:_k2]) {
        return;
    }
    _k2 = k2;
    [self invalidate];
}

- (void)setK3:(NSNumber *)k3
{
    if ([k3 isEqualToNumber:_k3]) {
        return;
    }
    _k3 = k3;
    [self invalidate];
}

- (void)setK4:(NSNumber *)k4
{
    if ([k4 isEqualToNumber:_k4]) {
        return;
    }
    _k4 = k4;
    [self invalidate];
}

@end

