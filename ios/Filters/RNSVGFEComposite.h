#import "RNSVGFilterPrimitive.h"
#import "RNSVGCompositeOperators.h"

@interface RNSVGFEComposite : RNSVGFilterPrimitive

@property (nonatomic, strong) NSString *in1;
@property (nonatomic, strong) NSString *in2;
@property (nonatomic, assign) RNSVGCompositeOperators Operator;
@property (nonatomic, strong) NSNumber *k1;
@property (nonatomic, strong) NSNumber *k2;
@property (nonatomic, strong) NSNumber *k3;
@property (nonatomic, strong) NSNumber *k4;

@end
