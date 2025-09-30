#import <RNSVGFilterRegion.h>

@implementation RNSVGFilterRegion

- (instancetype)init
{
  self = [super init];
  return self;
}

+ (instancetype)regionWithX:(RNSVGLength *)x y:(RNSVGLength *)y width:(RNSVGLength *)width height:(RNSVGLength *)height
{
  RNSVGFilterRegion *filterRegion = [[self alloc] init];
  filterRegion.x = x;
  filterRegion.y = y;
  filterRegion.width = width;
  filterRegion.height = height;
  return filterRegion;
}

- (void)setX:(RNSVGLength *)x
{
  _x = x;
}

- (void)setY:(RNSVGLength *)y
{
  _y = y;
}

- (void)setWidth:(RNSVGLength *)width
{
  _width = width;
}

- (void)setHeight:(RNSVGLength *)height
{
  _height = height;
}

+ (CGFloat)getRelativeOrDefault:(RNSVGNode *)node
                          value:(RNSVGLength *)value
                     relativeOn:(CGFloat)relativeOn
                   defaultValue:(CGFloat)defaultValue
{
  if (value == nil || value.unit == SVG_LENGTHTYPE_UNKNOWN) {
    return defaultValue;
  }
  return [node relativeOn:value relative:relativeOn];
}

- (CGRect)getCropRect:(RNSVGNode *)node units:(RNSVGUnits)units bounds:(CGRect)bounds
{
  CGFloat x, y, width, height;
  if (units == kRNSVGUnitsObjectBoundingBox) {
    x = [node relativeOnFraction:self.x relative:bounds.size.width];
    y = [node relativeOnFraction:self.y relative:bounds.size.height];
    width = [node relativeOnFraction:self.width relative:bounds.size.width];
    height = [node relativeOnFraction:self.height relative:bounds.size.height];
    return CGRectMake(bounds.origin.x + x, bounds.origin.y + y, width, height);
  } else { // kRNSVGUnitsUserSpaceOnUse
    x = [RNSVGFilterRegion getRelativeOrDefault:node
                                          value:self.x
                                     relativeOn:[node getCanvasWidth]
                                   defaultValue:bounds.origin.x];
    y = [RNSVGFilterRegion getRelativeOrDefault:node
                                          value:self.y
                                     relativeOn:[node getCanvasHeight]
                                   defaultValue:bounds.origin.y];
    width = [RNSVGFilterRegion getRelativeOrDefault:node
                                              value:self.width
                                         relativeOn:[node getCanvasWidth]
                                       defaultValue:bounds.size.width];
    height = [RNSVGFilterRegion getRelativeOrDefault:node
                                               value:self.height
                                          relativeOn:[node getCanvasHeight]
                                        defaultValue:bounds.size.height];
    return CGRectMake(x, y, width, height);
  }
}

@end
