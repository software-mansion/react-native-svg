#import "RNSVGColorMatrixType.h"
#import "RNSVGFilterPrimitive.h"

@interface RNSVGFeColorMatrix : RNSVGFilterPrimitive

@property (nonatomic, strong) NSString *in1;
@property (nonatomic, assign) RNSVGColorMatrixType type;
@property (nonatomic, strong) NSArray<NSNumber *> *values;

@end
