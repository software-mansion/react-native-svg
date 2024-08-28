#import "RNSVGArithmeticFilter.h"

static CIColorKernel *arithmeticFilter = nil;

@implementation RNSVGArithmeticFilter

- (id)init
{
  if (arithmeticFilter == nil) {
    NSBundle *frameworkBundle = [NSBundle bundleForClass:[self class]];
    NSURL *bundleUrl = [frameworkBundle.resourceURL URLByAppendingPathComponent:@"RNSVGFilters.bundle"];
    NSBundle *bundle = [NSBundle bundleWithURL:bundleUrl];
    NSURL *url = [bundle URLForResource:@"RNSVGArithmeticFilter" withExtension:@"metallib"];
    NSLog(@"%@", url);
    if (url != nil) {
      NSError *error = nil;
      NSData *data = [NSData dataWithContentsOfURL:url options:0 error:&error];

      if (error) {
        NSLog(@"%@", error);
        @throw [NSException exceptionWithName:@"KernelInitializationException"
                                       reason:error.localizedDescription
                                     userInfo:nil];
      }

      @try {
        arithmeticFilter = [CIColorKernel kernelWithFunctionName:@"arithmeticComposite"
                                            fromMetalLibraryData:data
                                                           error:&error];
        if (error) {
          NSLog(@"%@", error);
          @throw [NSException exceptionWithName:@"KernelInitializationException"
                                         reason:error.localizedDescription
                                       userInfo:nil];
        }
      } @catch (NSException *exception) {
        NSLog(@"%@", exception);
      }
    }
  }
  return [super init];
}

- (NSDictionary *)customAttributes
{
  //    CIImage  *inputImage1;
  //    CIImage  *inputImage2;
  //    NSNumber *inputK1;
  //    NSNumber *inputK2;
  //    NSNumber *inputK3;
  //    NSNumber *inputK4;
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
                               roiCallback:^CGRect(int index, CGRect rect) {
                                 return rect;
                               }
                                 arguments:@[ in1, in2, inputK1, inputK2, inputK3, inputK4 ]];
}

+ (void)initialize
{
  [CIFilter
      registerFilterName:@"arithmeticComposite"
             constructor:(id<CIFilterConstructor>)self
         classAttributes:@{
           kCIAttributeFilterDisplayName : @"RNSVG Arithmetic Composite",
           kCIAttributeFilterCategories :
               @[ kCICategoryColorAdjustment, kCICategoryStillImage, kCICategoryInterlaced, kCICategoryNonSquarePixels ]
         }];
}

+ (CIFilter *)filterWithName:(NSString *)name
{
  CIFilter *filter;
  filter = [[self alloc] init];
  return filter;
}

@end
