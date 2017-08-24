#import <Foundation/Foundation.h>

#ifndef TextPathMidLine_h
#define TextPathMidLine_h

NS_ENUM(NSInteger, TextPathMidLine) {
    TextPathMidLineSharp,
    TextPathMidLineSmooth,
    TextPathMidLineDEFAULT = TextPathMidLineSharp,
};

static NSString* const TextPathMidLineStrings[] = {@"sharp", @"smooth", nil};

NSString* TextPathMidLineToString( enum TextPathMidLine fw );

enum TextPathMidLine TextPathMidLineFromString( NSString* s );

#endif
