#import <Foundation/Foundation.h>

#if !defined (TextPathMethod_)
#define TextPathMethod_

NS_ENUM(NSInteger, TextPathMethod) {
    TextPathMethodAlign,
    TextPathMethodStretch,
    TextPathMethodDEFAULT = TextPathMethodAlign,
};

static NSString* const TextPathMethodStrings[] = {@"align", @"stretch", nil};

NSString* TextPathMethodToString( enum TextPathMethod fw );

enum TextPathMethod TextPathMethodFromString( NSString* s );

#endif
