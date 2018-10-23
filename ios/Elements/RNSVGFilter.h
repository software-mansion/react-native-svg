
#import "RNSVGGroup.h"

@interface RNSVGFilter : RNSVGGroup

@property (nonatomic, strong) NSString *name;
@property (nonatomic, strong) NSString *x;
@property (nonatomic, strong) NSString *y;
@property (nonatomic, strong) NSString *filterwidth;
@property (nonatomic, strong) NSString *filterheight;
@property (nonatomic, assign) RNSVGUnits filterUnits;
@property (nonatomic, assign) RNSVGUnits primitiveUnits;

@end
