#import <CoreImage/CoreImage.h>

@interface RNSVGCompositeXor : CIFilter {
  CIImage *inputImage1;
  CIImage *inputImage2;
}

@end