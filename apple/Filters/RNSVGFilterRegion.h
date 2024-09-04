#import "RNSVGNode.h"
#import "RNSVGUnits.h"

#ifndef RNSVGFilterRegion_h
#define RNSVGFilterRegion_h

@interface RNSVGFilterRegion : NSObject

@property (nonatomic, strong) RNSVGLength *x;
@property (nonatomic, strong) RNSVGLength *y;
@property (nonatomic, strong) RNSVGLength *width;
@property (nonatomic, strong) RNSVGLength *height;

- (CGRect)getCropRect:(RNSVGNode *)node units:(RNSVGUnits)units renderableBounds:(CGRect)renderableBounds;
- (void)resetProperties;

@end

#endif /* RNSVGFilterRegion_h */
