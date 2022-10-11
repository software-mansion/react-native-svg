#ifdef RN_FABRIC_ENABLED
#import <React/RCTViewComponentView.h>
#endif // RN_FABRIC_ENABLED

@interface RNSVGSvgViewAndroid :
#ifdef RN_FABRIC_ENABLED
    RCTViewComponentView
#else
    UIView
#endif // RN_FABRIC_ENABLED
@end
