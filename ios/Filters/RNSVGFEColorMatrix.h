#import "RNSVGFilterPrimitive.h"
#import "RNSVGColorMatrixTypes.h"

@interface RNSVGFEColorMatrix : RNSVGFilterPrimitive

@property (nonatomic, strong) NSString *in1;
@property (nonatomic, assign) RNSVGColorMatrixTypes type;
@property (nonatomic, strong) NSArray<NSNumber *> *values;

@end
