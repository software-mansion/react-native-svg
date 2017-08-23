/*
 
 Erica Sadun, http://ericasadun.com
 
 */

#import "Drawing-Text.h"
#import "Utility.h"

#pragma mark - Drawing

void DrawStringInRect(NSString *string, CGRect rect, UIFont *font, NSTextAlignment alignment, UIColor *color)
{
    CGContextRef context = UIGraphicsGetCurrentContext();
    if (context == NULL) return;
    
    NSRange range = NSMakeRange(0, string.length);
    NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc] initWithString:string];
    
    NSMutableDictionary *attributes = [NSMutableDictionary dictionary];
    NSMutableParagraphStyle *style = [[NSParagraphStyle defaultParagraphStyle] mutableCopy];
    style.alignment = alignment;
    style.lineBreakMode = NSLineBreakByWordWrapping;
    attributes[NSFontAttributeName] = font;
    attributes[NSForegroundColorAttributeName] = color;
    attributes[NSParagraphStyleAttributeName] = style;
    [attributedString addAttributes:attributes range:range];
    
    CGRect destRect = [string boundingRectWithSize:CGSizeMake(rect.size.width, CGFLOAT_MAX) options:NSStringDrawingUsesLineFragmentOrigin attributes:attributes context:nil];
    CGRect outputRect = RectCenteredInRect(destRect, rect);
    [attributedString drawInRect:outputRect];
}

#pragma mark - Unwrapped
UIFont *FontForUnwrappedString(NSString *string, NSString *fontFace, CGRect rect)
{
    CGFloat fontSize = 1;
    UIFont *font = [UIFont fontWithName:fontFace size:fontSize];
    CGSize destSize = [string sizeWithAttributes:@{NSFontAttributeName:font}];
    
    while ((destSize.width < rect.size.width) && (destSize.height < rect.size.height))
    {
        fontSize++;
        UIFont *proposedFont = [UIFont fontWithName:fontFace size:fontSize];
        destSize = [string sizeWithAttributes:@{NSFontAttributeName:proposedFont}];
        if ((destSize.height > rect.size.height) || (destSize.width > rect.size.width))
            return font;
        
        font = proposedFont;
    }
    
    return font;
}

void DrawUnwrappedStringInRect(NSString *string, CGRect rect, NSString *fontFace, NSTextAlignment alignment, UIColor *color)
{
    UIFont *font = FontForUnwrappedString(string, fontFace, rect);
    DrawStringInRect(string, rect, font, alignment, color);
}

void DrawStringCenteredInRect(NSString *string, UIFont *font, CGRect rect)
{
    CGContextRef context = UIGraphicsGetCurrentContext();
    if (context == NULL) COMPLAIN_AND_BAIL(@"No context to draw into", nil);
    
    // Calculate string size
    CGSize stringSize = [string sizeWithAttributes:@{NSFontAttributeName:font}];
    
    // Find the target rectangle
    CGRect target = RectAroundCenter(RectGetCenter(rect), stringSize);
    
    // Draw the string
    [string drawInRect:target withAttributes:@{NSFontAttributeName:font}];
}


#pragma mark - Wrapping

UIFont *FontForWrappedString(NSString *string, NSString *fontFace, CGRect rect, CGFloat tolerance)
{
    if (rect.size.height < 1.0f) return nil;
    
    CGFloat adjustedWidth = tolerance * rect.size.width;
    CGSize measureSize = CGSizeMake(adjustedWidth, CGFLOAT_MAX);
    
    // Initialize the proposed font
    CGFloat fontSize = 1;
    UIFont *proposedFont = [UIFont fontWithName:fontFace size:fontSize];
    
    NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];
    paragraphStyle.lineBreakMode = NSLineBreakByWordWrapping;
    
    NSMutableDictionary *attributes = [NSMutableDictionary dictionary];
    attributes[NSParagraphStyleAttributeName] = paragraphStyle;
    attributes[NSFontAttributeName] = proposedFont;
    
    // Measure the target
    CGSize targetSize = [string boundingRectWithSize:measureSize options:NSStringDrawingUsesLineFragmentOrigin attributes:attributes context:nil].size;
    
    // Double until the size is exceeded
    while (targetSize.height <= rect.size.height)
    {
        // Establish a new proposed font
        fontSize *= 2;
        proposedFont = [UIFont fontWithName:fontFace size:fontSize];
        
        // Measure the target
        attributes[NSFontAttributeName] = proposedFont;
        targetSize = [string boundingRectWithSize:measureSize options:NSStringDrawingUsesLineFragmentOrigin attributes:attributes context:nil].size;
        
        // Break when the calculated height is too much
        if (targetSize.height > rect.size.height)
            break;
    }
    
    // Search between the previous and current font sizes
    CGFloat minFontSize = fontSize / 2;
    CGFloat maxFontSize = fontSize;
    while (1)
    {
        // Get the midpoint between the two
        CGFloat midPoint = (minFontSize + (maxFontSize - minFontSize) / 2);
        proposedFont = [UIFont fontWithName:fontFace size:midPoint];
        attributes[NSFontAttributeName] = proposedFont;
        targetSize = [string boundingRectWithSize:measureSize options:NSStringDrawingUsesLineFragmentOrigin attributes:attributes context:nil].size;
        
        // Look up one font size
        UIFont *nextFont = [UIFont fontWithName:fontFace size:midPoint + 1];
        attributes[NSFontAttributeName] = nextFont;
        CGSize nextTargetSize = [string boundingRectWithSize:measureSize options:NSStringDrawingUsesLineFragmentOrigin attributes:attributes context:nil].size;;
        
        // Test both fonts
        CGFloat tooBig = targetSize.height > rect.size.height;
        CGFloat nextIsTooBig = nextTargetSize.height > rect.size.height;
        
        // If the current is sized right but the next is too big, win
        if (!tooBig && nextIsTooBig)
            return [UIFont fontWithName:fontFace size:midPoint];
        
        // Adjust the search space
        if (tooBig)
            maxFontSize = midPoint;
        else
            minFontSize = midPoint;
    }
    
    // Should never get here
    return [UIFont fontWithName:fontFace size:fontSize / 2];
}

CGSize AttributedStringSize(NSAttributedString *string, CGSize constrainedSize)
{
    return [string boundingRectWithSize:constrainedSize options:NSStringDrawingUsesLineFragmentOrigin context:nil].size;
}

void DrawWrappedStringInRect(NSString *string, CGRect rect, NSString *fontFace, NSTextAlignment alignment, UIColor *color)
{
    
    UIFont *font = FontForWrappedString(string, fontFace, rect, 0.95);
     
    NSMutableAttributedString *s = [[NSMutableAttributedString alloc] initWithString:string];
    NSRange r = NSMakeRange(0, string.length);
    [s addAttribute:NSFontAttributeName value:font range:r];
    [s addAttribute:NSForegroundColorAttributeName value:color range:r];
    NSMutableParagraphStyle *p = [NSParagraphStyle defaultParagraphStyle].mutableCopy;
    p.hyphenationFactor = 0.25f;
    p.alignment = alignment;
    [s addAttribute:NSParagraphStyleAttributeName value:p range:r];
    
    CGRect stringBounds = SizeMakeRect(AttributedStringSize(s, rect.size));
    stringBounds.size.width = fminf(rect.size.width, stringBounds.size.width);
    CGRect dest = RectCenteredInRect(stringBounds, rect);
    dest.size.height = CGFLOAT_MAX;
    [s drawInRect:dest];
}