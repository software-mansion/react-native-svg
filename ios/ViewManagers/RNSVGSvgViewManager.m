/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RCTBridge.h"
#import "RCTUIManager.h"
#import "RNSVGSvgViewManager.h"
#import "RNSVGSvgView.h"

@implementation RNSVGSvgViewManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [RNSVGSvgView new];
}


RCT_EXPORT_METHOD(toDataURL:(nonnull NSNumber *)reactTag callback:(RCTResponseSenderBlock)callback)
{
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        UIView *view = viewRegistry[reactTag];
        if (![view isKindOfClass:[RNSVGSvgView class]]) {
            RCTLogError(@"Invalid svg returned frin registry, expecting RNSVGSvgView, got: %@", view);
        } else {
            RNSVGSvgView *svg = view;
            callback(@[[svg getDataURL]]);
        }
    }];
}

@end
