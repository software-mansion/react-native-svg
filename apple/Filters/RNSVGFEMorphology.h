#import "RNSVGMorphologyOperator.h"
#import "RNSVGFilterPrimitive.h"

@interface RNSVGFeMorphology : RNSVGFilterPrimitive

@property (nonatomic, strong) NSString *in1;
@property (nonatomic, assign) RNSVGMorphologyOperator operator1;
@property (nonatomic, strong) NSArray<RNSVGLength *> *radius;

@end
