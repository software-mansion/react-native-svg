#import "RNSVGArithmeticFilter.h"

static CIColorKernel *arithmeticFilter = nil;

@implementation RNSVGArithmeticFilter

- (id)init
{
  if (arithmeticFilter == nil) {
    arithmeticFilter = [super getWithName:@"RNSVGArithmeticFilter"];
  }
  return [super init];
}

- (NSDictionary *)customAttributes
{
  return @{
    @"inputImage1" : @{
      kCIAttributeIdentity : @0,
      kCIAttributeClass : @"CIImage",
      kCIAttributeDisplayName : @"in1",
      kCIAttributeType : kCIAttributeTypeImage
    },
    @"inputImage2" : @{
      kCIAttributeIdentity : @0,
      kCIAttributeClass : @"CIImage",
      kCIAttributeDisplayName : @"in2",
      kCIAttributeType : kCIAttributeTypeImage
    },
    @"inputK1" : @{
      kCIAttributeIdentity : @0,
      kCIAttributeClass : @"NSNumber",
      kCIAttributeDisplayName : @"k1",
      kCIAttributeType : kCIAttributeTypeScalar
    },
    @"inputK2" : @{
      kCIAttributeIdentity : @0,
      kCIAttributeClass : @"NSNumber",
      kCIAttributeDisplayName : @"k2",
      kCIAttributeType : kCIAttributeTypeScalar
    },
    @"inputK3" : @{
      kCIAttributeIdentity : @0,
      kCIAttributeClass : @"NSNumber",
      kCIAttributeDisplayName : @"k3",
      kCIAttributeType : kCIAttributeTypeScalar
    },
    @"inputK4" : @{
      kCIAttributeIdentity : @0,
      kCIAttributeClass : @"NSNumber",
      kCIAttributeDisplayName : @"k4",
      kCIAttributeType : kCIAttributeTypeScalar
    },
  };
}

- (CIImage *)outputImage
{
  CISampler *in1 = [CISampler samplerWithImage:inputImage1];
  CISampler *in2 = [CISampler samplerWithImage:inputImage2];

  return [arithmeticFilter applyWithExtent:inputImage1.extent
                                 arguments:@[ in1, in2, inputK1, inputK2, inputK3, inputK4 ]];
}

@end
