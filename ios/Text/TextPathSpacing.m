#import <Foundation/Foundation.h>

#if !defined (TextPathSpacing_)
#define TextPathSpacing_

NS_ENUM(NSInteger, TextPathSpacing) {
    TextPathSpacingAutoSpacing,
    TextPathSpacingExact,
    TextPathSpacingDEFAULT = TextPathSpacingAutoSpacing,
};

static NSString* const TextPathSpacingStrings[] = {@"auto", @"exact", nil};

NSString* TextPathSpacingToString( enum TextPathSpacing fw );

enum TextPathSpacing TextPathSpacingFromString( NSString* s );

#endif
