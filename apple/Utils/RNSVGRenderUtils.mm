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

+ (CGImage *)renderToImage:(RNSVGRenderable *)renderable
                       ctm:(CGAffineTransform)ctm
                      rect:(CGRect)rect
                      clip:(CGRect *)clip
{
  UIGraphicsBeginImageContextWithOptions(rect.size, NO, 1.0);
  CGContextRef cgContext = UIGraphicsGetCurrentContext();
  CGContextConcatCTM(cgContext, CGAffineTransformInvert(CGContextGetCTM(cgContext)));
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
