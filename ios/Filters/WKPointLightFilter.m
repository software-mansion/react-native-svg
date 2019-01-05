/*
 * Copyright (C) 2005 Apple Computer, Inc.  All rights reserved.
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
 * THIS SOFTWARE IS PROVIDED BY APPLE COMPUTER, INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE COMPUTER, INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#import "WKPointLightFilter.h"

static CIKernel *pointLightFilter = nil;

@implementation WKPointLightFilter

+ (void)initialize
{
    id<CIFilterConstructor> anObject = (id<CIFilterConstructor>)self;
    [CIFilter registerFilterName:@"WKPointLight"
                     constructor:anObject
                 classAttributes:[NSDictionary dictionaryWithObjectsAndKeys:
                                  @"WebKit Point Light", kCIAttributeFilterDisplayName,
                                  [NSArray arrayWithObjects:kCICategoryStylize, kCICategoryVideo,
                                   kCICategoryStillImage, kCICategoryNonSquarePixels,nil], kCIAttributeFilterCategories,
                                  [NSDictionary dictionaryWithObjectsAndKeys:
                                   kCIAttributeTypePosition3, kCIAttributeType,
                                   nil], @"inputLightPosition",
                                  nil]];
}

+ (CIFilter *)filterWithName:(NSString *)name
{
    return [[self alloc] init];
}

- (id)init
{
    if (!pointLightFilter) {
        // https://github.com/xebecnan/EAWebkit/blob/master/Webkit-owb/WebCore/svg/graphics/filters/cg/WKPointLightFilter.cikernel
        NSString *code =
        @"kernel vec4 genPointLight(sampler normalMap, vec3 lightPos, float surfaceScale)\
        {\
            vec2 pos = samplerCoord(normalMap);\
            vec3 P = vec3(pos.x, pos.y, surfaceScale * sample(normalMap, pos).a);\
            vec3 L = lightPos - P;\
            L = normalize(L);\
            return vec4(L.x, L.y, L.z, 1.0);\
        }";
        pointLightFilter = [CIKernel kernelWithString:code];
    }
    return [super init];
}

- (CIImage *)outputImage
{
    CIImage *result = inputImage;
    CIKernelROICallback callback = ^CGRect(int index, CGRect rect) {
        return CGRectMake(0, 0, CGRectGetWidth(result.extent), CGRectGetHeight(result.extent));
    };
    return [pointLightFilter applyWithExtent:result.extent roiCallback:callback arguments:@[inputNormalMap, inputLightPosition, inputSurfaceScale]];
}

@end
