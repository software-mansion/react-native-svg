//
//  UIBezierPath+TextRendering.h
//  RNSVG
//
//  Created by Mikael Sand on 27/12/2017.
//

#import <UIKit/UIKit.h>

@interface UIBezierPath (TextRendering)
- (void (^)(CGFloat *lengthP, NSInteger *lineCountP, NSMutableArray * lengthsP, NSMutableArray * linesP, BOOL *isClosedP)) getTextProperties;
@end
