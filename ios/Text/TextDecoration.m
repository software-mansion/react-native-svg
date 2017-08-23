#import "TextDecoration.h"

NSString* TextDecorationToString( enum TextDecoration fw )
{
    return TextDecorationStrings[fw];
}

enum TextDecoration TextDecorationFromString( NSString* s )
{
    NSInteger i;
    NSString* fw;
    for (i = 0; fw = TextDecorationStrings[i], fw != nil; i++) {
        if ([fw isEqualToString:s]) {
            return i;
        }
    }
    return TextDecorationDEFAULT;
}
