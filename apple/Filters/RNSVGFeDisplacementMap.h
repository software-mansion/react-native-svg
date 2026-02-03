#import "RNSVGChannelSelector.h"
#import "RNSVGFilterPrimitive.h"

@interface RNSVGFeDisplacementMap : RNSVGFilterPrimitive

@property (nonatomic, strong) NSString *in1;
@property (nonatomic, strong) NSString *in2;
@property (nonatomic, strong) RNSVGLength *scale;
@property (nonatomic, assign) RNSVGChannelSelector xChannelSelector;
@property (nonatomic, assign) RNSVGChannelSelector yChannelSelector;

@end
