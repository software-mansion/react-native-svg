#import <CoreImage/CoreImage.h>

@interface RNSVGArithmeticFilter : CIFilter {
  CIImage *inputImage1;
  CIImage *inputImage2;
  NSNumber *inputK1;
  NSNumber *inputK2;
  NSNumber *inputK3;
  NSNumber *inputK4;
}

@end
