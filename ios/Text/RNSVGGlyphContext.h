#import <React/UIView+React.h>
#import <CoreText/CoreText.h>
#import "RNSVGFontData.h"

@class RNSVGText;
@class RNSVGGroup;
@class RNSVGGlyphContext;

@interface RNSVGGlyphContext : NSObject

- (CTFontRef)getGlyphFont;

- (instancetype)initWithScale:(float)scale_
                        width:(float)width
                       height:(float)height;

- (RNSVGFontData *)getFont;

- (double)getFontSize;

- (float)getHeight;

- (float)getWidth;

- (double)nextDeltaX;

- (double)nextDeltaY;

- (double)nextRotation;

- (double)nextXWithDouble:(double)advance;

- (double)nextY;

- (void)popContext;

- (void)pushContext:(RNSVGText*)node
               font:(NSDictionary*)font
                  x:(NSArray<RNSVGLength*>*)x
                  y:(NSArray<RNSVGLength*>*)y
             deltaX:(NSArray<RNSVGLength*>*)deltaX
             deltaY:(NSArray<RNSVGLength*>*)deltaY
             rotate:(NSArray<RNSVGLength*>*)rotate;

- (void)pushContext:(RNSVGGroup*)node
                             font:(NSDictionary *)font;


@end
