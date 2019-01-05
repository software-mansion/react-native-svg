
#import "RNSVGGroup.h"
#import "RNSVGLength.h"

@interface RNSVGMask : RNSVGGroup

@property (nonatomic, strong) RNSVGLength *x;
@property (nonatomic, strong) RNSVGLength *y;
@property (nonatomic, strong) RNSVGLength *width;
@property (nonatomic, strong) RNSVGLength *height;
@property (nonatomic, assign) RNSVGUnits maskUnits;
@property (nonatomic, assign) RNSVGUnits maskContentUnits;
@property (nonatomic, assign) CGAffineTransform maskTransform;

@end
