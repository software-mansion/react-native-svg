// Most (if not all) of this file could probably go away once react-native-macos's version of RCTUIKit.h makes its way
// upstream. https://github.com/microsoft/react-native-macos/issues/242
#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#endif // RCT_NEW_ARCH_ENABLED

#if !TARGET_OS_OSX

#import <UIKit/UIKit.h>

#define RNSVGColor UIColor
#define RNSVGPlatformView UIView
#define RNSVGTextView UILabel
#ifdef RCT_NEW_ARCH_ENABLED
#define RNSVGView RCTViewComponentView
#else
#define RNSVGView UIView
#endif // RCT_NEW_ARCH_ENABLED

#define RNSVGUIGraphicsBeginImageContextWithOptions UIGraphicsBeginImageContextWithOptions
#define RNSVGUIGraphicsEndImageContext UIGraphicsEndImageContext
#define RNSVGUIGraphicsGetImageFromCurrentImageContext UIGraphicsGetImageFromCurrentImageContext

#else // TARGET_OS_OSX [

// Due to name mangling, calling c-style functions from .mm files will fail, therefore we need to wrap them with extern
// "C" so they are handled correctly. We also need to have imports positioned in a correct way, so that this extern "C"
// wrapper is used before the functions from RCTUIKit are used.
#ifdef __cplusplus
extern "C" {
#endif

#import <React/RCTUIKit.h>

#ifdef __cplusplus
}
#endif

#define RNSVGColor NSColor
#define RNSVGPlatformView NSView
#define RNSVGTextView NSTextView

@interface RNSVGColor (CGColor)
- (NSColor *)CGColor;
@end

@interface RNSVGView :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView
#else
    RCTUIView
#endif // RCT_NEW_ARCH_ENABLED

@property CGPoint center;
@property (nonatomic, strong) RNSVGColor *tintColor;

@end

// TODO: These could probably be a part of react-native-macos
// See https://github.com/microsoft/react-native-macos/issues/658 and
// https://github.com/microsoft/react-native-macos/issues/659
@interface NSImage (RNSVGMacOSExtensions)
@property (readonly) CGImageRef CGImage;
@end

@interface NSValue (RNSVGMacOSExtensions)
+ (NSValue *)valueWithCGAffineTransform:(CGAffineTransform)transform;
+ (NSValue *)valueWithCGPoint:(CGPoint)point;

@property (readonly) CGAffineTransform CGAffineTransformValue;
@property (readonly) CGPoint CGPointValue;
@end

// These functions are copied from react-native-macos to enable compatibility with react-native-macos@0.76+
// https://github.com/microsoft/react-native-macos/blob/7361b165ef633d3d95dbdb69da58ff6119f07369/packages/react-native/React/Base/macOS/RCTUIKit.m
// See https://github.com/software-mansion/react-native-svg/issues/2528
void RNSVGUIGraphicsBeginImageContextWithOptions(CGSize size, __unused BOOL opaque, CGFloat scale);
void RNSVGUIGraphicsEndImageContext(void);
NSImage *RNSVGUIGraphicsGetImageFromCurrentImageContext(void);

#endif // ] TARGET_OS_OSX
