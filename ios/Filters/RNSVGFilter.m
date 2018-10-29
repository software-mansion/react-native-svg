/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGFilterPrimitive.h"
#import "RNSVGFilter.h"
#import "RNSVGNode.h"

@implementation RNSVGFilter {
    NSMutableDictionary<NSString *, CIImage *> *resultByName;
}

- (id)init
{
    if (self = [super init]) {
        resultByName = [NSMutableDictionary dictionary];
    }
    return self;
}

- (CIImage *)applyFilter:(CIImage *)img background:(CIImage *)background
{
    [resultByName removeAllObjects];
    CIImage *sourceAlpha = applySourceAlphaFilter(img);
    CIImage *backgroundAlpha = applySourceAlphaFilter(background);
    [resultByName setObject:img forKey:@"SourceGraphic"];
    [resultByName setObject:sourceAlpha forKey:@"SourceAlpha"];
    [resultByName setObject:background forKey:@"BackgroundImage"];
    [resultByName setObject:backgroundAlpha forKey:@"BackgroundAlpha"];

    CIImage *result = img;
    for (UIView *node in self.subviews) {
        if ([node isKindOfClass:[RNSVGFilterPrimitive class]]) {
            RNSVGFilterPrimitive *n = (RNSVGFilterPrimitive *)node;
            result = [n applyFilter:resultByName previousFilterResult:result];
            NSString *resultName = n.result;
            if (resultName) {
                [resultByName setObject:sourceAlpha forKey:resultName];
            }
        }
    };

    return result;
}

static CIImage *transparentImage()
{
    static CIImage *transparentImage = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        CIFilter *transparent = [CIFilter filterWithName:@"CIConstantColorGenerator"];
        [transparent setValue:[CIColor colorWithRed:0.0 green:0.0 blue:0.0 alpha:0.0] forKey:@"inputColor"];
        transparentImage = [transparent valueForKey:@"outputImage"];
    });
    return transparentImage;
}

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    return nil;
}

- (void)parseReference
{
    [self.svgView defineFilter:self filterName:self.name];
}

static CIFilter * sourceAlphaFilter() {
    CIFilter *sourceAlpha = [CIFilter filterWithName:@"CIColorMatrix"];
    CGFloat zero[4] = {0, 0, 0, 0};
    [sourceAlpha setDefaults];
    [sourceAlpha setValue:[CIVector vectorWithValues:zero count:4] forKey:@"inputRVector"];
    [sourceAlpha setValue:[CIVector vectorWithValues:zero count:4] forKey:@"inputGVector"];
    [sourceAlpha setValue:[CIVector vectorWithValues:zero count:4] forKey:@"inputBVector"];
    [sourceAlpha setValue:[CIVector vectorWithX:0.0 Y:0.0 Z:0.0 W:1.0] forKey:@"inputAVector"];
    [sourceAlpha setValue:[CIVector vectorWithValues:zero count:4] forKey:@"inputBiasVector"];
    return sourceAlpha;
}

static CIImage *applySourceAlphaFilter(CIImage *inputImage)
{
    CIFilter * sourceAlpha = sourceAlphaFilter();
    [sourceAlpha setValue:inputImage forKey:@"inputImage"];
    return [sourceAlpha valueForKey:@"outputImage"];
}

- (void)setX:(RNSVGLength *)x
{
    if ([x isEqualTo:_x]) {
        return;
    }

    _x = x;
    [self invalidate];
}

- (void)setY:(RNSVGLength *)y
{
    if ([y isEqualTo:_y]) {
        return;
    }

    _y = y;
    [self invalidate];
}

- (void)setWidth:(RNSVGLength *)width
{
    if ([width isEqualTo:_width]) {
        return;
    }

    _width = width;
    [self invalidate];
}

- (void)setHeight:(RNSVGLength *)height
{
    if ([height isEqualTo:_height]) {
        return;
    }

    _height = height;
    [self invalidate];
}

- (void)setFilterUnits:(RNSVGUnits)filterUnits
{
    if (filterUnits == _filterUnits) {
        return;
    }

    _filterUnits = filterUnits;
    [self invalidate];
}

- (void)setPrimitiveUnits:(RNSVGUnits)primitiveUnits
{
    if (primitiveUnits == _primitiveUnits) {
        return;
    }

    _primitiveUnits = primitiveUnits;
    [self invalidate];
}

@end

