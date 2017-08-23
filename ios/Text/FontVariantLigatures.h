#import <Foundation/Foundation.h>

#if !defined (FontVariantLigatures_)
#define FontVariantLigatures_

NS_ENUM(NSInteger, FontVariantLigatures) {
    FontVariantLigaturesNormal,
    FontVariantLigaturesNone,
    FontVariantLigaturesDEFAULT = FontVariantLigaturesNormal,
};

static NSString* const FontVariantLigaturesStrings[] = {@"normal", @"none", nil};

NSString* FontVariantLigaturesToString( enum FontVariantLigatures fw );

enum FontVariantLigatures FontVariantLigaturesFromString( NSString* s );

#endif
