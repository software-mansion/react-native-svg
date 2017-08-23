#import "TextLengthAdjust.h"

NSString* TextLengthAdjustToString( enum TextLengthAdjust fw )
{
    return TextLengthAdjustStrings[fw];
}

enum TextLengthAdjust TextLengthAdjustFromString( NSString* s )
{
    NSInteger i;
    NSString* fw;
    for (i = 0; fw = TextLengthAdjustStrings[i], fw != nil; i++) {
        if ([fw isEqualToString:s]) {
            return i;
        }
    }
    return TextLengthAdjustDEFAULT;
}
