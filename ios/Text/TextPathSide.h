#import <Foundation/Foundation.h>

#ifndef TextPathSide_h
#define TextPathSide_h

NS_ENUM(NSInteger, TextPathSide) {
    TextPathSideLeft,
    TextPathSideRight,
    TextPathSideDEFAULT = TextPathSideLeft,
};

static NSString* const TextPathSideStrings[] = {@"left", @"right", nil};

NSString* TextPathSideToString( enum TextPathSide fw );

enum TextPathSide TextPathSideFromString( NSString* s );

#endif
