#import <Foundation/Foundation.h>

#if !defined (TextPathMidLine_)
#define TextPathMidLine_

NS_ENUM(NSInteger, TextPathMidLine) {
    TextPathMidLineSharp,
    TextPathMidLineSmooth,
    TextPathMidLineDEFAULT = TextPathMidLineSharp,
};

static NSString* const TextPathMidLineStrings[] = {@"sharp", @"smooth", nil};

NSString* TextPathMidLineToString( enum TextPathMidLine fw );

enum TextPathMidLine TextPathMidLineFromString( NSString* s );

#endif
