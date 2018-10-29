#import "RNSVGFilterPrimitive.h"
#import "RNSVGEdgeModeValues.h"

@interface RNSVGFEGaussianBlur : RNSVGFilterPrimitive

@property (nonatomic, strong) NSString *in1;
@property (nonatomic, assign) RNSVGEdgeModeValues edgeMode;
@property (nonatomic, strong) NSNumber *stdDeviationX;
@property (nonatomic, strong) NSNumber *stdDeviationY;

@end
