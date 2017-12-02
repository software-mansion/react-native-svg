/*
 
 Erica Sadun, http://ericasadun.com
 
 */

#import "Drawing-Util.h"
#import "Utility.h"

UIColor *ScaleColorBrightness(UIColor *color, CGFloat amount)
{
    CGFloat h, s, v, a;
    [color getHue:&h saturation:&s brightness:&v alpha:&a];
    CGFloat v1 = Clamp(v * amount, 0, 1);
    return [UIColor colorWithHue:h saturation:s brightness:v1 alpha:a];
}

void DrawStrokedShadowedShape(UIBezierPath *path, UIColor *baseColor, CGRect dest)
{
    CGContextRef context = UIGraphicsGetCurrentContext();
    if (!context) COMPLAIN_AND_BAIL(@"No context to draw to", nil);
    
    PushDraw(^{
        CGContextSetShadow(context, CGSizeMake(4, 4), 4);
        
        PushLayerDraw(^{
            
            // Draw letter gradient (to half brightness)
            PushDraw(^{
                Gradient *innerGradient = [Gradient gradientFrom:baseColor to:ScaleColorBrightness(baseColor, 0.5)];
                [path addClip];
                [innerGradient drawTopToBottom:path.bounds];
            });
            
            // Add the inner shadow with darker color
            PushDraw(^{
                CGContextSetBlendMode(context, kCGBlendModeMultiply);
                DrawInnerShadow(path, ScaleColorBrightness(baseColor, 0.3), CGSizeMake(0, -2), 2);
            });
            
            // Stroke with reversed gray gradient
            PushDraw(^{
                [path clipToStroke:6];
                [path.inverse addClip];
                Gradient *grayGradient = [Gradient gradientFrom:WHITE_LEVEL(0.0, 1) to:WHITE_LEVEL(0.5, 1)];
                [grayGradient drawTopToBottom:dest];
            });
            
        });
    });
}

void DrawStrokedShadowedText(NSString *string, NSString *fontFace, UIColor *baseColor, CGRect dest)
{
    // Create text path
    UIBezierPath *text = BezierPathFromStringWithFontFace(string, fontFace);
    FitPathToRect(text, dest);
    DrawStrokedShadowedShape(text, baseColor, dest);
}


void DrawIndentedPath(UIBezierPath *path, UIColor *primary, CGRect rect)
{
    CGContextRef context = UIGraphicsGetCurrentContext();
    if (!context) COMPLAIN_AND_BAIL(@"No context to draw to", nil);
    
    PushDraw(^{
        CGContextSetBlendMode(UIGraphicsGetCurrentContext(), kCGBlendModeMultiply);
        DrawInnerShadow(path, WHITE_LEVEL(0, 0.4), CGSizeMake(0, 2), 1);
    });
    
    DrawShadow(path, WHITE_LEVEL(1, 0.5), CGSizeMake(0, 2), 1);
    BevelPath(path, WHITE_LEVEL(0, 0.4), 2, 0);
    
    PushDraw(^{
        [path addClip];
        CGContextSetAlpha(UIGraphicsGetCurrentContext(), 0.3);
        
        UIColor *secondary = ScaleColorBrightness(primary, 0.3);
        Gradient *gradient = [Gradient gradientFrom:primary to:secondary];
        [gradient drawBottomToTop:path.bounds];
    });
    
}

void DrawIndentedText(NSString *string, NSString *fontFace, UIColor *primary, CGRect rect)
{
    UIBezierPath *letterPath = BezierPathFromStringWithFontFace(string, fontFace);
    // RotatePath(letterPath, RadiansFromDegrees(-15));
    FitPathToRect(letterPath, rect);
    DrawIndentedPath(letterPath, primary, rect);
}

void DrawGradientOverTexture(UIBezierPath *path, UIImage *texture, Gradient *gradient, CGFloat alpha)
{
    if (!path) COMPLAIN_AND_BAIL(@"Path cannot be nil", nil);
    if (!texture) COMPLAIN_AND_BAIL(@"Texture cannot be nil", nil);
    if (!gradient) COMPLAIN_AND_BAIL(@"Gradient cannot be nil", nil);
    CGContextRef context = UIGraphicsGetCurrentContext();
    if (context == NULL) COMPLAIN_AND_BAIL(@"No context to draw into", nil);
    
    CGRect rect = path.bounds;
    PushDraw(^{
        CGContextSetAlpha(context, alpha);
        [path addClip];
        PushLayerDraw(^{
            [texture drawInRect:rect];
            CGContextSetBlendMode(context, kCGBlendModeColor);
            [gradient drawTopToBottom:rect];
        });
    });
}

void DrawBottomGlow(UIBezierPath *path, UIColor *color, CGFloat percent)
{
    if (!path) COMPLAIN_AND_BAIL(@"Path cannot be nil", nil);
    if (!color) COMPLAIN_AND_BAIL(@"Color cannot be nil", nil);
    CGContextRef context = UIGraphicsGetCurrentContext();
    if (context == NULL) COMPLAIN_AND_BAIL(@"No context to draw into", nil);
    
    CGRect rect = path.calculatedBounds;
    CGPoint h1 = RectGetPointAtPercents(rect, 0.5f, 1.0f);
    CGPoint h2 = RectGetPointAtPercents(rect, 0.5f, 1.0f - percent);
    
    Gradient *gradient = [Gradient easeInOutGradientBetween:color and:[color colorWithAlphaComponent:0.0f]];
    
    PushDraw(^{
        [path addClip];
        [gradient drawFrom:h1 toPoint:h2];
    });
}

void DrawIconTopLight(UIBezierPath *path, CGFloat p)
{
    if (!path) COMPLAIN_AND_BAIL(@"Path cannot be nil", nil);
    CGContextRef context = UIGraphicsGetCurrentContext();
    if (context == NULL) COMPLAIN_AND_BAIL(@"No context to draw into", nil);
    
    CGFloat percent = 1.0f - p;
    CGRect rect = path.bounds;
    CGRect offset = rect;
    offset.origin.y -= percent * offset.size.height;
    offset = CGRectInset(offset, -offset.size.width * 0.3f, 0);
    
    UIBezierPath *ovalPath = [UIBezierPath bezierPathWithOvalInRect:offset];
    Gradient *gradient = [Gradient gradientFrom:WHITE_LEVEL(1, 0.0) to: WHITE_LEVEL(1, 0.5)];
    
    PushDraw(^{
        [path addClip];
        [ovalPath addClip];
        
        // Draw gradient
        CGPoint p1 = RectGetPointAtPercents(rect, 0.5, 0.0);
        CGPoint p2 = RectGetPointAtPercents(ovalPath.bounds, 0.5, 1);
        [gradient drawFrom:p1 toPoint:p2];
    });
}

CGSize GetQuartzContextSize()
{
    CGContextRef context = UIGraphicsGetCurrentContext();
    if (context == NULL) return CGSizeZero;
    return CGSizeMake(CGBitmapContextGetWidth(context), CGBitmapContextGetHeight(context));
}

// Listing 7-4
CGSize GetUIKitContextSize()
{
    CGContextRef context = UIGraphicsGetCurrentContext();
    if (context == NULL) return CGSizeZero;
    CGSize size = CGSizeMake(CGBitmapContextGetWidth(context), CGBitmapContextGetHeight(context));
    CGFloat scale = [UIScreen mainScreen].scale;
    return CGSizeMake(size.width / scale, size.height / scale);
}

void ApplyMaskToContext(UIImage *mask)
{
    if (!mask) COMPLAIN_AND_BAIL(@"Mask cannot be nil", nil);
    CGContextRef context = UIGraphicsGetCurrentContext();
    if (context == NULL) COMPLAIN_AND_BAIL(@"No context to apply mask to", nil);
    
    // Ensure that mask is grayscale
    UIImage *gray = GrayscaleVersionOfImage(mask);
    CGSize contextSize = GetUIKitContextSize();
    
    // Clipping takes place in Quartz space, so flip before applying
    FlipContextVertically(contextSize);
    CGContextClipToMask(context, SizeMakeRect(contextSize), gray.CGImage);
    FlipContextVertically(contextSize);
}

UIImage *ApplyMaskToImage(UIImage *image, UIImage *mask)
{
    if (!image) COMPLAIN_AND_BAIL_NIL(@"Image cannot be nil", nil);
    if (!mask) COMPLAIN_AND_BAIL_NIL(@"Mask cannot be nil", nil);
    
    UIGraphicsBeginImageContextWithOptions(image.size, NO, 0.0);
    ApplyMaskToContext(mask);
    [image drawInRect:SizeMakeRect(image.size)];
    UIImage *result = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return result;
}

UIImage *GradientImage(CGSize size, UIColor *c1, UIColor *c2)
{
    UIGraphicsBeginImageContextWithOptions(size, NO, 0.0);
    
    Gradient *gradient = [Gradient gradientFrom:c1 to:c2];
    [gradient drawTopToBottom:SizeMakeRect(size)];
    
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return image;
}

UIImage *GradientMaskedReflectionImage(UIImage *sourceImage)
{
    UIImage *mirror = ImageMirroredVertically(sourceImage);
    UIImage *gradImage = GrayscaleVersionOfImage(GradientImage(sourceImage.size, WHITE_LEVEL(1, 0.5), WHITE_LEVEL(0, 0.5)));
    UIImage *masked = ApplyMaskToImage(mirror, gradImage);
    return masked;
}

// Listing 7-5
void DrawGradientMaskedReflection(UIImage *image, CGRect rect)
{
    CGContextRef context = UIGraphicsGetCurrentContext();
    if (context == NULL) COMPLAIN_AND_BAIL(@"No context to draw into", nil);
    
    UIImage *gradient = GradientImage(rect.size, WHITE_LEVEL(1, 0.5), WHITE_LEVEL(1, 0.0));
    PushDraw(^{
        CGContextTranslateCTM(context, 0, rect.origin.y);
        FlipContextVertically(rect.size);
        CGContextTranslateCTM(context, 0, -rect.origin.y);
        CGContextClipToMask(context, rect, gradient.CGImage);
        [image drawInRect:rect];
    });
}


