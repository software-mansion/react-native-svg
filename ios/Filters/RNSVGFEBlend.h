#import "RNSVGFilterPrimitive.h"
#import "RNSVGBlendModeTypes.h"

@interface RNSVGFEBlend : RNSVGFilterPrimitive

@property (nonatomic, strong) NSString *in1;
@property (nonatomic, strong) NSString *in2;
@property (nonatomic, assign) RNSVGBlendModeTypes mode;

@end
