#import "RNSVGFeTurbulenceManager.h"
#import "RNSVGFeTurbulence.h"
#import "RNSVGTurbulenceType.h"
#import "RNSVGTurbulenceStitchTile.h"

@implementation RNSVGFeTurbulenceManager

RCT_EXPORT_MODULE()

- (RNSVGFeTurbulence *)node
{
  return [RNSVGFeTurbulence new];
}

RCT_EXPORT_VIEW_PROPERTY(baseFrequency, NSArray<RNSVGLength *>)
RCT_EXPORT_VIEW_PROPERTY(numOctaves, RNSVGLength *)
RCT_EXPORT_VIEW_PROPERTY(seed, RNSVGLength *)
RCT_EXPORT_VIEW_PROPERTY(type, RNSVGTurbulenceType)
RCT_EXPORT_VIEW_PROPERTY(stitchTiles, RNSVGTurbulenceStitchTile)

@end
