#import <Foundation/Foundation.h>

#if !defined (TextDecoration_)
#define TextDecoration_

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
