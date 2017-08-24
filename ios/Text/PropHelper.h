#import <Foundation/Foundation.h>
#import <QuartzCore/QuartzCore.h>

#ifndef PropHelper_h
#define PropHelper_h

@interface PropHelper : NSObject

+ (double) fromRelativeWithNSString:(NSString *)length
                           relative:(double)relative
                             offset:(double)offset
                              scale:(double)scale
                           fontSize:(double)fontSize;

@end

#endif
