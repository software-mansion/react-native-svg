
#import "RNSVGGroup.h"

@interface RNSVGMask : RNSVGGroup

@property (nonatomic, strong) NSString *x;
@property (nonatomic, strong) NSString *y;
@property (nonatomic, strong) NSString *maskwidth;
@property (nonatomic, strong) NSString *maskheight;
@property (nonatomic, assign) RNSVGUnits maskUnits;
@property (nonatomic, assign) RNSVGUnits maskContentUnits;
@property (nonatomic, assign) CGAffineTransform maskTransform;

@end
