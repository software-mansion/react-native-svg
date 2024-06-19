#ifndef RNSVGRenderUtils_h
#define RNSVGRenderUtils_h

static CGImageRef renderToImage(RNSVGRenderable *renderable, CGSize bounds, CGRect rect, CGRect *clip)
{
  UIGraphicsBeginImageContextWithOptions(bounds, NO, 1.0);
  CGContextRef cgContext = UIGraphicsGetCurrentContext();
  CGContextTranslateCTM(cgContext, 0.0, bounds.height);
  CGContextScaleCTM(cgContext, 1.0, -1.0);
  if (clip) {
    CGContextClipToRect(cgContext, *clip);
  }
  [renderable renderLayerTo:cgContext rect:rect];
  CGImageRef contentImage = CGBitmapContextCreateImage(cgContext);
  UIGraphicsEndImageContext();
  return contentImage;
}

#endif /* RNSVGRenderUtils_h */
