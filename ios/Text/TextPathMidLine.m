#import "TextPathMidLine.h"

NSString* TextPathMidLineToString( enum TextPathMidLine fw )
{
    return TextPathMidLineStrings[fw];
}

enum TextPathMidLine TextPathMidLineFromString( NSString* s )
{
    const NSUInteger l = sizeof(TextPathMidLineStrings) / sizeof(NSString*);
    for (NSUInteger i = 0; i < l; i++) {
        if ([s isEqualToString:TextPathMidLineStrings[i]]) {
            return i;
        }
    }
    return TextPathMidLineDEFAULT;
}
