/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#if !TARGET_OS_OSX // ![macOS]
#import <UIKit/UIKit.h>
#else // [macOS]
#import <React/RCTUIKit.h> // [macOS]
#endif
#import <React/RCTShadowView.h>

@class RCTBridge;

NS_ASSUME_NONNULL_BEGIN

@interface RNSVGSvgShadowView : RCTShadowView

@property (nonatomic, assign) CGFloat vbWidth;
@property (nonatomic, assign) CGFloat vbHeight;

@end

NS_ASSUME_NONNULL_END
