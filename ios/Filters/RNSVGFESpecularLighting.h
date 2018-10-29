#import "RNSVGFilterPrimitive.h"
#import "RNSVGFEPointLight.h"
#import "RNSVGLightSource.h"

@interface RNSVGFESpecularLighting : RNSVGFilterPrimitive

@property (nonatomic, strong) NSString *in1;
@property (nonatomic, strong) NSNumber *surfaceScale;
@property (nonatomic, strong) NSNumber *specularConstant;
@property (nonatomic, strong) NSNumber *specularExponent;
@property (nonatomic, strong) NSNumber *kernelUnitLengthX;
@property (nonatomic, strong) NSNumber *kernelUnitLengthY;
@property (null_resettable, nonatomic, strong) UIColor *lightingColor;

@end
