#import "FontVariantLigatures.h"

NSString* FontVariantLigaturesToString( enum FontVariantLigatures fw )
{
    return FontVariantLigaturesStrings[fw];
}

enum FontVariantLigatures FontVariantLigaturesFromString( NSString* s )
{
    const NSUInteger l = sizeof(FontVariantLigaturesStrings) / sizeof(NSString*);
    for (NSUInteger i = 0; i < l; i++) {
        if ([s isEqualToString:FontVariantLigaturesStrings[i]]) {
            return i;
        }
    }
    return FontVariantLigaturesDEFAULT;
}
