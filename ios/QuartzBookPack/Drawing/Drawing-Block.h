/*
 
 Erica Sadun, http://ericasadun.com
 
 */

#import <QuartzCore/QuartzCore.h>
#import <UIKit/UIKit.h>

typedef void (^DrawingBlock)(CGRect bounds);
typedef void (^DrawingStateBlock)();
void PushDraw(DrawingStateBlock block);
void PushLayerDraw(DrawingStateBlock block);


// Image
UIImage *ImageWithBlock(DrawingBlock block, CGSize size);
UIImage *DrawIntoImage(CGSize size, DrawingStateBlock block);


// Blurring
void DrawAndBlur(CGFloat radius, DrawingStateBlock block);
