/*
 
 Erica Sadun, http://ericasadun.com
 
 Gathered for book examples
 
 */

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>

// 4 bytes per ARGB pixel, 8 bits per byte
#define ARGB_COUNT 4
#define BITS_PER_COMPONENT  8

UIEdgeInsets BuildInsets(CGRect alignmentRect, CGRect imageBounds);

UIImage *BuildSwatchWithColor(UIColor *color, CGFloat side);
UIImage *BuildThumbnail(UIImage *sourceImage, CGSize targetSize, BOOL useFitting);
UIImage *ExtractRectFromImage(UIImage *sourceImage, CGRect subRect);
UIImage *ExtractSubimageFromRect(UIImage *sourceImage, CGRect rect);

UIImage *GrayscaleVersionOfImage(UIImage *sourceImage);
UIImage *InvertImage(UIImage *sourceImage);

NSData  *BytesFromRGBImage(UIImage *sourceImage);
UIImage *ImageFromRGBBytes(NSData *data, CGSize targetSize);

void FlipContextVertically(CGSize size);
void FlipContextHorizontally(CGSize size);
void FlipImageContextVertically();
void FlipImageContextHorizontally();
void RotateContext(CGSize size, CGFloat theta);
void MoveContextByVector(CGPoint vector);

UIImage *ImageMirroredVertically(UIImage *image);

void DrawPDFPageInRect(CGPDFPageRef pageRef, CGRect destinationRect);

UIImage *GaussianBlurImage(UIImage *image, CGFloat radius);
