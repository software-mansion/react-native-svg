#import "RNSVGUIKit.h"
#import <objc/runtime.h>

@implementation RNSVGView {
}

- (CGPoint)center
{
  NSRect frameRect = self.frame;
  CGFloat xCenter = frameRect.origin.x + frameRect.size.width / 2;
  CGFloat yCenter = frameRect.origin.y + frameRect.size.height / 2;
  return CGPointMake(xCenter, yCenter);
}

- (void)setCenter:(CGPoint)point
{
  NSRect frameRect = self.frame;
  CGFloat xOrigin = frameRect.origin.x - frameRect.size.width / 2;
  CGFloat yOrigin = frameRect.origin.y - frameRect.size.height / 2;
  self.frame = CGRectMake(xOrigin, yOrigin, frameRect.size.width, frameRect.size.height);
}

@end

@implementation NSImage (RNSVGMacOSExtensions)

- (CGImageRef)CGImage
{
  return [self CGImageForProposedRect:NULL context:NULL hints:NULL];
}

@end

@implementation NSValue (RNSVGMacOSExtensions)

+ (NSValue *)valueWithCGAffineTransform:(CGAffineTransform)transform
{
  return [NSValue valueWithBytes:&transform objCType:@encode(CGAffineTransform)];
}

+ (NSValue *)valueWithCGPoint:(CGPoint)point
{
  return [NSValue valueWithBytes:&point objCType:@encode(CGPoint)];
}

- (CGAffineTransform)CGAffineTransformValue
{
  CGAffineTransform value;
  [self getValue:&value];
  return value;
}

- (CGPoint)CGPointValue
{
  CGPoint value;
  [self getValue:&value];
  return value;
}

@end

static char RCTGraphicsContextSizeKey;

void RNSVGUIGraphicsBeginImageContextWithOptions(CGSize size, __unused BOOL opaque, CGFloat scale)
{
  if (scale == 0.0) {
    // TODO: Assert. We can't assume a display scale on macOS
    scale = 1.0;
  }

  size_t width = ceilf(size.width * scale);
  size_t height = ceilf(size.height * scale);

  CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
  CGContextRef ctx = CGBitmapContextCreate(
      NULL,
      width,
      height,
      8 /*bitsPerComponent*/,
      width * 4 /*bytesPerRow*/,
      colorSpace,
      kCGImageAlphaPremultipliedFirst);
  CGColorSpaceRelease(colorSpace);

  if (ctx != NULL) {
    // flip the context (top left at 0, 0) and scale it
    CGContextTranslateCTM(ctx, 0.0, height);
    CGContextScaleCTM(ctx, scale, -scale);

    NSGraphicsContext *graphicsContext = [NSGraphicsContext graphicsContextWithCGContext:ctx flipped:YES];
    objc_setAssociatedObject(
        graphicsContext, &RCTGraphicsContextSizeKey, [NSValue valueWithSize:size], OBJC_ASSOCIATION_COPY_NONATOMIC);

    [NSGraphicsContext saveGraphicsState];
    [NSGraphicsContext setCurrentContext:graphicsContext];

    CFRelease(ctx);
  }
}

void RNSVGUIGraphicsEndImageContext(void)
{
  RCTAssert(
      objc_getAssociatedObject([NSGraphicsContext currentContext], &RCTGraphicsContextSizeKey),
      @"The current graphics context is not a React image context!");
  [NSGraphicsContext restoreGraphicsState];
}

NSImage *RNSVGUIGraphicsGetImageFromCurrentImageContext(void)
{
  NSImage *image = nil;
  NSGraphicsContext *graphicsContext = [NSGraphicsContext currentContext];

  NSValue *sizeValue = objc_getAssociatedObject(graphicsContext, &RCTGraphicsContextSizeKey);
  if (sizeValue != nil) {
    CGImageRef cgImage = CGBitmapContextCreateImage([graphicsContext CGContext]);

    if (cgImage != NULL) {
      NSBitmapImageRep *imageRep = [[NSBitmapImageRep alloc] initWithCGImage:cgImage];
      image = [[NSImage alloc] initWithSize:[sizeValue sizeValue]];
      [image addRepresentation:imageRep];
      CFRelease(cgImage);
    }
  }

  return image;
}
