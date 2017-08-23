#import <Foundation/Foundation.h>

#if !defined (FontStyle_)
#define FontStyle_

NS_ENUM(NSInteger, FontStyle) {
    FontStyleNormal,
    FontStyleItalic,
    FontStyleOblique,
    FontStyleDEFAULT = FontStyleNormal,
};

static NSString* const FontStyleStrings[] = {@"normal", @"italic", @"oblique", nil};

NSString* FontStyleToString( enum FontStyle fw );

enum FontStyle FontStyleFromString( NSString* s );

#endif
