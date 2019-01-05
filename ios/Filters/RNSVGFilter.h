#import "RNSVGNode.h"

@interface RNSVGFilter : RNSVGNode

@property (nonatomic, strong) RNSVGLength *x;
@property (nonatomic, strong) RNSVGLength *y;
@property (nonatomic, strong) RNSVGLength *width;
@property (nonatomic, strong) RNSVGLength *height;
@property (nonatomic, assign) RNSVGUnits filterUnits;
@property (nonatomic, assign) RNSVGUnits primitiveUnits;

- (CIImage*)applyFilter:(CIImage*)img background:(CIImage *)background;
- (BOOL)hasSourceGraphicAsLastOutput;

@end
