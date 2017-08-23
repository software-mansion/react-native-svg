#import "TextPathMidLine.h"

NSString* TextPathMidLineToString( enum TextPathMidLine fw )
{
    return TextPathMidLineStrings[fw];
}

enum TextPathMidLine TextPathMidLineFromString( NSString* s )
{
    NSInteger i;
    NSString* fw;
    for (i = 0; fw = TextPathMidLineStrings[i], fw != nil; i++) {
        if ([fw isEqualToString:s]) {
            return i;
        }
    }
    return TextPathMidLineDEFAULT;
}
