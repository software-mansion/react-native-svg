
#import "RNSVGGroup.h"

@interface RNSVGPattern : RNSVGGroup

@property (nonatomic, strong) NSString *x;
@property (nonatomic, strong) NSString *y;
@property (nonatomic, strong) NSString *patternwidth;
@property (nonatomic, strong) NSString *patternheight;
@property (nonatomic, assign)RNSVGUnits patternUnits;
@property (nonatomic, assign)RNSVGUnits patternContentUnits;
@property (nonatomic, assign)CGAffineTransform patternTransform;

@property (nonatomic, assign) CGFloat minX;
@property (nonatomic, assign) CGFloat minY;
@property (nonatomic, assign) CGFloat vbWidth;
@property (nonatomic, assign) CGFloat vbHeight;
@property (nonatomic, strong) NSString *align;
@property (nonatomic, assign) RNSVGVBMOS meetOrSlice;

@end
