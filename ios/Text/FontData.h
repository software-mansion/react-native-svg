#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "FontStyle.h"
#import "FontVariantLigatures.h"
#import "FontWeight.h"
#import "PropHelper.h"
#import "TextAnchor.h"
#import "TextDecoration.h"

@interface FontData : NSObject {
@public
    double fontSize;
    NSString * fontSize_;
    NSString *fontFamily;
    enum FontStyle fontStyle;
    NSString * fontStyle_;
    NSDictionary * fontData;
    enum FontWeight fontWeight;
    NSString * fontWeight_;
    NSString *fontFeatureSettings;
    enum FontVariantLigatures fontVariantLigatures;
    enum TextAnchor textAnchor;
    enum TextDecoration textDecoration;
    double kerning;
    double wordSpacing;
    double letterSpacing;
    bool manualKerning;
}

+ (instancetype)Defaults;

+ (double)toAbsoluteWithNSString:(NSString *)string
                           scale:(double)scale
                        fontSize:(double)fontSize;

+ (instancetype)initWithNSDictionary:(NSDictionary *)font
                              parent:(FontData *)parent
                               scale:(double)scale;

@end

#define FontData_DEFAULT_FONT_SIZE 12.0
