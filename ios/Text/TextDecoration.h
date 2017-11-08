#import <Foundation/Foundation.h>

#ifndef TextDecoration_h
#define TextDecoration_h

NS_ENUM(NSInteger, TextDecoration) {
    TextDecorationNone,
    TextDecorationUnderline,
    TextDecorationOverline,
    TextDecorationLineThrough,
    TextDecorationBlink,
    TextDecorationDEFAULT = TextDecorationNone,
};

static NSString* const TextDecorationStrings[] = {@"None", @"Underline", @"Overline", @"LineThrough", @"Blink", nil};

NSString* TextDecorationToString( enum TextDecoration fw );

enum TextDecoration TextDecorationFromString( NSString* s );

#endif
