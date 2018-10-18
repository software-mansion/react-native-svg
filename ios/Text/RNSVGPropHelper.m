#include "RNSVGPropHelper.h"
@implementation RNSVGPropHelper

+ (double)fromRelativeWithNSString:(NSString *)length
                          relative:(double)relative
                            offset:(double)offset
                             scale:(double)scale
                          fontSize:(double)fontSize {
    length = [length stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];
    NSUInteger stringLength = [length length];
    NSInteger percentIndex = stringLength - 1;
    if (stringLength == 0) {
        return offset;
    }
    else if ([length characterAtIndex:percentIndex] == '%') {
        return [[length substringWithRange:NSMakeRange(0, percentIndex)] doubleValue] / 100 * relative + offset;
    }
    else {
        NSInteger twoLetterUnitIndex = stringLength - 2;
        if (twoLetterUnitIndex > 0) {
            NSString *lastTwo = [length substringFromIndex:twoLetterUnitIndex];
            NSUInteger end = twoLetterUnitIndex;
            double unit = 1;
            if ([lastTwo isEqualToString:@"px"]) {

            } else if ([lastTwo isEqualToString:@"em"]) {
                unit = fontSize;
            } else if ([lastTwo isEqualToString:@"ex"]) {
                unit = fontSize / 2;
            } else if ([lastTwo isEqualToString:@"pt"]) {
                unit = 1.25;
            } else if ([lastTwo isEqualToString:@"pc"]) {
                unit = 15;
            } else if ([lastTwo isEqualToString:@"mm"]) {
                unit = 3.543307;
            } else if ([lastTwo isEqualToString:@"cm"]) {
                unit = 35.43307;
            } else if ([lastTwo isEqualToString:@"in"]) {
                unit = 90;
            } else {
                end = stringLength;
            }

            return [[length substringWithRange:NSMakeRange(0, end)] doubleValue] * unit * scale + offset;
        } else {
            return [length doubleValue] * scale + offset;
        }
    }
}

+ (double)fromRelative:(RNSVGLength*)length
              relative:(double)relative
              fontSize:(double)fontSize {
    RNSVGLengthUnitType unitType = length.unit;
    double value = length.value;
    double unit = 1;
    switch (unitType) {
        case SVG_LENGTHTYPE_NUMBER:
        case SVG_LENGTHTYPE_PX:
            return value;
            break;

        case SVG_LENGTHTYPE_PERCENTAGE:
            return value / 100 * relative;

        case SVG_LENGTHTYPE_EMS:
            unit = fontSize;
            break;
        case SVG_LENGTHTYPE_EXS:
            unit = fontSize / 2;
            break;

        case SVG_LENGTHTYPE_CM:
            unit = 35.43307;
            break;
        case SVG_LENGTHTYPE_MM:
            unit = 3.543307;
            break;
        case SVG_LENGTHTYPE_IN:
            unit = 90;
            break;
        case SVG_LENGTHTYPE_PT:
            unit = 1.25;
            break;
        case SVG_LENGTHTYPE_PC:
            unit = 15;
            break;

        default:
        case SVG_LENGTHTYPE_UNKNOWN:
            return value;
    }
    return value * unit;
}

+ (double)fromRelative:(RNSVGLength*)length
              relative:(double)relative {
    RNSVGLengthUnitType unitType = length.unit;
    double value = length.value;
    double unit = 1;
    switch (unitType) {
        case SVG_LENGTHTYPE_NUMBER:
        case SVG_LENGTHTYPE_PX:
            return value;
            break;

        case SVG_LENGTHTYPE_PERCENTAGE:
            return value / 100 * relative;

        case SVG_LENGTHTYPE_EMS:
            unit = 12;
            break;
        case SVG_LENGTHTYPE_EXS:
            unit = 6;
            break;

        case SVG_LENGTHTYPE_CM:
            unit = 35.43307;
            break;
        case SVG_LENGTHTYPE_MM:
            unit = 3.543307;
            break;
        case SVG_LENGTHTYPE_IN:
            unit = 90;
            break;
        case SVG_LENGTHTYPE_PT:
            unit = 1.25;
            break;
        case SVG_LENGTHTYPE_PC:
            unit = 15;
            break;

        default:
        case SVG_LENGTHTYPE_UNKNOWN:
            return value;
    }
    return value * unit;
}

@end
