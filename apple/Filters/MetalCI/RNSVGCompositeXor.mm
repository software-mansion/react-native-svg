#import "RNSVGCompositeXor.h"

static CIColorKernel *compositeXor = nil;

@implementation RNSVGCompositeXor

- (id)init
{
  if (compositeXor == nil) {
    compositeXor = [super getWithName:@"RNSVGCompositeXor"];
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
  };
}

- (CIImage *)outputImage
{
  CISampler *in1 = [CISampler samplerWithImage:inputImage1];
  CISampler *in2 = [CISampler samplerWithImage:inputImage2];

  return [compositeXor applyWithExtent:inputImage1.extent arguments:@[ in1, in2 ]];
}

@end
