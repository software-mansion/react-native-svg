#import "RNSVGFilterRegion.h"
#import "RNSVGNode.h"

@interface RNSVGFilterPrimitive : RNSVGNode

@property (nonatomic, strong) RNSVGFilterRegion *filterRegion;
@property (nonatomic, strong) NSString *result;

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results previousFilterResult:(CIImage *)previous;
- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results
    previousFilterResult:(CIImage *)previous
                     ctm:(CGAffineTransform)ctm;

@end
