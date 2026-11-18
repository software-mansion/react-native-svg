#import "RNSVGRenderUtils.h"

@implementation RNSVGRenderUtils

+ (CIContext *)sharedCIContext
{
  static CIContext *sharedCIContext = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedCIContext = [[CIContext alloc] init];
  });

  return sharedCIContext;
}

+ (CGFloat)getScreenScale
{
  CGFloat scale = 0.0;
#if TARGET_OS_OSX
  scale = [[NSScreen mainScreen] backingScaleFactor];
#else
  if (@available(iOS 13.0, *)) {
    scale = [UITraitCollection currentTraitCollection].displayScale;
  } else {
#if !TARGET_OS_VISION
    scale = [[UIScreen mainScreen] scale];
#endif
  }
#endif // TARGET_OS_OSX
  return scale;
}

+ (CGImage *)renderToImage:(RNSVGRenderable *)renderable
                       ctm:(CGAffineTransform)ctm
                      rect:(CGRect)rect
                      clip:(CGRect *)clip
{
  CGFloat scale = [self getScreenScale];
#if TARGET_OS_OSX // [macOS
  RNSVGUIGraphicsBeginImageContextWithOptions(rect.size, NO, 1.0);
  CGContextRef cgContext = UIGraphicsGetCurrentContext();
  CGContextConcatCTM(cgContext, CGAffineTransformInvert(CGContextGetCTM(cgContext)));
  CGContextConcatCTM(cgContext, CGAffineTransformMakeScale(scale, scale));
  CGContextConcatCTM(cgContext, ctm);

  if (clip) {
    CGContextClipToRect(cgContext, *clip);
  }
  [renderable renderLayerTo:cgContext rect:rect];
  CGImageRef contentImage = CGBitmapContextCreateImage(cgContext);
  RNSVGUIGraphicsEndImageContext();
  return contentImage;
#else // macOS]
  // UIGraphicsBeginImageContextWithOptions asserts when it cannot allocate the bitmap.
  UIGraphicsImageRendererFormat *format = [UIGraphicsImageRendererFormat defaultFormat];
  format.scale = scale;
  format.preferredRange = UIGraphicsImageRendererFormatRangeStandard;
  UIGraphicsImageRenderer *renderer = [[UIGraphicsImageRenderer alloc] initWithSize:rect.size format:format];
  UIImage *image = [renderer imageWithActions:^(UIGraphicsImageRendererContext *_Nonnull rendererContext) {
    CGContextRef cgContext = rendererContext.CGContext;
    CGContextConcatCTM(cgContext, CGAffineTransformInvert(CGContextGetCTM(cgContext)));
    CGContextConcatCTM(cgContext, ctm);

    if (clip) {
      CGContextClipToRect(cgContext, *clip);
    }
    [renderable renderLayerTo:cgContext rect:rect];
  }];
  return CGImageRetain(image.CGImage);
#endif // [macOS]
}

@end
