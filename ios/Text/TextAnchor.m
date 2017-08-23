#import "TextAnchor.h"

NSString* TextAnchorToString( enum TextAnchor fw )
{
    return TextAnchorStrings[fw];
}

enum TextAnchor TextAnchorFromString( NSString* s )
{
    NSInteger i;
    NSString* fw;
    for (i = 0; fw = TextAnchorStrings[i], fw != nil; i++) {
        if ([fw isEqualToString:s]) {
            return i;
        }
    }
    return TextAnchorDEFAULT;
}
