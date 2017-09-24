#import <Foundation/Foundation.h>

#ifndef FontVariantLigatures_h
#define FontVariantLigatures_h

NS_ENUM(NSInteger, FontVariantLigatures) {
    FontVariantLigaturesNormal,
    FontVariantLigaturesNone,
    FontVariantLigaturesDEFAULT = FontVariantLigaturesNormal,
};

static NSString* const FontVariantLigaturesStrings[] = {@"normal", @"none", nil};

NSString* FontVariantLigaturesToString( enum FontVariantLigatures fw );

enum FontVariantLigatures FontVariantLigaturesFromString( NSString* s );

#endif
