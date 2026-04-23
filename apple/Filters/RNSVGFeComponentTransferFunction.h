#import "RNSVGFilterPrimitive.h"
#import "RNSVGComponentTransferFuncChannel.h"
#import "RNSVGComponentTransferFuncType.h"


@interface RNSVGFeComponentTransferFunction : RNSVGFilterPrimitive

@property (nonatomic, assign) RNSVGComponentTransferFuncChannel channel;
@property (nonatomic, assign) RNSVGComponentTransferFuncType type;
@property (nonatomic, strong) NSArray<RNSVGLength *> *tableValues;
@property (nonatomic, strong) RNSVGLength *slope;
@property (nonatomic, strong) RNSVGLength *intercept;
@property (nonatomic, strong) RNSVGLength *amplitude;
@property (nonatomic, strong) RNSVGLength *exponent;
@property (nonatomic, strong) RNSVGLength *offset;

- (double)apply:(double) C;

@end
