
#import "RNSVGGroup.h"
#import "RNSVGLength.h"

@interface RNSVGForeignObject : RNSVGGroup

@property (nonatomic, strong) RNSVGLength *x;
@property (nonatomic, strong) RNSVGLength *y;
@property (nonatomic, strong) RNSVGLength *foreignObjectwidth;
@property (nonatomic, strong) RNSVGLength *foreignObjectheight;
#ifdef RCT_NEW_ARCH_ENABLED
@property (nonatomic, strong) NSHashTable<RNSVGView *> *managedNodes;
#endif

@end
