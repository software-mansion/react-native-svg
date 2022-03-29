#import <Foundation/Foundation.h>

#import "RNSVGRenderableFabric.h"
#import "RNSVGLength.h"

@interface RNSVGCircleComponentView : RNSVGRenderableFabric

@property (nonatomic, strong) RNSVGLength* cx;
@property (nonatomic, strong) RNSVGLength* cy;
@property (nonatomic, strong) RNSVGLength* r;

@end

