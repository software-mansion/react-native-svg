/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGSvgViewModule.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#import "RNSVGSvgView.h"

@implementation RNSVGSvgViewModule

RCT_EXPORT_MODULE()

#ifdef RCT_NEW_ARCH_ENABLED
@synthesize viewRegistry_DEPRECATED = _viewRegistry_DEPRECATED;
#endif // RCT_NEW_ARCH_ENABLED
@synthesize bridge = _bridge;

- (void)toDataURL:(nonnull NSNumber *)reactTag
          options:(NSDictionary *)options
         callback:(RCTResponseSenderBlock)callback
          attempt:(int)attempt
{
#ifdef RCT_NEW_ARCH_ENABLED
  [self.viewRegistry_DEPRECATED addUIBlock:^(RCTViewRegistry *viewRegistry) {
    __kindof RNSVGPlatformView *view = [viewRegistry viewForReactTag:reactTag];
#else
  [self.bridge.uiManager
      addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *, RNSVGPlatformView *> *viewRegistry) {
        __kindof RNSVGPlatformView *view = [uiManager viewForReactTag:reactTag];
#endif // RCT_NEW_ARCH_ENABLED
    NSString *b64;
    if ([view isKindOfClass:[RNSVGSvgView class]]) {
      RNSVGSvgView *svg = view;
      if (options == nil) {
        b64 = [svg getDataURLWithBounds:svg.boundingBox format:@"png" quality:1.0];
      } else {
        CGRect bounds;
        NSDictionary *size = [options objectForKey:@"size"];
        id width = [size objectForKey:@"width"];
        id height = [size objectForKey:@"height"];
        if (![width isKindOfClass:NSNumber.class] && ![height isKindOfClass:NSNumber.class]) {
          bounds = svg.boundingBox;
        } else {
          NSNumber *w = width;
          NSInteger wi = w ? (NSInteger)[w intValue] : svg.boundingBox.size.width;
          NSNumber *h = height;
          NSInteger hi = h ? (NSInteger)[h intValue] : svg.boundingBox.size.height;
          bounds = CGRectMake(0, 0, wi, hi);
        }
        NSString *format = [options objectForKey:@"format"];
        NSNumber *qualityNumber = [options objectForKey:@"quality"];
        CGFloat quality = qualityNumber ? [qualityNumber doubleValue] : 1.0;
        b64 = [svg getDataURLWithBounds:bounds format:format quality:quality];
      }
    } else {
      RCTLogError(@"Invalid svg returned from registry, expecting RNSVGSvgView, got: %@", view);
      return;
    }
    if (b64) {
      callback(@[ b64 ]);
    } else if (attempt < 1) {
      [self toDataURL:reactTag options:options callback:callback attempt:(attempt + 1)];
    } else {
      callback(@[]);
    }
  }];
};

RCT_EXPORT_METHOD(toDataURL
                  : (nonnull NSNumber *)reactTag options
                  : (NSDictionary *)options callback
                  : (RCTResponseSenderBlock)callback)
{
  [self toDataURL:reactTag options:options callback:callback attempt:0];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeSvgViewModuleSpecJSI>(params);
}
#endif

- (dispatch_queue_t)methodQueue
{
  if (self.bridge) {
    return RCTGetUIManagerQueue();
  } else {
    return dispatch_get_main_queue();
  }
}

@end
