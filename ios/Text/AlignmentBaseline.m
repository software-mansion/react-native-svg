#import "AlignmentBaseline.h"

NSString* AlignmentBaselineToString( enum AlignmentBaseline fw )
{
    return AlignmentBaselineStrings[fw];
}

enum AlignmentBaseline AlignmentBaselineFromString( NSString* s )
{
    NSInteger i;
    NSString* fw;
    for (i = 0; fw = AlignmentBaselineStrings[i], fw != nil; i++) {
        if ([fw isEqualToString:s]) {
            return i;
        }
    }
    return AlignmentBaselineDEFAULT;
}
