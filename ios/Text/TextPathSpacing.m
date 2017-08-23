#import "TextPathSpacing.h"

NSString* TextPathSpacingToString( enum TextPathSpacing fw )
{
    return TextPathSpacingStrings[fw];
}

enum TextPathSpacing TextPathSpacingFromString( NSString* s )
{
    NSInteger i;
    NSString* fw;
    for (i = 0; fw = TextPathSpacingStrings[i], fw != nil; i++) {
        if ([fw isEqualToString:s]) {
            return i;
        }
    }
    return TextPathSpacingDEFAULT;
}
