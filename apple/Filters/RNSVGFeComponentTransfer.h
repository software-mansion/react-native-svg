#import "RNSVGFilterPrimitive.h"
#import "RNSVGFeComponentTransferFunction.h"

@interface RNSVGFeComponentTransfer : RNSVGFilterPrimitive

@property (nonatomic, strong) NSString *in1;
@property (nonatomic, strong) RNSVGFeComponentTransferFunction *FeFuncR;
@property (nonatomic, strong) RNSVGFeComponentTransferFunction *FeFuncG;
@property (nonatomic, strong) RNSVGFeComponentTransferFunction *FeFuncB;
@property (nonatomic, strong) RNSVGFeComponentTransferFunction *FeFuncA;

@end
