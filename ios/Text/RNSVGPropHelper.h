#import <Foundation/Foundation.h>
#import <QuartzCore/QuartzCore.h>
#import "RNSVGLength.h"

#ifndef RNSVGPropHelper_h
#define RNSVGPropHelper_h

@interface RNSVGPropHelper : NSObject

+ (double) fromRelativeWithNSString:(NSString *)length
                           relative:(double)relative
                             offset:(double)offset
                              scale:(double)scale
                           fontSize:(double)fontSize;

+ (double) fromRelative:(RNSVGLength*)length
               relative:(double)relative
               fontSize:(double)fontSize;

+ (double)fromRelative:(RNSVGLength*)length
              relative:(double)relative;
@end

#endif
