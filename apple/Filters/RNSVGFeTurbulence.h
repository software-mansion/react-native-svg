#import "RNSVGTurbulenceType.h"
#import "RNSVGTurbulenceStitchTile.h"
#import "RNSVGFilterPrimitive.h"

@interface RNSVGFeTurbulence : RNSVGFilterPrimitive

@property (nonatomic, strong) NSArray<RNSVGLength *> *baseFrequency;
@property (nonatomic, strong) RNSVGLength *numOctaves;
@property (nonatomic, strong) RNSVGLength *seed;
@property (nonatomic, assign) RNSVGTurbulenceType type;
@property (nonatomic, assign) RNSVGTurbulenceStitchTile stitchTiles;

@end
