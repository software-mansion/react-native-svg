#import "TextLengthAdjust.h"

NSString* TextLengthAdjustToString( enum TextLengthAdjust fw )
{
    return TextLengthAdjustStrings[fw];
}

enum TextLengthAdjust TextLengthAdjustFromString( NSString* s )
{
    const NSUInteger l = sizeof(TextLengthAdjustStrings) / sizeof(NSString*);
    for (NSUInteger i = 0; i < l; i++) {
        if ([s isEqualToString:TextLengthAdjustStrings[i]]) {
            return i;
        }
    }
    return TextLengthAdjustDEFAULT;
}
