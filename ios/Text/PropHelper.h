#import <Foundation/Foundation.h>
#import <QuartzCore/QuartzCore.h>

#if !defined (PropHelper_)
#define PropHelper_
@interface PropHelper : NSObject

+ (double) fromRelativeWithNSString:(NSString *)length
                           relative:(double)relative
                             offset:(double)offset
                              scale:(double)scale
                           fontSize:(double)fontSize;

@end
#endif
