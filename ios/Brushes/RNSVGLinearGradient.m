/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGLinearGradient.h"

#import "RCTConvert+RNSVG.h"
#import "RCTLog.h"

@implementation RNSVGLinearGradient
{
  CGGradientRef _gradient;
  CGPoint _startPoint;
  CGPoint _endPoint;
}

- (instancetype)initWithArray:(NSArray<NSNumber *> *)array
{
  if ((self = [super initWithArray:array])) {
    if (array.count < 5) {
      RCTLogError(@"-[%@ %@] expects 5 elements, received %@",
                  self.class, NSStringFromSelector(_cmd), array);
      return nil;
    }
    _startPoint = [RCTConvert CGPoint:array offset:1];
    _endPoint = [RCTConvert CGPoint:array offset:3];
    _gradient = CGGradientRetain([RCTConvert CGGradient:array offset:5]);
  }
  return self;
}

- (void)dealloc
{
  CGGradientRelease(_gradient);
}

- (void)paint:(CGContextRef)context
{
  CGGradientDrawingOptions extendOptions =
    kCGGradientDrawsBeforeStartLocation | kCGGradientDrawsAfterEndLocation;
  CGContextDrawLinearGradient(context, _gradient, _startPoint, _endPoint, extendOptions);
}

@end
