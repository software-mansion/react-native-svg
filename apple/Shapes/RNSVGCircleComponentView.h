#import <Foundation/Foundation.h>

#import "RNSVGLength.h"
#import <React/RCTViewComponentView.h>

@interface RNSVGCircleComponentView : RCTViewComponentView

@property (nonatomic, strong) RNSVGLength* cx;
@property (nonatomic, strong) RNSVGLength* cy;
@property (nonatomic, strong) RNSVGLength* r;

@end

