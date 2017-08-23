#import "FontVariantLigatures.h"

NSString* FontVariantLigaturesToString( enum FontVariantLigatures fw )
{
    return FontVariantLigaturesStrings[fw];
}

enum FontVariantLigatures FontVariantLigaturesFromString( NSString* s )
{
    NSInteger i;
    NSString* fw;
    for (i = 0; fw = FontVariantLigaturesStrings[i], fw != nil; i++) {
        if ([fw isEqualToString:s]) {
            return i;
        }
    }
    return FontVariantLigaturesDEFAULT;
}
