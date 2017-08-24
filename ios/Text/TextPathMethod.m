#import "TextPathMethod.h"

NSString* TextPathMethodToString( enum TextPathMethod fw )
{
    return TextPathMethodStrings[fw];
}

enum TextPathMethod TextPathMethodFromString( NSString* s )
{
    const NSUInteger l = sizeof(TextPathMethodStrings) / sizeof(NSString*);
    for (NSUInteger i = 0; i < l; i++) {
        if ([s isEqualToString:TextPathMethodStrings[i]]) {
            return i;
        }
    }
    return TextPathMethodDEFAULT;
}
