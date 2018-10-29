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

#import "WKNormalMapFilter.h"

static CIKernel *convolveKernel = nil;
static CIKernel *normalMapKernel = nil;

@implementation WKNormalMapFilter

+ (void)initialize
{
    id<CIFilterConstructor> anObject = (id<CIFilterConstructor>)self;
    [CIFilter registerFilterName:@"WKNormalMap"
                     constructor:anObject
                 classAttributes:[NSDictionary dictionaryWithObjectsAndKeys:
                                  @"WebKit Normal Map", kCIAttributeFilterDisplayName,
                                  [NSArray arrayWithObjects: kCICategoryBlur, kCICategoryVideo,
                                   kCICategoryStillImage, kCICategoryNonSquarePixels, nil], kCIAttributeFilterCategories,
                                  [NSDictionary dictionaryWithObjectsAndKeys:
                                   [NSNumber numberWithDouble:0.0], kCIAttributeMin,
                                   [NSNumber numberWithDouble:1.0], kCIAttributeDefault,
                                   [NSNumber numberWithDouble:1.0], kCIAttributeIdentity,
                                   kCIAttributeTypeScalar, kCIAttributeType,
                                   nil], @"inputSurfaceScale",
                                  nil]];
}

+ (CIFilter *)filterWithName:(NSString *)name
{
    return [[self alloc] init];
}

- (id)init
{
    if (!normalMapKernel) {
        // https://github.com/xebecnan/EAWebkit/blob/master/Webkit-owb/WebCore/svg/graphics/filters/cg/WKPointLightFilter.cikernel
        //TODO: We currently ignore the input kernel lengths
        NSString *code =
        @"kernel vec4 convolve3x3(sampler image,  float divisor, float bias,\
                                vec3 m0, vec3 m1, vec3 m2)\
        {\
            vec4 colour = vec4(0.0, 0.0, 0.0, 0.0);\
            vec2 pos= samplerCoord(image);\
            colour =  sample(image, pos + vec2(-1.0, -1.0)) *m0.x;\
            colour += sample(image, pos + vec2(-1.0,  0.0)) *m0.y;\
            colour += sample(image, pos + vec2(-1.0,  1.0)) *m0.z;\
            colour += sample(image, pos + vec2( 0.0, -1.0)) *m1.x;\
            colour += sample(image, pos) * m1.y;\
            colour += sample(image, pos + vec2( 0.0,  1.0))*m1.z;\
            colour += sample(image, pos + vec2( 1.0, -1.0))*m2.x;\
            colour += sample(image, pos + vec2( 1.0,  0.0))*m2.y;\
            colour += sample(image, pos + vec2( 1.0,  1.0))*m2.z;\
            return colour / divisor + bias;\
        }\
        \
        kernel vec4 mergeNormals(sampler Nx, sampler Ny, sampler src, float surfaceScale)\
        {\
            vec3 N = vec3(surfaceScale * sample(Nx, samplerCoord(Nx)).a, -surfaceScale * sample(Ny, samplerCoord(Ny)).a, 1.0);\
            N = normalize(N);\
            return vec4(N.x, N.y, N.z, sample(src, samplerCoord(src)).a);\
        }";
        NSArray *kernels = [CIKernel kernelsWithString:code];
        convolveKernel = [kernels objectAtIndex:0];
        normalMapKernel = [kernels objectAtIndex:1];
    }
    return [super init];
}

- (NSArray *)xConvolveArgsWithBumpMap:(CISampler *)bumpMap {
    return [NSArray arrayWithObjects:
            bumpMap,
            [NSNumber numberWithFloat:4],
            [NSNumber numberWithFloat:0],
            [CIVector vectorWithX:1 Y:2 Z:1],
            [CIVector vectorWithX:0 Y:0 Z:0],
            [CIVector vectorWithX:-1 Y:-2 Z:-1],
            nil];
}

- (NSArray *)yConvolveArgsWithBumpMap:(CISampler *)bumpMap {
    return [NSArray arrayWithObjects:
            bumpMap,
            [NSNumber numberWithFloat:4],
            [NSNumber numberWithFloat:0],
            [CIVector vectorWithX:1 Y:0 Z:-1],
            [CIVector vectorWithX:2 Y:0 Z:-2],
            [CIVector vectorWithX:1 Y:0 Z:-1],
            nil];
}

- (CIImage *)outputImage
{
    CIImage *result = inputImage;
    CIKernelROICallback callback = ^CGRect(int index, CGRect rect) {
        return CGRectMake(0, 0, CGRectGetWidth(result.extent), CGRectGetHeight(result.extent));
    };
    CISampler *image = [CISampler samplerWithImage:inputImage];
    /*
     NSDictionary *applyOptions = [NSDictionary dictionaryWithObjectsAndKeys:[image definition], kCIApplyOptionDefinition, nil];
     CIImage *convolveX = [self apply:convolveKernel arguments:[self xConvolveArgsWithBumpMap:image] options:applyOptions];
     CIImage *convolveY = [self apply:convolveKernel arguments:[self yConvolveArgsWithBumpMap:image] options:applyOptions];
     */
    CIImage *convolveX = [convolveKernel applyWithExtent:result.extent roiCallback:callback arguments:[self xConvolveArgsWithBumpMap:image]];
    CIImage *convolveY = [convolveKernel applyWithExtent:result.extent roiCallback:callback arguments:[self yConvolveArgsWithBumpMap:image]];
    
    CISampler *samplerX = [CISampler samplerWithImage:convolveX];
    CISampler *samplerY = [CISampler samplerWithImage:convolveY];
    
    NSArray *normalMapArgs = [NSArray arrayWithObjects:samplerX, samplerY, image, inputSurfaceScale, nil];
    return [normalMapKernel applyWithExtent:result.extent roiCallback:callback arguments:normalMapArgs];
}

@end
