/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGEllipse.h"
#import <React/RCTLog.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/view/conversions.h>
#import <rnsvg/RNSVGComponentDescriptors.h>
#import "RNSVGFabricConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSVGEllipse

#ifdef RCT_NEW_ARCH_ENABLED
using namespace facebook::react;

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGEllipseProps>();
    _props = defaultProps;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGEllipseComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = static_cast<const RNSVGEllipseProps &>(*props);

  id cx = RNSVGConvertFollyDynamicToId(newProps.cx);
  if (cx != nil) {
    self.cx = [RCTConvert RNSVGLength:cx];
  }
  id cy = RNSVGConvertFollyDynamicToId(newProps.cy);
  if (cy != nil) {
    self.cy = [RCTConvert RNSVGLength:cy];
  }
  id rx = RNSVGConvertFollyDynamicToId(newProps.rx);
  if (rx != nil) {
    self.rx = [RCTConvert RNSVGLength:rx];
  }
  id ry = RNSVGConvertFollyDynamicToId(newProps.ry);
  if (ry != nil) {
    self.ry = [RCTConvert RNSVGLength:ry];
  }

  setCommonRenderableProps(newProps, self);
  _props = std::static_pointer_cast<RNSVGEllipseProps const>(props);
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _cx = nil;
  _cy = nil;
  _rx = nil;
  _ry = nil;
}
#endif // RCT_NEW_ARCH_ENABLED

- (void)setCx:(RNSVGLength *)cx
{
  if ([cx isEqualTo:_cx]) {
    return;
  }
  [self invalidate];
  _cx = cx;
}

- (void)setCy:(RNSVGLength *)cy
{
  if ([cy isEqualTo:_cy]) {
    return;
  }
  [self invalidate];
  _cy = cy;
}

- (void)setRx:(RNSVGLength *)rx
{
  if ([rx isEqualTo:_rx]) {
    return;
  }
  [self invalidate];
  _rx = rx;
}

- (void)setRy:(RNSVGLength *)ry
{
  if ([ry isEqualTo:_ry]) {
    return;
  }
  [self invalidate];
  _ry = ry;
}

- (CGPathRef)getPath:(CGContextRef)context
{
  CGMutablePathRef path = CGPathCreateMutable();
  CGFloat cx = [self relativeOnWidth:self.cx];
  CGFloat cy = [self relativeOnHeight:self.cy];
  CGFloat rx = [self relativeOnWidth:self.rx];
  CGFloat ry = [self relativeOnHeight:self.ry];
  CGPathAddEllipseInRect(path, nil, CGRectMake(cx - rx, cy - ry, rx * 2, ry * 2));
  return (CGPathRef)CFAutorelease(path);
}

@end

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSVGEllipseCls(void)
{
  return RNSVGEllipse.class;
}
#endif // RCT_NEW_ARCH_ENABLED
