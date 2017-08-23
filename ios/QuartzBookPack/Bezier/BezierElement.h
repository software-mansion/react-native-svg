/*
 
 Erica Sadun, http://ericasadun.com
 
 */


#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>

// Block for transforming points
typedef CGPoint (^PathBlock)(CGPoint point);

@interface BezierElement : NSObject <NSCopying>

// Element storage
@property (nonatomic, assign) CGPathElementType elementType;
@property (nonatomic, assign) CGPoint point;
@property (nonatomic, assign) CGPoint controlPoint1;
@property (nonatomic, assign) CGPoint controlPoint2;

// Instance creation
+ (instancetype) elementWithPathElement: (CGPathElement) element;

// Applying transformations
- (BezierElement *) elementByApplyingBlock: (PathBlock) block;

// Adding to path
- (void) addToPath: (UIBezierPath *) path;

// Readable forms
@property (nonatomic, readonly) NSString *stringValue;
- (void) showTheCode;
@end;
