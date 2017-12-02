//
//  UIBezierPath+NSOSX_Private.h
//  PerformanceBezier
//
//  Created by Adam Wulf on 10/9/12.
//  Copyright (c) 2012 Milestone Made, LLC. All rights reserved.
//

#ifndef PerformanceBezier_UIBezierPath_NSOSX_Private_h
#define PerformanceBezier_UIBezierPath_NSOSX_Private_h


@interface UIBezierPath (NSOSX_Private)

// cache of path elements
@property(nonatomic,retain) NSMutableArray* elementCacheArray;

// cache of element count
@property(nonatomic,assign) NSInteger cachedElementCount;

// helper functions to prime the above caches
void countPathElement(void* info, const CGPathElement* element);

void updatePathElementAtIndex(void* info, const CGPathElement* element);

@end


#endif
