#import "TextPathSide.h"

NSString* TextPathSideToString( enum TextPathSide fw )
{
    return TextPathSideStrings[fw];
}

enum TextPathSide TextPathSideFromString( NSString* s )
{
    NSInteger i;
    NSString* fw;
    for (i = 0; fw = TextPathSideStrings[i], fw != nil; i++) {
        if ([fw isEqualToString:s]) {
            return i;
        }
    }
    return TextPathSideDEFAULT;
}
