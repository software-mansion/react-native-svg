/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGRenderable.h"
#import <React/RCTPointerEvents.h>
#import "RNSVGBezierElement.h"
#import "RNSVGClipPath.h"
#import "RNSVGFilter.h"
#import "RNSVGMarker.h"
#import "RNSVGMarkerPosition.h"
#import "RNSVGMask.h"
#import "RNSVGRenderUtils.h"
#import "RNSVGVectorEffect.h"
#import "RNSVGViewBox.h"

@implementation RNSVGRenderable {
  NSMutableDictionary *_originProperties;
  NSArray<NSString *> *_lastMergedList;
  NSArray<NSString *> *_attributeList;
  NSArray<RNSVGLength *> *_sourceStrokeDashArray;
  CGFloat *_strokeDashArrayData;
  CGPathRef _srcHitPath;
  RNSVGRenderable *_caller;
}

static RNSVGRenderable *_contextElement;
+ (RNSVGRenderable *)contextElement
{
  return _contextElement;
}
+ (void)setContextElement:(RNSVGRenderable *)contextElement
{
  _contextElement = contextElement;
}

- (id)init
{
  if (self = [super init]) {
    _fillOpacity = 1;
    _strokeOpacity = 1;
    _strokeWidth = [RNSVGLength lengthWithNumber:1];
    _fillRule = kRNSVGCGFCRuleNonzero;
  }
  return self;
}

- (void)invalidate
{
  _sourceStrokeDashArray = nil;
  if (self.dirty || self.merging) {
    return;
  }
  _srcHitPath = nil;
  [super invalidate];
  self.dirty = true;
}

- (void)setColor:(RNSVGColor *)color
{
  if (color == _color) {
    return;
  }
  [self invalidate];
  _color = color;
}

- (void)setFill:(RNSVGBrush *)fill
{
  if (fill == _fill) {
    return;
  }
  [self invalidate];
  _fill = fill;
}

- (void)setFillOpacity:(CGFloat)fillOpacity
{
  if (fillOpacity == _fillOpacity) {
    return;
  }
  [self invalidate];
  _fillOpacity = fillOpacity;
}

- (void)setFillRule:(RNSVGCGFCRule)fillRule
{
  if (fillRule == _fillRule) {
    return;
  }
  [self invalidate];
  _fillRule = fillRule;
}

- (void)setStroke:(RNSVGBrush *)stroke
{
  if (stroke == _stroke) {
    return;
  }
  [self invalidate];
  _stroke = stroke;
}

- (void)setStrokeOpacity:(CGFloat)strokeOpacity
{
  if (strokeOpacity == _strokeOpacity) {
    return;
  }
  [self invalidate];
  _strokeOpacity = strokeOpacity;
}

- (void)setStrokeWidth:(RNSVGLength *)strokeWidth
{
  if ([strokeWidth isEqualTo:_strokeWidth]) {
    return;
  }
  [self invalidate];
  _strokeWidth = strokeWidth;
}

- (void)setStrokeLinecap:(CGLineCap)strokeLinecap
{
  if (strokeLinecap == _strokeLinecap) {
    return;
  }
  [self invalidate];
  _strokeLinecap = strokeLinecap;
}

- (void)setStrokeJoin:(CGLineJoin)strokeLinejoin
{
  if (strokeLinejoin == _strokeLinejoin) {
    return;
  }
  [self invalidate];
  _strokeLinejoin = strokeLinejoin;
}

- (void)setStrokeMiterlimit:(CGFloat)strokeMiterlimit
{
  if (strokeMiterlimit == _strokeMiterlimit) {
    return;
  }
  [self invalidate];
  _strokeMiterlimit = strokeMiterlimit;
}

- (void)setStrokeDasharray:(NSArray<RNSVGLength *> *)strokeDasharray
{
  if (strokeDasharray == _strokeDasharray) {
    return;
  }
  [self invalidate];
  _strokeDasharray = strokeDasharray;
}

- (void)setStrokeDashoffset:(CGFloat)strokeDashoffset
{
  if (strokeDashoffset == _strokeDashoffset) {
    return;
  }
  [self invalidate];
  _strokeDashoffset = strokeDashoffset;
}

- (void)setVectorEffect:(RNSVGVectorEffect)vectorEffect
{
  if (vectorEffect == _vectorEffect) {
    return;
  }
  [self invalidate];
  _vectorEffect = vectorEffect;
}

- (void)setPropList:(NSArray<NSString *> *)propList
{
  if (propList == _propList) {
    return;
  }

  _propList = _attributeList = propList;
  [self invalidate];
}

- (void)setFilter:(NSString *)filter
{
  if ([_filter isEqualToString:filter]) {
    return;
  }
  _filter = filter;
  [self invalidate];
}

- (void)dealloc
{
  CGPathRelease(_hitArea);
  _sourceStrokeDashArray = nil;
  if (_strokeDashArrayData) {
    free(_strokeDashArrayData);
  }
  _strokeDashArrayData = nil;
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)prepareForRecycle
{
  [super prepareForRecycle];

  _fillOpacity = 1;
  _strokeOpacity = 1;
  _strokeWidth = [RNSVGLength lengthWithNumber:1];
  _fillRule = kRNSVGCGFCRuleNonzero;

  _originProperties = nil;
  _lastMergedList = nil;
  _attributeList = nil;
  _sourceStrokeDashArray = nil;
  _strokeDashArrayData = nil;
  _srcHitPath = nil;
  CGPathRelease(_hitArea);
  _hitArea = nil;
  _sourceStrokeDashArray = nil;
  if (_strokeDashArrayData) {
    free(_strokeDashArrayData);
  }
  _strokeDashArrayData = nil;

  _contextElement = nil;
  _fill = nil;
  _stroke = nil;
  _strokeLinecap = kCGLineCapButt;
  _strokeLinejoin = kCGLineJoinMiter;
  _strokeMiterlimit = 0;
  _strokeDasharray = nil;
  _strokeDashoffset = 0;
  _vectorEffect = kRNSVGVectorEffectDefault;
  _propList = nil;
  _filter = nil;
}
#endif // RCT_NEW_ARCH_ENABLED

UInt32 saturate(CGFloat value)
{
  return value <= 0 ? 0 : value >= 255 ? 255 : (UInt32)value;
}

- (void)renderTo:(CGContextRef)context rect:(CGRect)rect
{
  self.dirty = false;
  // This needs to be painted on a layer before being composited.
  CGContextSaveGState(context);
  CGContextConcatCTM(context, self.matrix);
  CGContextConcatCTM(context, self.transforms);
  CGContextSetAlpha(context, self.opacity);

  [self beginTransparencyLayer:context];

  RNSVGFilter *filterNode = self.filter ? [self.svgView getDefinedFilter:self.filter] : nil;
  RNSVGMask *maskNode = self.mask ? [self.svgView getDefinedMask:self.mask] : nil;

  if (maskNode || filterNode) {
    CGRect bounds = CGContextGetClipBoundingBox(context);
    // Get current context transformations for offscreenContext
    CGAffineTransform currentCTM = CGContextGetCTM(context);

    CGFloat height = rect.size.height;
    CGFloat width = rect.size.width;
    CGFloat scale = [RNSVGRenderUtils getScreenScale];
    NSUInteger iheight = (NSUInteger)height;
    NSUInteger iwidth = (NSUInteger)width;
    NSUInteger iscale = (NSUInteger)scale;
    NSUInteger scaledHeight = iheight * iscale;
    NSUInteger scaledWidth = iwidth * iscale;
    NSUInteger npixels = scaledHeight * scaledWidth;
    CGAffineTransform screenScaleCTM = CGAffineTransformMake(scale, 0, 0, scale, 0, 0);
    CGRect scaledRect = CGRectApplyAffineTransform(rect, screenScaleCTM);

#if TARGET_OS_OSX
    CGImage *contentImage = [RNSVGRenderUtils renderToImage:self ctm:currentCTM rect:scaledRect clip:nil];
#else
    CGImage *contentImage = [RNSVGRenderUtils renderToImage:self ctm:currentCTM rect:rect clip:nil];
#endif

    if (filterNode) {
      // https://www.w3.org/TR/SVG11/filters.html#FilterElement

      CIImage *content = [CIImage imageWithCGImage:contentImage];

      CGImage *backgroundImage = CGBitmapContextCreateImage(context);
      CIImage *background =
          (backgroundImage != nil) ? [CIImage imageWithCGImage:backgroundImage] : [CIImage emptyImage];

      content = [filterNode applyFilter:content
                          backgroundImg:background
                       renderableBounds:self.pathBounds
                           canvasBounds:scaledRect
                                    ctm:currentCTM];

      CGImageRelease(contentImage);
      contentImage = [[RNSVGRenderUtils sharedCIContext] createCGImage:content fromRect:scaledRect];

      if (!maskNode) {
        CGContextConcatCTM(context, CGAffineTransformInvert(currentCTM));
#if TARGET_OS_OSX
        CGContextDrawImage(context, rect, contentImage);
#else
        CGContextDrawImage(context, scaledRect, contentImage);
#endif

        CGContextConcatCTM(context, currentCTM);
      }

      CGImageRelease(backgroundImage);
    }
    if (maskNode) {
      // https://www.w3.org/TR/SVG11/masking.html#MaskElement

      // Allocate pixel buffer and bitmap context for mask
      NSUInteger bytesPerPixel = 4;
      NSUInteger bitsPerComponent = 8;
      NSUInteger bytesPerRow = bytesPerPixel * scaledWidth;
      CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
      UInt32 *pixels = (UInt32 *)calloc(npixels, sizeof(UInt32));
      CGContextRef bcontext = CGBitmapContextCreate(
          pixels,
          scaledWidth,
          scaledHeight,
          bitsPerComponent,
          bytesPerRow,
          colorSpace,
          kCGImageAlphaPremultipliedLast | kCGBitmapByteOrder32Big);
#if TARGET_OS_OSX // [macOS]
      // on macOS currentCTM is not scaled properly with screen scale so we need to scale it manually
      CGContextConcatCTM(bcontext, screenScaleCTM);
#endif // [macOS]
      CGContextConcatCTM(bcontext, currentCTM);
      // Clip to mask bounds and render the mask
      CGRect maskBounds;
      if ([maskNode maskUnits] == RNSVGUnits::kRNSVGUnitsUserSpaceOnUse) {
        CGFloat x = [self relativeOn:[maskNode x] relative:width];
        CGFloat y = [self relativeOn:[maskNode y] relative:height];
        CGFloat w = [self relativeOn:[maskNode maskwidth] relative:width];
        CGFloat h = [self relativeOn:[maskNode maskheight] relative:height];
        maskBounds = CGRectMake(x, y, w, h);
      } else {
        CGSize currentBoundsSize = self.pathBounds.size;
        CGFloat x = [self relativeOnFraction:[maskNode x] relative:currentBoundsSize.width];
        CGFloat y = [self relativeOnFraction:[maskNode y] relative:currentBoundsSize.height];
        CGFloat w = [self relativeOnFraction:[maskNode maskwidth] relative:currentBoundsSize.width];
        CGFloat h = [self relativeOnFraction:[maskNode maskheight] relative:currentBoundsSize.height];
        maskBounds = CGRectMake(self.pathBounds.origin.x + x, self.pathBounds.origin.y + y, w, h);
      }
      CGContextClipToRect(bcontext, maskBounds);
      [maskNode renderLayerTo:bcontext rect:bounds];

      // Apply luminanceToAlpha filter primitive
      // https://www.w3.org/TR/SVG11/filters.html#feColorMatrixElement
      UInt32 *currentPixel = pixels;
      if (maskNode.maskType == kRNSVGMaskTypeLuminance) {
        for (NSUInteger i = 0; i < npixels; i++) {
          UInt32 color = *currentPixel;

          UInt32 r = color & 0xFF;
          UInt32 g = (color >> 8) & 0xFF;
          UInt32 b = (color >> 16) & 0xFF;

          CGFloat luma = (CGFloat)(0.299 * r + 0.587 * g + 0.144 * b);
          *currentPixel = saturate(luma) << 24;
          currentPixel++;
        }
      }

      // Create mask image and release memory
      CGImageRef maskImage = CGBitmapContextCreateImage(bcontext);
      CGColorSpaceRelease(colorSpace);
      CGContextRelease(bcontext);
      free(pixels);

#if !TARGET_OS_OSX // [macOS]
      UIGraphicsImageRendererFormat *format = [UIGraphicsImageRendererFormat defaultFormat];
      UIGraphicsImageRenderer *renderer = [[UIGraphicsImageRenderer alloc] initWithSize:rect.size format:format];

      // Blend current element and mask
      UIImage *blendedImage = [renderer imageWithActions:^(UIGraphicsImageRendererContext *_Nonnull rendererContext) {
        CGContextConcatCTM(
            rendererContext.CGContext, CGAffineTransformInvert(CGContextGetCTM(rendererContext.CGContext)));
        CGContextConcatCTM(rendererContext.CGContext, screenScaleCTM);

        CGContextSetBlendMode(rendererContext.CGContext, kCGBlendModeCopy);
        CGContextDrawImage(rendererContext.CGContext, rect, maskImage);
        CGContextSetBlendMode(rendererContext.CGContext, kCGBlendModeSourceIn);
        CGContextDrawImage(rendererContext.CGContext, rect, contentImage);
      }];

      // Invert the CTM and apply transformations to draw image in 1:1
      CGContextConcatCTM(context, CGAffineTransformInvert(currentCTM));
      CGContextTranslateCTM(context, 0.0, scaledRect.size.height);
      CGContextScaleCTM(context, 1.0, -1.0);

      // Render blended result into current render context
      [blendedImage drawInRect:scaledRect];
#else // [macOS
      // Blend current element and mask
      RNSVGUIGraphicsBeginImageContextWithOptions(rect.size, NO, scale);
      CGContextRef newContext = UIGraphicsGetCurrentContext();

      CGContextSetBlendMode(newContext, kCGBlendModeCopy);
      CGContextDrawImage(newContext, rect, maskImage);
      CGContextSetBlendMode(newContext, kCGBlendModeSourceIn);
      CGContextDrawImage(newContext, rect, contentImage);

      CGImageRef blendedImage = CGBitmapContextCreateImage(newContext);
      RNSVGUIGraphicsEndImageContext();

      // Invert the CTM and apply transformations to draw image in 1:1
      CGContextConcatCTM(context, CGAffineTransformInvert(currentCTM));
      CGContextTranslateCTM(context, 0.0, rect.size.height);
      CGContextScaleCTM(context, 1.0, -1.0);

      // Render blended result into current render context
      CGContextDrawImage(context, rect, blendedImage);
      CGImageRelease(blendedImage);
#endif // macOS]
      CGImageRelease(maskImage);
    }
    CGImageRelease(contentImage);
  } else {
    [self renderLayerTo:context rect:rect];
  }
  [self endTransparencyLayer:context];

  CGContextRestoreGState(context);

  [self renderMarkers:context path:self.path rect:&rect];
}

- (void)prepareStrokeDash:(NSUInteger)count strokeDasharray:(NSArray<RNSVGLength *> *)strokeDasharray
{
  if (strokeDasharray != _sourceStrokeDashArray) {
    CGFloat *dash = _strokeDashArrayData;
    _strokeDashArrayData = (CGFloat *)realloc(dash, sizeof(CGFloat) * count);
    if (!_strokeDashArrayData) {
      free(dash);
      return;
    }
    _sourceStrokeDashArray = strokeDasharray;
    for (NSUInteger i = 0; i < count; i++) {
      _strokeDashArrayData[i] = (CGFloat)[self relativeOnOther:strokeDasharray[i]];
    }
  }
}

- (void)renderMarkers:(CGContextRef)context path:(CGPathRef)path rect:(const CGRect *)rect
{
  RNSVGMarker *markerStart = (RNSVGMarker *)[self.svgView getDefinedMarker:self.markerStart];
  RNSVGMarker *markerMid = (RNSVGMarker *)[self.svgView getDefinedMarker:self.markerMid];
  RNSVGMarker *markerEnd = (RNSVGMarker *)[self.svgView getDefinedMarker:self.markerEnd];
  if (markerStart || markerMid || markerEnd) {
    _contextElement = self;
    NSArray<RNSVGMarkerPosition *> *positions = [RNSVGMarkerPosition fromCGPath:path];
    CGFloat width = self.strokeWidth ? [self relativeOnOther:self.strokeWidth] : 1;
    __block CGRect bounds = CGRectNull;
    CGMutablePathRef markerPath = CGPathCreateMutable();
    for (RNSVGMarkerPosition *position in positions) {
      RNSVGMarkerType type = [position type];
      RNSVGMarker *marker;
      switch (type) {
        case kStartMarker:
          marker = markerStart;
          break;

        case kMidMarker:
          marker = markerMid;
          break;

        case kEndMarker:
          marker = markerEnd;
          break;
      }
      if (!marker) {
        continue;
      }

      [marker renderMarker:context rect:*rect position:position strokeWidth:width];
      CGAffineTransform transform = marker.transform;
      CGPathRef hitArea = marker.hitArea;
      CGPathAddPath(markerPath, &transform, hitArea);
      CGRect nodeRect = marker.pathBounds;
      if (!CGRectIsEmpty(nodeRect)) {
        bounds = CGRectUnion(bounds, CGRectApplyAffineTransform(nodeRect, transform));
      }
    }
    self.markerBounds = bounds;
    self.markerPath = markerPath;
    _contextElement = nil;
  }
}

- (void)renderLayerTo:(CGContextRef)context rect:(CGRect)rect
{
  CGPathRef path = self.path;
  if (!path) {
    path = [self getPath:context];
    if (!self.path) {
      self.path = CGPathRetain(path);
    }
    [self setHitArea:path];
    self.fillBounds = CGPathGetPathBoundingBox(path);
    self.strokeBounds = CGPathGetPathBoundingBox(self.strokePath);
    self.pathBounds = CGRectUnion(self.fillBounds, self.strokeBounds);
  }
  const CGRect pathBounds = self.pathBounds;

  CGAffineTransform current = CGContextGetCTM(context);
  CGAffineTransform svgToClientTransform = CGAffineTransformConcat(current, self.svgView.invInitialCTM);
  CGRect clientRect = CGRectApplyAffineTransform(pathBounds, svgToClientTransform);

  self.ctm = svgToClientTransform;
  self.clientRect = clientRect;
  self.screenCTM = current;

  if (_vectorEffect == kRNSVGVectorEffectNonScalingStroke) {
    path = CGPathCreateCopyByTransformingPath(path, &svgToClientTransform);
    CGContextConcatCTM(context, CGAffineTransformInvert(svgToClientTransform));
  }

  CGAffineTransform vbmatrix = self.svgView.getViewBoxTransform;
  CGAffineTransform transform = CGAffineTransformConcat(self.matrix, self.transforms);
  CGAffineTransform matrix = CGAffineTransformConcat(transform, vbmatrix);

  CGRect bounds = CGRectMake(0, 0, CGRectGetWidth(clientRect), CGRectGetHeight(clientRect));
  CGPoint mid = CGPointMake(CGRectGetMidX(pathBounds), CGRectGetMidY(pathBounds));
  CGPoint center = CGPointApplyAffineTransform(mid, matrix);

  if (!isnan(bounds.size.width) && !isnan(bounds.size.height)) {
    self.bounds = bounds;
  }
  if (!isnan(center.x) && !isnan(center.y)) {
    self.center = center;
  }
  self.frame = clientRect;

  if (self.skip || self.opacity == 0) {
    return;
  }

  if (!self.fill && !self.stroke) {
    return;
  }

  CGPathDrawingMode mode = kCGPathStroke;
  BOOL fillColor = NO;
  [self clip:context];

  BOOL evenodd = self.fillRule == kRNSVGCGFCRuleEvenodd;

  if (self.fill) {
    if (self.fill.class == RNSVGBrush.class) {
      CGContextSetFillColorWithColor(context, [self getCurrentColor]);
      fillColor = YES;
    } else {
      fillColor = [self.fill applyFillColor:context opacity:self.fillOpacity];
    }

    if (fillColor) {
      mode = evenodd ? kCGPathEOFill : kCGPathFill;
    } else {
      CGContextSaveGState(context);
      CGContextAddPath(context, path);
      evenodd ? CGContextEOClip(context) : CGContextClip(context);
      [self.fill paint:context
               opacity:self.fillOpacity
               painter:[self.svgView getDefinedPainter:self.fill.brushRef]
                bounds:pathBounds];
      CGContextRestoreGState(context);

      if (!self.stroke) {
        return;
      }
    }
  }

  if (self.stroke) {
    CGFloat width = self.strokeWidth ? [self relativeOnOther:self.strokeWidth] : 1;
    CGContextSetLineWidth(context, width);
    CGContextSetLineCap(context, self.strokeLinecap);
    CGContextSetLineJoin(context, self.strokeLinejoin);
    NSArray<RNSVGLength *> *strokeDasharray = self.strokeDasharray;
    NSUInteger count = strokeDasharray.count;

    if (count) {
      [self prepareStrokeDash:count strokeDasharray:strokeDasharray];
      if (_strokeDashArrayData) {
        CGContextSetLineDash(context, self.strokeDashoffset, _strokeDashArrayData, count);
      }
    }

    if (!fillColor) {
      CGContextAddPath(context, path);
      CGContextReplacePathWithStrokedPath(context);
      CGContextClip(context);
    }

    BOOL strokeColor;

    if (self.stroke.class == RNSVGBrush.class) {
      CGContextSetStrokeColorWithColor(context, [self getCurrentColor]);
      strokeColor = YES;
    } else {
      strokeColor = [self.stroke applyStrokeColor:context opacity:self.strokeOpacity];
    }

    if (strokeColor && fillColor) {
      mode = evenodd ? kCGPathEOFillStroke : kCGPathFillStroke;
    } else if (!strokeColor) {
      // draw fill
      if (fillColor) {
        CGContextAddPath(context, path);
        CGContextDrawPath(context, mode);
      }

      // draw stroke
      CGContextAddPath(context, path);
      CGContextReplacePathWithStrokedPath(context);
      evenodd ? CGContextEOClip(context) : CGContextClip(context);

      [self.stroke paint:context
                 opacity:self.strokeOpacity
                 painter:[self.svgView getDefinedPainter:self.stroke.brushRef]
                  bounds:pathBounds];
      return;
    }
  }

  CGContextAddPath(context, path);
  CGContextDrawPath(context, mode);
}

- (void)setHitArea:(CGPathRef)path
{
  if (_srcHitPath == path) {
    return;
  }
  _srcHitPath = path;
  CGPathRelease(_hitArea);
  CGPathRelease(self.strokePath);
  _hitArea = CGPathCreateCopy(path);
  self.strokePath = nil;
  if (self.stroke && self.strokeWidth) {
    // Add stroke to hitArea
    CGFloat width = [self relativeOnOther:self.strokeWidth];
    self.strokePath = CGPathRetain((CGPathRef)CFAutorelease(CGPathCreateCopyByStrokingPath(
        path, nil, width, self.strokeLinecap, self.strokeLinejoin, self.strokeMiterlimit)));
    // TODO add dashing
    // CGPathCreateCopyByDashingPath(CGPathRef  _Nullable path, const CGAffineTransform * _Nullable transform, CGFloat
    // phase, const CGFloat * _Nullable lengths, size_t count)
  }
}

- (BOOL)isUserInteractionEnabled
{
  return NO;
}

// hitTest delegate
- (RNSVGPlatformView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  if (!_hitArea) {
    return nil;
  }

  BOOL canReceiveTouchEvents = (self.pointerEvents != RCTPointerEventsNone && ![self isHidden]);
  if (!canReceiveTouchEvents) {
    return nil;
  }

  if (self.active) {
    if (!event) {
      self.active = NO;
    }
    return self;
  }

  CGPoint transformed = CGPointApplyAffineTransform(point, self.invmatrix);
  transformed = CGPointApplyAffineTransform(transformed, self.invTransform);

  if (!CGRectContainsPoint(self.pathBounds, transformed) && !CGRectContainsPoint(self.markerBounds, transformed)) {
    return nil;
  }

  BOOL evenodd = self.fillRule == kRNSVGCGFCRuleEvenodd;
  if (!CGPathContainsPoint(_hitArea, nil, transformed, evenodd) &&
      !CGPathContainsPoint(self.strokePath, nil, transformed, NO) &&
      !CGPathContainsPoint(self.markerPath, nil, transformed, NO)) {
    return nil;
  }

  if (self.clipPath) {
    RNSVGClipPath *clipNode = (RNSVGClipPath *)[self.svgView getDefinedClipPath:self.clipPath];
    if ([clipNode isSimpleClipPath]) {
      CGPathRef clipPath = [self getClipPath];
      if (clipPath && !CGPathContainsPoint(clipPath, nil, transformed, clipNode.clipRule == kRNSVGCGFCRuleEvenodd)) {
        return nil;
      }
    } else {
      RNSVGRenderable *clipGroup = (RNSVGRenderable *)clipNode;
      if (![clipGroup hitTest:transformed withEvent:event]) {
        return nil;
      }
    }
  }

  return self;
}

- (NSArray<NSString *> *)getAttributeList
{
  return _attributeList;
}

- (void)mergeProperties:(__kindof RNSVGRenderable *)target
{
  _caller = target;
  NSArray<NSString *> *targetAttributeList = [target getAttributeList];

  if (targetAttributeList.count == 0) {
    return;
  }
  self.merging = true;

  NSMutableArray *attributeList = self.propList ? [self.propList mutableCopy] : [[NSMutableArray alloc] init];
  _originProperties = [[NSMutableDictionary alloc] init];

  for (NSString *key in targetAttributeList) {
    [_originProperties setValue:[self valueForKey:key] forKey:key];
    if (![attributeList containsObject:key]) {
      [attributeList addObject:key];
      [self setValue:[target valueForKey:key] forKey:key];
    }
  }

  _lastMergedList = targetAttributeList;
  _attributeList = [attributeList copy];
  self.merging = false;
}

- (void)resetProperties
{
  self.merging = true;
  for (NSString *key in _lastMergedList) {
    [self setValue:[_originProperties valueForKey:key] forKey:key];
  }

  _caller = nil;
  _lastMergedList = nil;
  _attributeList = _propList;
  self.merging = false;
}

- (CGColor *)getCurrentColor
{
  if (self.color != nil) {
    return [self.color CGColor];
  }
  if (_caller != nil) {
    return [_caller getCurrentColor];
  }
  RNSVGPlatformView *parentView = [self superview];
  if ([parentView isKindOfClass:[RNSVGRenderable class]]) {
    return [(RNSVGRenderable *)parentView getCurrentColor];
  } else if ([parentView isKindOfClass:[RNSVGSvgView class]]) {
    return [[(RNSVGSvgView *)parentView color] CGColor];
  }

  return nil;
}

@end
