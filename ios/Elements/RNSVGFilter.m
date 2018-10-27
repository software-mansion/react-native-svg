
#import "RNSVGFilter.h"

@implementation RNSVGFilter


- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    return nil;
}

- (void)parseReference
{
    [self.svgView defineFilter:self filterName:self.name];
}

- (void)setX:(RNSVGLength *)x
{
    if ([x isEqualTo:_x]) {
        return;
    }

    _x = x;
    [self invalidate];
}

- (void)setY:(RNSVGLength *)y
{
    if ([y isEqualTo:_y]) {
        return;
    }

    _y = y;
    [self invalidate];
}

- (void)setFilterwidth:(RNSVGLength *)filterwidth
{
    if ([filterwidth isEqualTo:_filterwidth]) {
        return;
    }

    _filterwidth = filterwidth;
    [self invalidate];
}

- (void)setFilterheight:(RNSVGLength *)filterheight
{
    if ([filterheight isEqualTo:_filterheight]) {
        return;
    }

    _filterheight = filterheight;
    [self invalidate];
}

- (void)setFilterUnits:(RNSVGUnits)filterUnits
{
    if (filterUnits == _filterUnits) {
        return;
    }

    _filterUnits = filterUnits;
    [self invalidate];
}

- (void)setPrimitiveUnits:(RNSVGUnits)primitiveUnits
{
    if (primitiveUnits == _primitiveUnits) {
        return;
    }

    _primitiveUnits = primitiveUnits;
    [self invalidate];
}

@end

