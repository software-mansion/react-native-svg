/*
 
 Erica Sadun, http://ericasadun.com
 
 */

#import <UIKit/UIKit.h>
#import <QuartzCore/QuartzCore.h>

#import "BaseGeometry.h"
#import "Drawing-Block.h"
#import "Drawing-Util.h"
#import "Drawing-Gradient.h"
#import "Bezier.h"
#import "ImageUtils.h"
#import "UIBezierPath+Text.h"
#import "Drawing-Text.h"

#define BARBUTTON(TITLE, SELECTOR) [[UIBarButtonItem alloc] initWithTitle:TITLE style:UIBarButtonItemStylePlain target:self action:SELECTOR]
#define RGBCOLOR(_R_, _G_, _B_) [UIColor colorWithRed:(CGFloat)(_R_)/255.0f green: (CGFloat)(_G_)/255.0f blue: (CGFloat)(_B_)/255.0f alpha: 1.0f]

#define OLIVE RGBCOLOR(125, 162, 63)
#define LIGHTPURPLE RGBCOLOR(99, 62, 162)
#define DARKGREEN RGBCOLOR(40, 55, 32)

// Bail with complaint
#define COMPLAIN_AND_BAIL(_COMPLAINT_, _ARG_) {NSLog(_COMPLAINT_, _ARG_); return;}
#define COMPLAIN_AND_BAIL_NIL(_COMPLAINT_, _ARG_) {NSLog(_COMPLAINT_, _ARG_); return nil;}

#define SEED_RANDOM     {static BOOL seeded = NO; if (!seeded) {seeded = YES; srandom((unsigned int) time(0));}}
#define RANDOM(_X_)     (NSInteger)(random() % _X_)
#define RANDOM_01       ((double) random() / (double) LONG_MAX)
#define RANDOM_BOOL     (BOOL)((NSInteger)random() % 2)
#define RANDOM_PT(_RECT_) CGPointMake(_RECT_.origin.x + RANDOM_01 * _RECT_.size.width, _RECT_.origin.y + RANDOM_01 * _RECT_.size.height)

UIBezierPath *BuildBunnyPath();
UIBezierPath *BuildMoofPath();
UIBezierPath *BuildStarPath();

UIColor *NoiseColor();

@interface NSString (Utility)
+ (NSString *) lorem: (NSUInteger) numberOfParagraphs;
+ (NSString *) loremWords: (NSUInteger) numberOfWords;
@end

#define DEBUG_IMAGE(_IMAGE_, _NAME_) [UIImagePNGRepresentation(_IMAGE_) writeToFile:[NSString stringWithFormat:@"/Users/ericasadun/Desktop/%@.png", _NAME_] atomically:YES]

