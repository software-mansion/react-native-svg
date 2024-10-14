#import "RNSVGFilterRegion.h"
#import "RNSVGNode.h"

@interface RNSVGFilterPrimitive : RNSVGNode

@property (nonatomic, strong) NSString *result;
@property (nonatomic, strong) RNSVGFilterRegion *filterSubregion;

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results previousFilterResult:(CIImage *)previous;
- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results
    previousFilterResult:(CIImage *)previous
                     ctm:(CGAffineTransform)ctm;
- (void)setX:(RNSVGLength *)x;
- (void)setY:(RNSVGLength *)y;
- (void)setWidth:(RNSVGLength *)width;
- (void)setHeight:(RNSVGLength *)height;

@end
