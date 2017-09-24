#import <React/UIView+React.h>
#import <CoreText/CoreText.h>
#import "FontData.h"

@class RNSVGText;
@class RNSVGGroup;
@class GlyphContext;

@interface GlyphContext : NSObject

- (CTFontRef)getGlyphFont;

- (instancetype)initWithScale:(float)scale_
                        width:(float)width
                       height:(float)height;

- (FontData *)getFont;

- (double)getFontSize;

- (float)getHeight;

- (float)getWidth;

- (double)nextDeltaX;

- (double)nextDeltaY;

- (NSNumber*)nextRotation;

- (double)nextXWithDouble:(double)advance;

- (double)nextY;

- (void)popContext;

- (void)pushContextwithRNSVGText:(RNSVGText *)node
                           reset:(bool)reset
                            font:(NSDictionary *)font
                               x:(NSArray*)x
                               y:(NSArray*)y
                          deltaX:(NSArray*)deltaX
                          deltaY:(NSArray*)deltaY
                          rotate:(NSArray*)rotate;

- (void)pushContextWithRNSVGGroup:(RNSVGGroup*)node
                             font:(NSDictionary *)font;


@end
