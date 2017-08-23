#import <Foundation/Foundation.h>

#if !defined (TextPathSide_)
#define TextPathSide_

NS_ENUM(NSInteger, TextPathSide) {
    TextPathSideLeft,
    TextPathSideRight,
    TextPathSideDEFAULT = TextPathSideLeft,
};

static NSString* const TextPathSideStrings[] = {@"left", @"right", nil};

NSString* TextPathSideToString( enum TextPathSide fw );

enum TextPathSide TextPathSideFromString( NSString* s );

#endif
