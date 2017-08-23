#import <Foundation/Foundation.h>

#if !defined (TextLengthAdjust_)
#define TextLengthAdjust_

NS_ENUM(NSInteger, TextLengthAdjust) {
    TextLengthAdjustSpacing,
    TextLengthAdjustSpacingAndGlyphs,
    TextLengthAdjustDEFAULT = TextLengthAdjustSpacing,
};

static NSString* const TextLengthAdjustStrings[] = {@"spacing", @"spacingAndGlyphs", nil};

NSString* TextLengthAdjustToString( enum TextLengthAdjust fw );

enum TextLengthAdjust TextLengthAdjustFromString( NSString* s );

#endif
