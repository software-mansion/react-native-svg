#import "RNSVGEdgeMode.h"
#import "RNSVGFilterPrimitive.h"

@interface RNSVGFeConvolveMatrix : RNSVGFilterPrimitive

@property (nonatomic, strong) NSString *in1;
@property (nonatomic, strong) NSArray<RNSVGLength *> *order;
@property (nonatomic, strong) NSArray<RNSVGLength *> *kernelMatrix;
@property (nonatomic, strong) RNSVGLength *divisor;
@property (nonatomic, strong) RNSVGLength *bias;
@property (nonatomic, strong) RNSVGLength *targetX;
@property (nonatomic, strong) RNSVGLength *targetY;
@property (nonatomic, assign) RNSVGEdgeMode edgeMode;
@property (nonatomic, assign) bool preserveAlpha;

@end
