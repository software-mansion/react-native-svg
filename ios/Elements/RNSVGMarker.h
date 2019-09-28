
#import "RNSVGGroup.h"
#import "RNSVGLength.h"

@interface RNSVGMarker : RNSVGGroup

@property (nonatomic, strong) RNSVGLength *refX;
@property (nonatomic, strong) RNSVGLength *refY;
@property (nonatomic, strong) RNSVGLength *markerWidth;
@property (nonatomic, strong) RNSVGLength *markerHeight;
@property (nonatomic, assign) NSString *markerUnits;
@property (nonatomic, assign) NSString *orient;

@property (nonatomic, assign) CGFloat minX;
@property (nonatomic, assign) CGFloat minY;
@property (nonatomic, assign) CGFloat vbWidth;
@property (nonatomic, assign) CGFloat vbHeight;
@property (nonatomic, strong) NSString *align;
@property (nonatomic, assign) RNSVGVBMOS meetOrSlice;

@end
