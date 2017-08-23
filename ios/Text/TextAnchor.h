#import <Foundation/Foundation.h>

#if !defined (TextAnchor_)
#define TextAnchor_

NS_ENUM(NSInteger, TextAnchor) {
    TextAnchorStart,
    TextAnchorMiddle,
    TextAnchorEnd,
    TextAnchorDEFAULT = TextAnchorStart,
};

static NSString* const TextAnchorStrings[] = {@"start", @"middle", @"end", nil};

NSString* TextAnchorToString( enum TextAnchor fw );

enum TextAnchor TextAnchorFromString( NSString* s );

#endif
