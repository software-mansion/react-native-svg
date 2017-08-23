#import "TextPathMethod.h"

NSString* TextPathMethodToString( enum TextPathMethod fw )
{
    return TextPathMethodStrings[fw];
}

enum TextPathMethod TextPathMethodFromString( NSString* s )
{
    NSInteger i;
    NSString* fw;
    for (i = 0; fw = TextPathMethodStrings[i], fw != nil; i++) {
        if ([fw isEqualToString:s]) {
            return i;
        }
    }
    return TextPathMethodDEFAULT;
}
