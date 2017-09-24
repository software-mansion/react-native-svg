#import "GlyphContext.h"
#import <React/RCTFont.h>
#import "RNSVGNode.h"
#import "PropHelper.h"
#import "FontData.h"
#import "RNSVGText.h"

@interface GlyphContext () {
@public
    NSMutableArray *mFontContext_;
    NSMutableArray *mXsContext_;
    NSMutableArray *mYsContext_;
    NSMutableArray *mDXsContext_;
    NSMutableArray *mDYsContext_;
    NSMutableArray *mRsContext_;
    NSMutableArray *mXIndices_;
    NSMutableArray *mYIndices_;
    NSMutableArray *mDXIndices_;
    NSMutableArray *mDYIndices_;
    NSMutableArray *mRIndices_;
    NSMutableArray *mXsIndices_;
    NSMutableArray *mYsIndices_;
    NSMutableArray *mDXsIndices_;
    NSMutableArray *mDYsIndices_;
    NSMutableArray *mRsIndices_;
    double mFontSize_;
    FontData *topFont_;
    double mX_;
    double mY_;
    double mDX_;
    double mDY_;
    NSArray *mXs_;
    NSArray *mYs_;
    NSArray *mDXs_;
    NSArray *mDYs_;
    NSArray *mRs_;
    long mXsIndex_;
    long mYsIndex_;
    long mDXsIndex_;
    long mDYsIndex_;
    long mRsIndex_;
    long mXIndex_;
    long mYIndex_;
    long mDXIndex_;
    long mDYIndex_;
    long mRIndex_;
    long mTop_;
    float mScale_;
    float mWidth_;
    float mHeight_;
}

- (void)pushIndices;

- (void)reset;

- (FontData *)getTopOrParentFontWithRNSVGGroup:(RNSVGGroup *)child;

- (void)pushNodeAndFontWithRNSVGGroup:(RNSVGGroup *)node
                     withNSDictionary:(NSDictionary *)font;

+ (void)incrementIndicesWithNSArray:(NSArray *)indices
                            withLong:(long)topIndex;

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

@implementation GlyphContext


- (CTFontRef)getGlyphFont
{
    NSString *fontFamily = topFont_->fontFamily;
    NSNumber * fontSize = [NSNumber numberWithDouble:topFont_->fontSize];
    NSString * fontWeight = topFont_->fontWeight_;
    NSString * fontStyle = topFont_->fontStyle_;

    BOOL fontFamilyFound = NO;
    NSArray *supportedFontFamilyNames = [UIFont familyNames];

    if ([supportedFontFamilyNames containsObject:fontFamily]) {
        fontFamilyFound = YES;
    } else {
        for (NSString *fontFamilyName in supportedFontFamilyNames) {
            if ([[UIFont fontNamesForFamilyName: fontFamilyName] containsObject:fontFamily]) {
                fontFamilyFound = YES;
                break;
            }
        }
    }
    fontFamily = fontFamilyFound ? fontFamily : nil;

    return (__bridge CTFontRef)[RCTFont updateFont:nil
                                        withFamily:fontFamily
                                              size:fontSize
                                            weight:fontWeight
                                             style:fontStyle
                                           variant:nil
                                   scaleMultiplier:1.0];
}

- (void)pushIndices {
    GlyphContext_pushIndices(self);
}

- (instancetype)initWithScale:(float)scale_
                        width:(float)width
                       height:(float)height {
    GlyphContext_initWithFloat_withFloat_withFloat_(self, scale_, width, height);
    return self;
}

- (void)reset {
    GlyphContext_reset(self);
}

- (FontData *)getFont {
    return topFont_;
}

- (FontData *)getTopOrParentFontWithRNSVGGroup:(RNSVGGroup*)child {
    return GlyphContext_getTopOrParentFontWithRNSVGGroup_(self, child);
}

- (void)pushNodeAndFontWithRNSVGGroup:(RNSVGGroup*)node
                     withNSDictionary:(NSDictionary*)font {
    GlyphContext_pushNodeAndFontWithRNSVGGroup_withNSDictionary_(self, node, font);
}

- (void)pushContextWithRNSVGGroup:(RNSVGGroup*)node
                             font:(NSDictionary*)font {
    GlyphContext_pushNodeAndFontWithRNSVGGroup_withNSDictionary_(self, node, font);
    GlyphContext_pushIndices(self);
}

- (void)pushContextwithRNSVGText:(RNSVGText*)node
                           reset:(bool)reset
                            font:(NSDictionary*)font
                               x:(NSArray*)x
                               y:(NSArray*)y
                          deltaX:(NSArray*)deltaX
                          deltaY:(NSArray*)deltaY
                          rotate:(NSArray*)rotate {
    if (reset) {
        GlyphContext_reset(self);
    }
    GlyphContext_pushNodeAndFontWithRNSVGGroup_withNSDictionary_(self, (RNSVGGroup*)node, font);
    if (x != nil && [x count] != 0) {
        mXsIndex_++;
        mXIndex_ = -1;
        [mXIndices_ addObject:[NSNumber numberWithLong:mXIndex_]];
        mXs_ = x;
        [mXsContext_ addObject:mXs_];
    }
    if (y != nil && [y count] != 0) {
        mYsIndex_++;
        mYIndex_ = -1;
        [mYIndices_ addObject:[NSNumber numberWithLong:mYIndex_]];
        mYs_ = y;
        [mYsContext_ addObject:mYs_];
    }
    if (deltaX != nil && [deltaX count] != 0) {
        mDXsIndex_++;
        mDXIndex_ = -1;
        [mDXIndices_ addObject:[NSNumber numberWithLong:mDXIndex_]];
        mDXs_ = deltaX;
        [mDXsContext_ addObject:mDXs_];
    }
    if (deltaY != nil && [deltaY count] != 0) {
        mDYsIndex_++;
        mDYIndex_ = -1;
        [mDYIndices_ addObject:[NSNumber numberWithLong:mDYIndex_]];
        mDYs_ = deltaY;
        [mDYsContext_ addObject:mDYs_];
    }
    if (rotate != nil && [rotate count] != 0) {
        mRsIndex_++;
        mRIndex_ = -1;
        [mRIndices_ addObject:[NSNumber numberWithLong:mRIndex_]];
        mRs_ = [rotate valueForKeyPath:@"self.doubleValue"];
        [mRsContext_ addObject:mRs_];
    }
    GlyphContext_pushIndices(self);
}

- (void)popContext {
    [mFontContext_ removeLastObject];
    [mXsIndices_  removeLastObject];
    [mYsIndices_  removeLastObject];
    [mDXsIndices_  removeLastObject];
    [mDYsIndices_  removeLastObject];
    [mRsIndices_  removeLastObject];
    mTop_--;
    long x = mXsIndex_;
    long y = mYsIndex_;
    long dx = mDXsIndex_;
    long dy = mDYsIndex_;
    long r = mRsIndex_;
    topFont_ = [mFontContext_ lastObject];
    mXsIndex_ = [[mXsIndices_ lastObject] longValue];
    mYsIndex_ = [[mYsIndices_ lastObject] longValue];
    mDXsIndex_ = [[mDXsIndices_ lastObject] longValue];
    mDYsIndex_ = [[mDYsIndices_ lastObject] longValue];
    mRsIndex_ = [[mRsIndices_ lastObject] longValue];
    if (x != mXsIndex_) {
        [mXsContext_ removeObjectAtIndex:x];
        mXs_ = [mXsContext_ objectAtIndex:mXsIndex_];
        mXIndex_ = [[mXIndices_ objectAtIndex:mXsIndex_] longValue];
    }
    if (y != mYsIndex_) {
        [mYsContext_ removeObjectAtIndex:y];
        mYs_ = [mYsContext_ objectAtIndex:mYsIndex_];
        mYIndex_ = [[mYIndices_ objectAtIndex:mYsIndex_] longValue];
    }
    if (dx != mDXsIndex_) {
        [mDXsContext_ removeObjectAtIndex:dx];
        mDXs_ = [mDXsContext_ objectAtIndex:mDXsIndex_];
        mDXIndex_ = [[mDXIndices_ objectAtIndex:mDXsIndex_] longValue];
    }
    if (dy != mDYsIndex_) {
        [mDYsContext_ removeObjectAtIndex:dy];
        mDYs_ = [mDYsContext_ objectAtIndex:mDYsIndex_];
        mDYIndex_ = [[mDYIndices_ objectAtIndex:mDYsIndex_] longValue];
    }
    if (r != mRsIndex_) {
        [mRsContext_ removeObjectAtIndex:r];
        mRs_ = [mRsContext_ objectAtIndex:mRsIndex_];
        mRIndex_ = [[mRIndices_ objectAtIndex:mRsIndex_] longValue];
    }
}

+ (void)incrementIndicesWithNSArray:(NSMutableArray *)indices
                            withLong:(long)topIndex {
    GlyphContext_incrementIndicesWithNSArray_withLong_(indices, topIndex);
}

- (double)getFontSize {
    return mFontSize_;
}

- (double)nextXWithDouble:(double)advance {
    GlyphContext_incrementIndicesWithNSArray_withLong_(mXIndices_, mXsIndex_);
    long nextIndex = mXIndex_ + 1;
    if (nextIndex < [mXs_ count]) {
        mDX_ = 0;
        mXIndex_ = nextIndex;
        NSString *string = [mXs_ objectAtIndex:nextIndex];
        mX_ = [PropHelper fromRelativeWithNSString:string
                                          relative:mWidth_
                                            offset:0
                                             scale:mScale_
                                          fontSize:mFontSize_];
    }
    mX_ += advance;
    return mX_;
}

- (double)nextY {
    GlyphContext_incrementIndicesWithNSArray_withLong_(mYIndices_, mYsIndex_);
    long nextIndex = mYIndex_ + 1;
    if (nextIndex < [mYs_ count]) {
        mDY_ = 0;
        mYIndex_ = nextIndex;
        NSString *string = [mYs_ objectAtIndex:nextIndex];
        mY_ = [PropHelper fromRelativeWithNSString:string
                                          relative:mHeight_
                                            offset:0
                                             scale:mScale_
                                          fontSize:mFontSize_];
    }
    return mY_;
}

- (double)nextDeltaX {
    GlyphContext_incrementIndicesWithNSArray_withLong_(mDXIndices_, mDXsIndex_);
    long nextIndex = mDXIndex_ + 1;
    if (nextIndex < [mDXs_ count]) {
        mDXIndex_ = nextIndex;
        NSString *string = [mDXs_ objectAtIndex:nextIndex];
        double val = [PropHelper fromRelativeWithNSString:string
                                                 relative:mWidth_
                                                   offset:0
                                                    scale:mScale_
                                                 fontSize:mFontSize_];
        mDX_ += val;
    }
    return mDX_;
}

- (double)nextDeltaY {
    GlyphContext_incrementIndicesWithNSArray_withLong_(mDYIndices_, mDYsIndex_);
    long nextIndex = mDYIndex_ + 1;
    if (nextIndex < [mDYs_ count]) {
        mDYIndex_ = nextIndex;
        NSString *string = [mDYs_ objectAtIndex:nextIndex];
        double val = [PropHelper fromRelativeWithNSString:string
                                                 relative:mHeight_
                                                   offset:0
                                                    scale:mScale_
                                                 fontSize:mFontSize_];
        mDY_ += val;
    }
    return mDY_;
}

- (NSNumber*)nextRotation {
    GlyphContext_incrementIndicesWithNSArray_withLong_(mRIndices_, mRsIndex_);
    long nextIndex = mRIndex_ + 1;
    long count = [mRs_ count];
    if (nextIndex < count) {
        mRIndex_ = nextIndex;
    } else {
        mRIndex_ = count - 1;
    }
    return mRs_[mRIndex_];
}

- (float)getWidth {
    return mWidth_;
}

- (float)getHeight {
    return mHeight_;
}

void GlyphContext_pushIndices(GlyphContext *self) {
    [self->mXsIndices_ addObject:[NSNumber numberWithLong:self->mXsIndex_]];
    [self->mYsIndices_ addObject:[NSNumber numberWithLong:self->mYsIndex_]];
    [self->mDXsIndices_ addObject:[NSNumber numberWithLong:self->mDXsIndex_]];
    [self->mDYsIndices_ addObject:[NSNumber numberWithLong:self->mDYsIndex_]];
    [self->mRsIndices_ addObject:[NSNumber numberWithLong:self->mRsIndex_]];
}

void GlyphContext_initWithFloat_withFloat_withFloat_(GlyphContext *self, float scale_, float width, float height) {
    self->mFontContext_ = [[NSMutableArray alloc]init];
    self->mXsContext_ = [[NSMutableArray alloc]init];
    self->mYsContext_ = [[NSMutableArray alloc]init];
    self->mDXsContext_ = [[NSMutableArray alloc]init];
    self->mDYsContext_ = [[NSMutableArray alloc]init];
    self->mRsContext_ = [[NSMutableArray alloc]init];
    self->mXIndices_ = [[NSMutableArray alloc]init];
    self->mYIndices_ = [[NSMutableArray alloc]init];
    self->mDXIndices_ = [[NSMutableArray alloc]init];
    self->mDYIndices_ = [[NSMutableArray alloc]init];
    self->mRIndices_ = [[NSMutableArray alloc]init];
    self->mXsIndices_ = [[NSMutableArray alloc]init];
    self->mYsIndices_ = [[NSMutableArray alloc]init];
    self->mDXsIndices_ = [[NSMutableArray alloc]init];
    self->mDYsIndices_ = [[NSMutableArray alloc]init];
    self->mRsIndices_ = [[NSMutableArray alloc]init];
    self->mFontSize_ = FontData_DEFAULT_FONT_SIZE;
    self->topFont_ = [FontData Defaults];
    self->mXs_ = [[NSArray alloc]init];
    self->mYs_ = [[NSArray alloc]init];
    self->mDXs_ = [[NSArray alloc]init];
    self->mDYs_ = [[NSArray alloc]init];
    self->mRs_ = [[NSArray alloc]initWithObjects:@0, nil];
    self->mXIndex_ = -1;
    self->mYIndex_ = -1;
    self->mDXIndex_ = -1;
    self->mDYIndex_ = -1;
    self->mRIndex_ = -1;
    self->mScale_ = scale_;
    self->mWidth_ = width;
    self->mHeight_ = height;
    [self->mXsContext_ addObject:self->mXs_];
    [self->mYsContext_ addObject:self->mYs_];
    [self->mDXsContext_ addObject:self->mDXs_];
    [self->mDYsContext_ addObject:self->mDYs_];
    [self->mRsContext_ addObject:self->mRs_];
    [self->mXIndices_ addObject:[NSNumber numberWithLong:self->mXIndex_]];
    [self->mYIndices_ addObject:[NSNumber numberWithLong:self->mYIndex_]];
    [self->mDXIndices_ addObject:[NSNumber numberWithLong:self->mDXIndex_]];
    [self->mDYIndices_ addObject:[NSNumber numberWithLong:self->mDYIndex_]];
    [self->mRIndices_ addObject:[NSNumber numberWithLong:self->mRIndex_]];
    [self->mFontContext_ addObject:self->topFont_];
    GlyphContext_pushIndices(self);
}

void GlyphContext_reset(GlyphContext *self) {
    self->mXsIndex_ = self->mYsIndex_ = self->mDXsIndex_ = self->mDYsIndex_ = self->mRsIndex_ = 0;
    self->mXIndex_ = self->mYIndex_ = self->mDXIndex_ = self->mDYIndex_ = self->mRIndex_ = -1;
    self->mX_ = self->mY_ = self->mDX_ = self->mDY_ = 0;
}

FontData *GlyphContext_getTopOrParentFontWithRNSVGGroup_(GlyphContext *self, RNSVGGroup* child) {
    if (self->mTop_ > 0) {
        return self->topFont_;
    }
    else {
        RNSVGGroup* parentRoot = [child getParentTextRoot];
        FontData* Defaults = [FontData Defaults];
        while (parentRoot != nil) {
            FontData *map = [[parentRoot getGlyphContext] getFont];
            if (map != Defaults) {
                return map;
            }
            parentRoot = [parentRoot getParentTextRoot];
        }
        return Defaults;
    }
}

void GlyphContext_pushNodeAndFontWithRNSVGGroup_withNSDictionary_(GlyphContext *self, RNSVGGroup* node, NSDictionary* font) {
    FontData *parent = GlyphContext_getTopOrParentFontWithRNSVGGroup_(self, node);
    self->mTop_++;
    if (font == nil) {
        [self->mFontContext_ addObject:parent];
        return;
    }
    FontData *data = [FontData initWithNSDictionary:font
                                             parent:parent
                                              scale:self->mScale_];
    self->mFontSize_ = data->fontSize;
    [self->mFontContext_ addObject:data];
    self->topFont_ = data;
}

void GlyphContext_incrementIndicesWithNSArray_withLong_(NSMutableArray *indices, long topIndex) {
    for (long index = topIndex; index >= 0; index--) {
        long xIndex = [[indices  objectAtIndex:index] longValue];
        [indices setObject:[NSNumber numberWithLong:xIndex + 1] atIndexedSubscript:index];
    }
}
@end
