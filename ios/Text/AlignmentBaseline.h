#ifndef AlignmentBaseline_h
#define AlignmentBaseline_h

#import <Foundation/Foundation.h>

NS_ENUM(NSInteger, AlignmentBaseline) {
    AlignmentBaselineBaseline,
    AlignmentBaselineTextBottom,
    AlignmentBaselineAlphabetic,
    AlignmentBaselineIdeographic,
    AlignmentBaselineMiddle,
    AlignmentBaselineCentral,
    AlignmentBaselineMathematical,
    AlignmentBaselineTextTop,
    AlignmentBaselineBottom,
    AlignmentBaselineCenter,
    AlignmentBaselineTop,
    /*
     SVG implementations may support the following aliases in order to support legacy content:
     
     text-before-edge = text-top
     text-after-edge = text-bottom
     */
    AlignmentBaselineTextBeforeEdge,
    AlignmentBaselineTextAfterEdge,
    // SVG 1.1
    AlignmentBaselineBeforeEdge,
    AlignmentBaselineAfterEdge,
    AlignmentBaselineHanging,
    AlignmentBaselineDEFAULT = AlignmentBaselineBaseline
};

static NSString* const AlignmentBaselineStrings[] = {
    @"baseline",
    @"text-bottom",
    @"alphabetic",
    @"ideographic",
    @"middle",
    @"central",
    @"mathematical",
    @"text-top",
    @"bottom",
    @"center",
    @"top",
    @"text-before-edge",
    @"text-after-edge",
    @"before-edge",
    @"after-edge",
    @"hanging",
    @"central",
    @"mathematical",
    @"text-top",
    @"bottom",
    @"center",
    @"top",
    nil
};

NSString* AlignmentBaselineToString( enum AlignmentBaseline fw );

enum AlignmentBaseline AlignmentBaselineFromString( NSString* s );

#endif /* AlignmentBaseline_h */
