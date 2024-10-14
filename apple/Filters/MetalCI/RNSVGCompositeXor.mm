#import "RNSVGCompositeXor.h"

static CIColorKernel *compositeXor = nil;

@implementation RNSVGCompositeXor

- (id)init
{
  if (compositeXor == nil) {
    NSBundle *frameworkBundle = [NSBundle bundleForClass:[self class]];
    NSURL *bundleUrl = [frameworkBundle.resourceURL URLByAppendingPathComponent:@"RNSVGFilters.bundle"];
    NSBundle *bundle = [NSBundle bundleWithURL:bundleUrl];
    NSURL *url = [bundle URLForResource:@"RNSVGCompositeXor" withExtension:@"metallib"];
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
        compositeXor = [CIColorKernel kernelWithFunctionName:@"compositeXor" fromMetalLibraryData:data error:&error];
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

  return [compositeXor applyWithExtent:inputImage1.extent
                           roiCallback:^CGRect(int index, CGRect rect) {
                             return rect;
                           }
                             arguments:@[ in1, in2 ]];
}

+ (void)initialize
{
  [CIFilter
      registerFilterName:@"compositeXor"
             constructor:(id<CIFilterConstructor>)self
         classAttributes:@{
           kCIAttributeFilterDisplayName : @"RNSVG Composite XOR",
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
