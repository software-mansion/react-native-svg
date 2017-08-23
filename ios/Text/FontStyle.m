#import "FontStyle.h"

NSString* FontStyleToString( enum FontStyle fw )
{
    return FontStyleStrings[fw];
}

enum FontStyle FontStyleFromString( NSString* s )
{
    NSInteger i;
    NSString* fw;
    for (i = 0; fw = FontStyleStrings[i], fw != nil; i++) {
        if ([fw isEqualToString:s]) {
            return i;
        }
    }
    return FontStyleDEFAULT;
}
