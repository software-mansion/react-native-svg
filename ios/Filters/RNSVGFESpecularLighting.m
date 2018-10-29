/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGFESpecularLighting.h"
#import "WKSpecularLightingFilter.h"
#import "WKPointLightFilter.h"
#import "WKNormalMapFilter.h"

@implementation RNSVGFESpecularLighting

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results
    previousFilterResult:(CIImage *)previous
{
    CIImage *inResult = self.in1 ? [results objectForKey:self.in1] : nil;
    CIImage *inputImage = inResult ? inResult : previous;
    if (!inputImage) {
        return nil;
    }
    
    // Based on: https://github.com/xebecnan/EAWebkit/blob/master/Webkit-owb/WebCore/svg/graphics/filters/cg/SVGFESpecularLightingCg.mm
    
    [WKSpecularLightingFilter class];
    CIFilter* filter = [CIFilter filterWithName:@"WKSpecularLighting"];
    [filter setDefaults];
    float surfaceScale = [self.surfaceScale floatValue];
    float specularConstant = [self.specularConstant floatValue];
    float specularExponent = [self.specularExponent floatValue];
    float kernelUnitLengthX = [self.kernelUnitLengthX floatValue];
    float kernelUnitLengthY = [self.kernelUnitLengthY floatValue];
    CIFilter* normals = getNormalMap(inputImage, surfaceScale);
    if (!normals)
        return nil;
    RNSVGLightSource *light = self.subviews[0];
    CIFilter* lightVectors = getLightVectors(normals, light, surfaceScale);
    if (!lightVectors)
        return nil;
    [lightVectors setValue:inputImage forKey:@"inputImage"];
    [filter setValue:inputImage forKey:@"inputImage"];
    [filter setValue:[normals valueForKey:@"outputImage"] forKey:@"inputNormalMap"];
    [filter setValue:[lightVectors valueForKey:@"outputImage"] forKey:@"inputLightVectors"];
    
    CGFloat r;
    CGFloat g;
    CGFloat b;
    CGFloat a;
    [self.lightingColor getRed:&r green:&g blue:&b alpha:&a];
    CIColor* colorCI = [CIColor colorWithRed:r green:g blue:b alpha:a];
    
    [filter setValue:colorCI forKey:@"inputLightingColor"];
    [filter setValue:[NSNumber numberWithFloat:surfaceScale] forKey:@"inputSurfaceScale"];
    [filter setValue:[NSNumber numberWithFloat:specularConstant] forKey:@"inputSpecularConstant"];
    [filter setValue:[NSNumber numberWithFloat:specularExponent] forKey:@"inputSpecularExponent"];
    [filter setValue:[NSNumber numberWithFloat:kernelUnitLengthX] forKey:@"inputKernelUnitLengthX"];
    [filter setValue:[NSNumber numberWithFloat:kernelUnitLengthY] forKey:@"inputKernelUnitLengthY"];
    
    if (filter) {
        return [filter valueForKey:@"outputImage"];
    }
    
    return previous;
}

- (void)setIn1:(NSString *)in1
{
    if ([in1 isEqualToString:_in1]) {
        return;
    }
    
    _in1 = in1;
    [self invalidate];
}

- (void)setLightingColor:(UIColor *)lightingColor
{
    if (lightingColor == _lightingColor) {
        return;
    }
    
    _lightingColor = lightingColor;
    [self invalidate];
}

- (void)setSurfaceScale:(NSNumber *)surfaceScale
{
    if (surfaceScale == _surfaceScale) {
        return;
    }
    _surfaceScale = surfaceScale;
    [self invalidate];
}

- (void)setSpecularConstant:(NSNumber *)specularConstant
{
    if (specularConstant == _specularConstant) {
        return;
    }
    _specularConstant = specularConstant;
    [self invalidate];
}

- (void)setSpecularExponent:(NSNumber *)specularExponent
{
    if (specularExponent == _specularExponent) {
        return;
    }
    _specularExponent = specularExponent;
    [self invalidate];
}

- (void)setKernelUnitLengthX:(NSNumber *)kernelUnitLengthX
{
    if (kernelUnitLengthX == _kernelUnitLengthX) {
        return;
    }
    _kernelUnitLengthX = kernelUnitLengthX;
    [self invalidate];
}

- (void)setKernelUnitLengthY:(NSNumber *)kernelUnitLengthY
{
    if (kernelUnitLengthY == _kernelUnitLengthY) {
        return;
    }
    _kernelUnitLengthY = kernelUnitLengthY;
    [self invalidate];
}

// Lighting
CIFilter* getPointLightVectors(CIFilter* normals, CIVector* lightPosition, float surfaceScale)
{
    CIFilter* filter;
    filter = [CIFilter filterWithName:@"WKPointLight"];
    if (!filter)
        return nil;
    [filter setDefaults];
    [filter setValue:[normals valueForKey:@"outputImage"] forKey:@"inputNormalMap"];
    [filter setValue:lightPosition forKey:@"inputLightPosition"];
    [filter setValue:[NSNumber numberWithFloat:surfaceScale] forKey:@"inputSurfaceScale"];
    return filter;
}

CIFilter* getLightVectors(CIFilter* normals, const RNSVGLightSource* light, float surfaceScale)
{
    //[WKDistantLightFilter class];
    [WKPointLightFilter class];
    //[WKSpotLightFilter class];
    
    switch (light.type) {
            /*
        case LS_DISTANT:
        {
            const SVGDistantLightSource* dlight = static_cast<const SVGDistantLightSource*>(light);
            
            filter = [CIFilter filterWithName:@"WKDistantLight"];
            if (!filter)
                return nil;
            [filter setDefaults];
            
            float azimuth = dlight->azimuth();
            float elevation = dlight->elevation();
            azimuth = deg2rad(azimuth);
            elevation = deg2rad(elevation);
            float Lx = cosf(azimuth)*cosf(elevation);
            float Ly = sinf(azimuth)*cosf(elevation);
            float Lz = sinf(elevation);
            
            [filter setValue:[normals valueForKey:@"outputImage"] forKey:@"inputNormalMap"];
            [filter setValue:[CIVector vectorWithX:Lx Y:Ly Z:Lz] forKey:@"inputLightDirection"];
            return filter;
        }
            */
        case LS_POINT:
        {
            RNSVGFEPointLight *plight = (RNSVGFEPointLight*) light;
            CGFloat x = (CGFloat)[plight.x doubleValue];
            CGFloat y = (CGFloat)[plight.y doubleValue];
            CGFloat z = (CGFloat)[plight.z doubleValue];
            return getPointLightVectors(normals, [CIVector vectorWithX:x Y:y Z:z], surfaceScale);
        }
            /*
        case LS_SPOT:
        {
            const SVGSpotLightSource* slight = static_cast<const SVGSpotLightSource*>(light);
            filter = [CIFilter filterWithName:@"WKSpotLight"];
            if (!filter)
                return nil;
            
            CIFilter* pointLightFilter = getPointLightVectors(normals, [CIVector vectorWithX:slight->position().x() Y:slight->position().y() Z:slight->position().z()], surfaceScale);
            if (!pointLightFilter)
                return nil;
            [filter setDefaults];
            
            [filter setValue:[pointLightFilter valueForKey:@"outputImage"] forKey:@"inputLightVectors"];
            [filter setValue:[CIVector vectorWithX:slight->direction().x() Y:slight->direction().y() Z:slight->direction().z()] forKey:@"inputLightDirection"];
            [filter setValue:[NSNumber numberWithFloat:slight->specularExponent()] forKey:@"inputSpecularExponent"];
            [filter setValue:[NSNumber numberWithFloat:deg2rad(slight->limitingConeAngle())] forKey:@"inputLimitingConeAngle"];
            return filter;
        }
             */
        default:
            return nil;
    }
    
    return nil;
}

CIFilter* getNormalMap(CIImage* bumpMap, float scale)
{
    [WKNormalMapFilter class];
    CIFilter* filter;
    filter = [CIFilter filterWithName:@"WKNormalMap"];
    [filter setDefaults];
    
    [filter setValue:bumpMap forKey:@"inputImage"];
    [filter setValue:[NSNumber numberWithFloat:scale] forKey:@"inputSurfaceScale"];
    return filter;
}

- (void)dealloc
{
    return;
}

@end

