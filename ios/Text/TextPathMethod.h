#import <Foundation/Foundation.h>

#ifndef TextPathMethod_h
#define TextPathMethod_h

NS_ENUM(NSInteger, TextPathMethod) {
    TextPathMethodAlign,
    TextPathMethodStretch,
    TextPathMethodDEFAULT = TextPathMethodAlign,
};

static NSString* const TextPathMethodStrings[] = {@"align", @"stretch", nil};

NSString* TextPathMethodToString( enum TextPathMethod fw );

enum TextPathMethod TextPathMethodFromString( NSString* s );

#endif
