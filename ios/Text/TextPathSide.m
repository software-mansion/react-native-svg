#import "TextPathSide.h"

NSString* TextPathSideToString( enum TextPathSide fw )
{
    return TextPathSideStrings[fw];
}

enum TextPathSide TextPathSideFromString( NSString* s )
{
    const NSUInteger l = sizeof(TextPathSideStrings) / sizeof(NSString*);
    for (NSUInteger i = 0; i < l; i++) {
        if ([s isEqualToString:TextPathSideStrings[i]]) {
            return i;
        }
    }
    return TextPathSideDEFAULT;
}
