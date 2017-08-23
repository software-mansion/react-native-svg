/*
 
 Erica Sadun, http://ericasadun.com
 
 */

#import "Drawing-Block.h"
#import "Utility.h"

#pragma mark - Drawing
UIImage *ImageWithBlock(DrawingBlock block, CGSize size)
{
    UIGraphicsBeginImageContextWithOptions(size, NO, 0.0);
    if (block) block((CGRect){.size = size});
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return image;
}

void PushDraw(DrawingStateBlock block)
{
    if (!block) return; // nothing to do
    
    CGContextRef context = UIGraphicsGetCurrentContext();
    if (context == NULL) COMPLAIN_AND_BAIL(@"No context to draw into", nil);
    
    CGContextSaveGState(context);
    block();
    CGContextRestoreGState(context);
}

// Improve performance by pre-clipping context
// before beginning layer drawing
void PushLayerDraw(DrawingStateBlock block)
{
    if (!block) return; // nothing to do
    
    CGContextRef context = UIGraphicsGetCurrentContext();
    if (context == NULL) COMPLAIN_AND_BAIL(@"No context to draw into", nil);
    
    CGContextBeginTransparencyLayer(context, NULL);
    block();
    CGContextEndTransparencyLayer(context);
}

UIImage *DrawIntoImage(CGSize size, DrawingStateBlock block)
{
    UIGraphicsBeginImageContextWithOptions(size, NO, 0.0);
    if (block) block();
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return image;
}


#define DEBUG_IMAGE(_IMAGE_, _NAME_) [UIImagePNGRepresentation(_IMAGE_) writeToFile:[NSString stringWithFormat:@"/Users/ericasadun/Desktop/%@.png", _NAME_] atomically:YES]

// Create a blurred drawing group
// Listing 7-4
void DrawAndBlur(CGFloat radius, DrawingStateBlock block)
{
    if (!block) return; // nothing to do
    
    CGContextRef context = UIGraphicsGetCurrentContext();
    if (context == NULL) COMPLAIN_AND_BAIL(@"No context to draw into", nil);
    
    // Draw and blur the image
    UIImage *baseImage = DrawIntoImage(GetUIKitContextSize(), block);
    UIImage *blurred = GaussianBlurImage(baseImage, radius);
    [blurred drawAtPoint:CGPointZero];
}