#import "RNSVGFeColorMatrixManager.h"
#import "RNSVGColorMatrixType.h"
#import "RNSVGFeColorMatrix.h"

@implementation RNSVGFeColorMatrixManager

RCT_EXPORT_MODULE()

- (RNSVGFeColorMatrix *)node
{
  return [RNSVGFeColorMatrix new];
}

RCT_EXPORT_VIEW_PROPERTY(in1, NSString)
RCT_EXPORT_VIEW_PROPERTY(type, RNSVGColorMatrixType)
RCT_EXPORT_VIEW_PROPERTY(values, NSArray<NSNumber *>)

@end
