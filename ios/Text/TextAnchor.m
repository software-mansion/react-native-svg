#import "TextAnchor.h"

NSString* TextAnchorToString( enum TextAnchor fw )
{
    return TextAnchorStrings[fw];
}

enum TextAnchor TextAnchorFromString( NSString* s )
{
    const NSUInteger l = sizeof(TextAnchorStrings) / sizeof(NSString*);
    for (NSUInteger i = 0; i < l; i++) {
        if ([s isEqualToString:TextAnchorStrings[i]]) {
            return i;
        }
    }
    return TextAnchorDEFAULT;
}
