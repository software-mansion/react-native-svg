#import "RNSVGUIKit.h"

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
