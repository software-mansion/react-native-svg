
#import "RNSVGGroup.h"
#import "RNSVGLength.h"

@interface RNSVGFilter : RNSVGGroup

@property (nonatomic, strong) NSString *name;
@property (nonatomic, strong) RNSVGLength *x;
@property (nonatomic, strong) RNSVGLength *y;
@property (nonatomic, strong) RNSVGLength *filterwidth;
@property (nonatomic, strong) RNSVGLength *filterheight;
@property (nonatomic, assign) RNSVGUnits filterUnits;
@property (nonatomic, assign) RNSVGUnits primitiveUnits;

@end
