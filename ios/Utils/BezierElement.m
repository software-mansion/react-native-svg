/*

 Erica Sadun, http://ericasadun.com
 https://github.com/erica/iOS-Drawing/tree/master/C08/Quartz%20Book%20Pack/Bezier
 */

#import "BezierElement.h"

#pragma mark - Bezier Element -

@implementation BezierElement
- (instancetype) init
{
    self = [super init];
    if (self)
    {
        _elementType = kCGPathElementMoveToPoint;
        _point = NULLPOINT;
        _controlPoint1 = NULLPOINT;
        _controlPoint2 = NULLPOINT;
    }
    return self;
}
@end

