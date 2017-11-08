#import "AlignmentBaseline.h"

NSString* AlignmentBaselineToString( enum AlignmentBaseline fw )
{
    return AlignmentBaselineStrings[fw];
}

enum AlignmentBaseline AlignmentBaselineFromString( NSString* s )
{
    const NSUInteger l = sizeof(AlignmentBaselineStrings) / sizeof(NSString*);
    for (NSUInteger i = 0; i < l; i++) {
        if ([s isEqualToString:AlignmentBaselineStrings[i]]) {
            return i;
        }
    }
    return AlignmentBaselineDEFAULT;
}
