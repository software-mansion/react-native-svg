#import "RNSVGCustomFilter.h"

@interface RNSVGArithmeticFilter : RNSVGCustomFilter {
  CIImage *inputImage2;
  NSNumber *inputK1;
  NSNumber *inputK2;
  NSNumber *inputK3;
  NSNumber *inputK4;
}

@end
