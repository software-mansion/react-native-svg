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
  UIGraphicsBeginImageContextWithOptions(rect.size, NO, 1.0);
#else // macOS]
  UIGraphicsBeginImageContextWithOptions(rect.size, NO, scale);
#endif // [macOS]
  CGContextRef cgContext = UIGraphicsGetCurrentContext();
  CGContextConcatCTM(cgContext, CGAffineTransformInvert(CGContextGetCTM(cgContext)));
#if TARGET_OS_OSX // [macOS
  CGContextConcatCTM(cgContext, CGAffineTransformMakeScale(scale, scale));
#endif // macOS]
  CGContextConcatCTM(cgContext, ctm);

  if (clip) {
    CGContextClipToRect(cgContext, *clip);
  }
  [renderable renderLayerTo:cgContext rect:rect];
  CGImageRef contentImage = CGBitmapContextCreateImage(cgContext);
  UIGraphicsEndImageContext();
  return contentImage;
}

@end
