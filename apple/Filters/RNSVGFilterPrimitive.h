#import "RNSVGNode.h"

@interface RNSVGFilterPrimitive : RNSVGNode

@property (nonatomic, strong) RNSVGLength *x;
@property (nonatomic, strong) RNSVGLength *y;
@property (nonatomic, strong) RNSVGLength *width;
@property (nonatomic, strong) RNSVGLength *height;
@property (nonatomic, strong) NSString *result;

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results previousFilterResult:(CIImage *)previous;
- (CIImage *)cropResult:(CIImage *)result;

@end
