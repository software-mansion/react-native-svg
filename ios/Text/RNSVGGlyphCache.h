/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This implements a very simple glyph cache.
// It maps from CTFontRef to CGGlyph to CGPathRef in order to reuse glyphs.
// It does NOT try to retain the keys that are used (CTFontRef or CGGlyph)
// but that is not an issue with respect to how it is used by this sample.

#import <Foundation/Foundation.h>
#import <CoreText/CoreText.h>
#import "RNSVGRenderable.h"

@interface RNSVGGlyphCache : NSObject
{
    CFMutableDictionaryRef cache;
}

- (id)init;
- (CGPathRef)pathForGlyph:(CGGlyph)glyph fromFont:(CTFontRef)font;


@end