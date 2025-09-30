#import "RNSVGBrush.h"
#import "RNSVGFilterPrimitive.h"

@interface RNSVGFeFlood : RNSVGFilterPrimitive

@property (nonatomic, strong) RNSVGBrush *floodColor;
@property (nonatomic, assign) CGFloat floodOpacity;

@end
