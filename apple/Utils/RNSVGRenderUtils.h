#import "RNSVGRenderable.h"

@interface RNSVGRenderUtils : NSObject

+ (CIContext *)sharedCIContext;
+ (CGFloat)getScreenScale;
+ (CGImage *)renderToImage:(RNSVGRenderable *)renderable
                       ctm:(CGAffineTransform)ctm
                      rect:(CGRect)rect
                      clip:(CGRect *)clip;

@end
