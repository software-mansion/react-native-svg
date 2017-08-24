#import "TextDecoration.h"

NSString* TextDecorationToString( enum TextDecoration fw )
{
    return TextDecorationStrings[fw];
}

enum TextDecoration TextDecorationFromString( NSString* s )
{
    const NSUInteger l = sizeof(TextDecorationStrings) / sizeof(NSString*);
    for (NSUInteger i = 0; i < l; i++) {
        if ([s isEqualToString:TextDecorationStrings[i]]) {
            return i;
        }
    }
    return TextDecorationDEFAULT;
}
