/*
 * Copyright (C) 2005 Oliver Hunt <ojh16@student.canterbury.ac.nz>.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#import "WKSpecularLightingFilter.h"

static CIKernel *specularLightingFilter = nil;

@implementation WKSpecularLightingFilter
+ (void)initialize
{
    id<CIFilterConstructor> anObject = (id<CIFilterConstructor>)self;
    [CIFilter registerFilterName:@"WKSpecularLighting"
                     constructor:anObject
                 classAttributes:[NSDictionary dictionaryWithObjectsAndKeys:
                                  @"WebKit Specular Lighting", kCIAttributeFilterDisplayName,
                                  [NSArray arrayWithObjects:kCICategoryStylize, kCICategoryVideo,
                                   kCICategoryStillImage, kCICategoryNonSquarePixels,nil], kCIAttributeFilterCategories,
                                  [NSDictionary dictionaryWithObjectsAndKeys:
                                   [CIColor colorWithRed:1.0f green:1.0f blue:1.0f alpha:1.0f],
                                   kCIAttributeDefault, nil],  @"inputLightingColor",
                                  [NSDictionary dictionaryWithObjectsAndKeys:
                                   [NSNumber numberWithDouble:0.0], kCIAttributeMin,
                                   [NSNumber numberWithDouble:1.0], kCIAttributeDefault,
                                   [NSNumber numberWithDouble:1.0], kCIAttributeIdentity,
                                   kCIAttributeTypeScalar, kCIAttributeType,
                                   nil], @"inputSurfaceScale",
                                  [NSDictionary dictionaryWithObjectsAndKeys:
                                   [NSNumber numberWithDouble:0.0], kCIAttributeMin,
                                   [NSNumber numberWithDouble:1.0], kCIAttributeDefault,
                                   [NSNumber numberWithDouble:1.0], kCIAttributeIdentity,
                                   kCIAttributeTypeScalar, kCIAttributeType,
                                   nil], @"inputSpecularConstant",
                                  [NSDictionary dictionaryWithObjectsAndKeys:
                                   [NSNumber numberWithDouble:0.0], kCIAttributeMin,
                                   [NSNumber numberWithDouble:128.0], kCIAttributeMin,
                                   [NSNumber numberWithDouble:1.0], kCIAttributeDefault,
                                   [NSNumber numberWithDouble:1.0], kCIAttributeIdentity,
                                   kCIAttributeTypeScalar, kCIAttributeType,
                                   nil], @"inputSpecularExponent",
                                  [NSDictionary dictionaryWithObjectsAndKeys:
                                   kCIAttributeTypeOffset, kCIAttributeType,
                                   nil], @"inputKernelUnitLength",
                                  nil]];
}

+ (CIFilter *)filterWithName:(NSString *)name
{
    return [[self alloc] init];
}

- (id)init
{
    if (!specularLightingFilter) {
        NSString *code =
        @"kernel vec4 basic(sampler inputNormalVectors, sampler inputLightVectors, __color inputLightingColor, float inputSurfaceScale, float inputSpecularConstant,\
        float inputSpecularExponent, float inputKernelUnitLengthX, float inputKernelUnitLengthY)\
        {\
        vec2 pos = samplerCoord(inputLightVectors);\
        vec2 posn = samplerCoord(inputNormalVectors);\
        vec3 l = sample(inputLightVectors, pos).xyz;\
        vec3 n = sample(inputNormalVectors, posn).xyz;\
        vec3 h = l+vec3(0.0, 0.0, 1.0);\
        h = normalize(h);\
        float nh = inputSpecularConstant*pow((dot(n, h)), inputSpecularExponent);\
        vec4 res = inputLightingColor * nh;\
        res.a = max(res.r, res.g);\
        res.a = max(res.a, res.b);\
        return res;\
        }";
        specularLightingFilter = [CIKernel kernelWithString:code];
    }
    return [super init];
}

- (CIImage *)outputImage
{
    CIImage *result = inputImage;
    CIKernelROICallback callback = ^CGRect(int index, CGRect rect) {
        return CGRectMake(0, 0, CGRectGetWidth(result.extent), CGRectGetHeight(result.extent));
    };
    return [specularLightingFilter applyWithExtent:result.extent roiCallback:callback arguments:@[inputNormalMap, inputLightVectors, inputLightingColor, inputSurfaceScale, inputSpecularConstant, inputSpecularExponent, inputKernelUnitLengthX, inputKernelUnitLengthY]];
}

@end
