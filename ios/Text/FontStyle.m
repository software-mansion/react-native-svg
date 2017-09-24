#import "FontStyle.h"

NSString* FontStyleToString( enum FontStyle fw )
{
    return FontStyleStrings[fw];
}

enum FontStyle FontStyleFromString( NSString* s )
{
    const NSUInteger l = sizeof(FontStyleStrings) / sizeof(NSString*);
    for (NSUInteger i = 0; i < l; i++) {
        if ([s isEqualToString:FontStyleStrings[i]]) {
            return i;
        }
    }
    return FontStyleDEFAULT;
}
