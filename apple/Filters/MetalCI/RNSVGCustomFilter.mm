#import "RNSVGCustomFilter.h"

#if TARGET_OS_OSX
#define extension @"macosx.metallib"
#elif TARGET_OS_IOS
#define extension @"iphoneos.metallib"
#elif TARGET_OS_TV
#define extension @"tvos.metallib"
#elif TARGET_OS_VISION
#define extension @"xros.metallib"
#endif

@implementation RNSVGCustomFilter

- (CIColorKernel *)getWithName:(NSString *)name
{
#if SWIFT_PACKAGE
  NSBundle *bundle = nil;
  @try {
    bundle = SWIFTPM_MODULE_BUNDLE;
  } @catch (NSException *exception) {
    NSLog(@"RNSVG CustomFilter exception: %@", exception);
    return nil;
  }
#else
  NSBundle *frameworkBundle = [NSBundle bundleForClass:[self class]];
  NSURL *bundleUrl = [frameworkBundle.resourceURL URLByAppendingPathComponent:@"RNSVGFilters.bundle"];
  NSBundle *bundle = [NSBundle bundleWithURL:bundleUrl];
#endif
  NSURL *url = [bundle URLForResource:name withExtension:extension];

  if (url != nil) {
    NSError *error = nil;
    NSData *data = [NSData dataWithContentsOfURL:url options:0 error:&error];

    @try {
      return [CIColorKernel kernelWithFunctionName:name fromMetalLibraryData:data error:&error];
    } @catch (NSException *exception) {
      NSLog(@"RNSVG CustomFilter exception: %@", exception);
    }
  }
  return nil;
}

@end
