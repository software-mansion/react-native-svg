#import "RNSVGArithmeticFilter.h"
#import "RNSVGCompositeOperator.h"
#import "RNSVGCompositeXor.h"
#import "RNSVGFilterPrimitive.h"

@interface RNSVGFeComposite : RNSVGFilterPrimitive

@property (nonatomic, strong) NSString *in1;
@property (nonatomic, strong) NSString *in2;
@property (nonatomic, assign) RNSVGCompositeOperator operator1;
@property (nonatomic, strong) NSNumber *k1;
@property (nonatomic, strong) NSNumber *k2;
@property (nonatomic, strong) NSNumber *k3;
@property (nonatomic, strong) NSNumber *k4;

@end
