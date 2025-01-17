#import "RNSVGBlendMode.h"
#import "RNSVGFilterPrimitive.h"

@interface RNSVGFeBlend : RNSVGFilterPrimitive

@property (nonatomic, strong) NSString *in1;
@property (nonatomic, strong) NSString *in2;
@property (nonatomic, assign) RNSVGBlendMode mode;

@end
