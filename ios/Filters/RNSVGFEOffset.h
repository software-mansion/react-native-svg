#import "RNSVGFilterPrimitive.h"
#import "RNSVGColorMatrixTypes.h"

@interface RNSVGFEOffset : RNSVGFilterPrimitive

@property (nonatomic, strong) NSString *in1;
@property (nonatomic, strong) NSNumber *dx;
@property (nonatomic, strong) NSNumber *dy;

@end
