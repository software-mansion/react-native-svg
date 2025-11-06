#import "RNSVGNode.h"
#import "RNSVGUnits.h"

#ifndef RNSVGFilterRegion_h
#define RNSVGFilterRegion_h

@interface RNSVGFilterRegion : NSObject

@property (nonatomic, strong) RNSVGLength *x;
@property (nonatomic, strong) RNSVGLength *y;
@property (nonatomic, strong) RNSVGLength *width;
@property (nonatomic, strong) RNSVGLength *height;

+ (instancetype)regionWithX:(RNSVGLength *)x y:(RNSVGLength *)y width:(RNSVGLength *)width height:(RNSVGLength *)height;
- (CGRect)getCropRect:(RNSVGNode *)node units:(RNSVGUnits)units bounds:(CGRect)bounds;

@end

#endif /* RNSVGFilterRegion_h */
