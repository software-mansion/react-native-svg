#import "RNSVGFilterRegion.h"
#import "RNSVGNode.h"

@interface RNSVGFilter : RNSVGNode

@property (nonatomic, assign) RNSVGUnits filterUnits;
@property (nonatomic, assign) RNSVGUnits primitiveUnits;
@property (nonatomic, strong) RNSVGFilterRegion *filterRegion;

- (CIImage *)applyFilter:(CIImage *)img
           backgroundImg:(CIImage *)backgroundImg
        renderableBounds:(CGRect)renderableBounds
            canvasBounds:(CGRect)canvasBounds
                     ctm:(CGAffineTransform)ctm;
- (CGContext *)openContext:(CGSize)size;
- (void)endContext:(CGContext *)context;
- (CIImage *)getMaskFromRect:(CGContext *)context rect:(CGRect)rect ctm:(CGAffineTransform)ctm;
- (void)setX:(RNSVGLength *)x;
- (void)setY:(RNSVGLength *)y;
- (void)setWidth:(RNSVGLength *)width;
- (void)setHeight:(RNSVGLength *)height;

@end
