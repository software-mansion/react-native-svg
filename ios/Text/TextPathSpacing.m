#import "TextPathSpacing.h"

NSString* TextPathSpacingToString( enum TextPathSpacing fw )
{
    return TextPathSpacingStrings[fw];
}

enum TextPathSpacing TextPathSpacingFromString( NSString* s )
{
    const NSUInteger l = sizeof(TextPathSpacingStrings) / sizeof(NSString*);
    for (NSUInteger i = 0; i < l; i++) {
        if ([s isEqualToString:TextPathSpacingStrings[i]]) {
            return i;
        }
    }
    return TextPathSpacingDEFAULT;
}
