#import <Foundation/Foundation.h>

#ifndef TextLengthAdjust_h
#define TextLengthAdjust_h

NS_ENUM(NSInteger, TextLengthAdjust) {
    TextLengthAdjustSpacing,
    TextLengthAdjustSpacingAndGlyphs,
    TextLengthAdjustDEFAULT = TextLengthAdjustSpacing,
};

static NSString* const TextLengthAdjustStrings[] = {@"spacing", @"spacingAndGlyphs", nil};

NSString* TextLengthAdjustToString( enum TextLengthAdjust fw );

enum TextLengthAdjust TextLengthAdjustFromString( NSString* s );

#endif
