#import "RNSVGFilterRegion.h"
#import "RNSVGNode.h"

@interface RNSVGFilter : RNSVGNode

@property (nonatomic, strong) RNSVGLength *x;
@property (nonatomic, strong) RNSVGLength *y;
@property (nonatomic, strong) RNSVGLength *width;
@property (nonatomic, strong) RNSVGLength *height;
@property (nonatomic, assign) RNSVGUnits filterUnits;
@property (nonatomic, assign) RNSVGUnits primitiveUnits;

- (CIImage *)applyFilter:(CIImage *)img
           backgroundImg:(CIImage *)backgroundImg
        renderableBounds:(CGRect)renderableBounds
            canvasBounds:(CGRect)canvasBounds
                     ctm:(CGAffineTransform)ctm;
- (CGContext *)openContext:(CGSize)size;
- (void)endContext:(CGContext *)context;
- (CIImage *)getMaskFromRect:(CGContext *)context rect:(CGRect)rect ctm:(CGAffineTransform)ctm;

@end
