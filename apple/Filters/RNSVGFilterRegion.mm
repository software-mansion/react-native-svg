#import <RNSVGFilterRegion.h>

@implementation RNSVGFilterRegion

- (instancetype)init
{
  self = [super init];
  return self;
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

- (CGRect)getCropRect:(RNSVGNode *)node units:(RNSVGUnits)units renderableBounds:(CGRect)renderableBounds
{
  CGFloat x, y, width, height;
  if (units == kRNSVGUnitsObjectBoundingBox) {
    x = [node relativeOnFraction:self.x relative:renderableBounds.size.width];
    y = [node relativeOnFraction:self.y relative:renderableBounds.size.height];
    width = [node relativeOnFraction:self.width relative:renderableBounds.size.width];
    height = [node relativeOnFraction:self.height relative:renderableBounds.size.height];
    return CGRectMake(renderableBounds.origin.x + x, renderableBounds.origin.y + y, width, height);
  } else { // kRNSVGUnitsUserSpaceOnUse
    x = [node relativeOnWidth:self.x];
    y = [node relativeOnHeight:self.y];
    width = [node relativeOnWidth:self.width];
    height = [node relativeOnHeight:self.height];
    return CGRectMake(x, y, width, height);
  }
}

- (void)resetProperties
{
  _x = nil;
  _y = nil;
  _width = nil;
  _height = nil;
}

@end
