#import "FontWeight.h"

NSString* FontWeightToString( enum FontWeight fw )
{
    return FontWeightStrings[fw];
}

enum FontWeight FontWeightFromString( NSString* s )
{
    const NSUInteger l = sizeof(FontWeightStrings) / sizeof(NSString*);
    for (NSUInteger i = 0; i < l; i++) {
        if ([s isEqualToString:FontWeightStrings[i]]) {
            return i;
        }
    }
    return FontWeightDEFAULT;
}
