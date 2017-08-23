#import "FontWeight.h"

NSString* FontWeightToString( enum FontWeight fw )
{
    return FontWeightStrings[fw];
}

enum FontWeight FontWeightFromString( NSString* s )
{
    NSInteger i;
    NSString* fw;
    for (i = 0; fw = FontWeightStrings[i], fw != nil; i++) {
        if ([fw isEqualToString:s]) {
            return i;
        }
    }
    return FontWeightDEFAULT;
}
