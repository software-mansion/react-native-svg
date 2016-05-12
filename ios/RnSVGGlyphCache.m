/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGGlyphCache.h"

@implementation RNSVGGlyphCache

-(id)init
{
    self = [super init];
    if(self != nil)
    {
        cache = CFDictionaryCreateMutable(kCFAllocatorDefault, 0, NULL, &kCFTypeDictionaryValueCallBacks);
    }
    return self;
}

-(void)dealloc
{
    CFRelease(cache);
}

-(CGPathRef)pathForGlyph:(CGGlyph)glyph fromFont:(CTFontRef)font
{
    // First we lookup the font to get to its glyph dictionary
    CFMutableDictionaryRef glyphDict = (CFMutableDictionaryRef)CFDictionaryGetValue(cache, font);
    if(glyphDict == NULL)
    {
        // And if this font hasn't been seen before, we'll create and set the dictionary for it
        glyphDict = CFDictionaryCreateMutable(kCFAllocatorDefault, 0, NULL, &kCFTypeDictionaryValueCallBacks);
        CFDictionarySetValue(cache, font, glyphDict);
        CFRelease(glyphDict);
    }
    // Next we try to get a path for the given glyph from the glyph dictionary
    CGPathRef path = (CGPathRef)CFDictionaryGetValue(glyphDict, (const void *)(uintptr_t)glyph);
    if(path == NULL)
    {
        // If the path hasn't been seen before, then we'll create the path from the font & glyph and cache it.
        path = CTFontCreatePathForGlyph(font, glyph, NULL);
        if(path == NULL)
        {
            // If a glyph does not have a path, then we need a placeholder to set in the dictionary
            path = (CGPathRef)kCFNull;
        }
        CFDictionarySetValue(glyphDict, (const void *)(uintptr_t)glyph, path);
        CFRelease(path);
    }
    if(path == (CGPathRef)kCFNull)
    {
        // If we got the placeholder, then set the path to NULL
        // (this will happen either after discovering the glyph path is NULL,
        // or after looking that up in the dictionary).
        path = NULL;
    }
    return path;
}

@end