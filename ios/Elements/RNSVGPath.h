/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>
#import "RNSVGPathParser.h"
#import "RNSVGRenderable.h"

@interface RNSVGPath : RNSVGRenderable

@property (nonatomic, strong) RNSVGPathParser *d;

- (void)getPathLength:(CGFloat*)length lineCount:(NSInteger*)lineCount lengths:(NSArray* __strong *)lengths lines:(NSArray* __strong *)lines isClosed:(BOOL*)isClosed;

@end
