#import "FontData.h"
#import "FontStyle.h"
#import "FontVariantLigatures.h"
#import "FontWeight.h"
#import "PropHelper.h"
#import "TextAnchor.h"
#import "TextDecoration.h"
#import "RNSVGNode.h"

#define DEFAULT_KERNING 0.0
#define DEFAULT_WORD_SPACING 0.0
#define DEFAULT_LETTER_SPACING 0.0
static NSString *KERNING = @"kerning";
static NSString *FONT_SIZE = @"fontSize";
static NSString *FONT_DATA = @"fontData";
static NSString *FONT_STYLE = @"fontStyle";
static NSString *FONT_WEIGHT = @"fontWeight";
static NSString *FONT_FAMILY = @"fontFamily";
static NSString *TEXT_ANCHOR = @"textAnchor";
static NSString *WORD_SPACING = @"wordSpacing";
static NSString *LETTER_SPACING = @"letterSpacing";
static NSString *TEXT_DECORATION = @"textDecoration";
static NSString *FONT_FEATURE_SETTINGS = @"fontFeatureSettings";
static NSString *FONT_VARIANT_LIGATURES = @"fontVariantLigatures";

FontData *FontData_Defaults;

@implementation FontData

+ (instancetype)Defaults {
    if (!FontData_Defaults) {
        FontData *self = [FontData alloc];
        self->fontData = nil;
        self->fontFamily = @"";
        self->fontStyle = FontStyleNormal;
        self->fontWeight = FontWeightNormal;
        self->fontFeatureSettings = @"";
        self->fontVariantLigatures = FontVariantLigaturesNormal;
        self->textAnchor = TextAnchorStart;
        self->textDecoration = TextDecorationNone;
        self->manualKerning = false;
        self->kerning = DEFAULT_KERNING;
        self->fontSize = DEFAULT_FONT_SIZE;
        self->wordSpacing = DEFAULT_WORD_SPACING;
        self->letterSpacing = DEFAULT_LETTER_SPACING;
        FontData_Defaults = self;
    }
    return FontData_Defaults;
}

+ (double)toAbsoluteWithNSString:(NSString *)string
                           scale:(double)scale
                        fontSize:(double)fontSize {
    return [PropHelper fromRelativeWithNSString:string
                                       relative:0
                                         offset:0
                                          scale:scale
                                       fontSize:fontSize];
}

+ (instancetype)initWithNSDictionary:(NSDictionary *)font
                              parent:(FontData *)parent
                               scale:(double)scale {
    FontData *data = [FontData alloc];
    double parentFontSize = parent->fontSize;
    if ([font objectForKey:FONT_SIZE]) {
        NSString *string = [font objectForKey:FONT_SIZE];
        data->fontSize = [PropHelper fromRelativeWithNSString:string
                                                     relative:parentFontSize
                                                       offset:0
                                                        scale:scale
                                                     fontSize:parentFontSize];
    }
    else {
        data->fontSize = parentFontSize;
    }
    data->fontData = [font objectForKey:FONT_DATA] ? [font objectForKey:FONT_DATA] : parent->fontData;
    data->fontFamily = [font objectForKey:FONT_FAMILY] ? [font objectForKey:FONT_FAMILY] : parent->fontFamily;
    NSString* style = [font objectForKey:FONT_STYLE];
    data->fontStyle = style ? FontStyleFromString(style) : parent->fontStyle;
    NSString* weight = [font objectForKey:FONT_WEIGHT];
    data->fontWeight = weight ? FontWeightFromString(weight) : parent->fontWeight;
    NSString* feature = [font objectForKey:FONT_FEATURE_SETTINGS];
    data->fontFeatureSettings = feature ? [font objectForKey:FONT_FEATURE_SETTINGS] : parent->fontFeatureSettings;
    NSString* variant = [font objectForKey:FONT_VARIANT_LIGATURES];
    data->fontVariantLigatures = variant ? FontVariantLigaturesFromString(variant) : parent->fontVariantLigatures;
    NSString* anchor = [font objectForKey:TEXT_ANCHOR];
    data->textAnchor = anchor ? TextAnchorFromString(anchor) : parent->textAnchor;
    NSString* decoration = [font objectForKey:TEXT_DECORATION];
    data->textDecoration = decoration ? TextDecorationFromString(decoration) : parent->textDecoration;
    NSString* kerning = [font objectForKey:KERNING];
    data->manualKerning = (kerning || parent->manualKerning );
    data->kerning = kerning ? [FontData toAbsoluteWithNSString:kerning
                                                         scale:scale
                                                      fontSize:data->fontSize ] : parent->kerning;
    NSString* wordSpacing = [font objectForKey:WORD_SPACING];
    data->wordSpacing = wordSpacing ? [FontData toAbsoluteWithNSString:wordSpacing
                                                                 scale:scale
                                                              fontSize:data->fontSize ] : parent->wordSpacing;
    NSString* letterSpacing = [font objectForKey:LETTER_SPACING];
    data->letterSpacing = letterSpacing ? [FontData toAbsoluteWithNSString:letterSpacing
                                                                     scale:scale
                                                                  fontSize:data->fontSize ] : parent->letterSpacing;
    return data;
}


@end
