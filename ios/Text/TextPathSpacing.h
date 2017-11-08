#import <Foundation/Foundation.h>

#ifndef TextPathSpacing_h
#define TextPathSpacing_h

NS_ENUM(NSInteger, TextPathSpacing) {
    TextPathSpacingAutoSpacing,
    TextPathSpacingExact,
    TextPathSpacingDEFAULT = TextPathSpacingAutoSpacing,
};

static NSString* const TextPathSpacingStrings[] = {@"auto", @"exact", nil};

NSString* TextPathSpacingToString( enum TextPathSpacing fw );

enum TextPathSpacing TextPathSpacingFromString( NSString* s );

#endif
