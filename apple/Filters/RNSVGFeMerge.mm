#import "RNSVGFeMerge.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/rnsvg/ComponentDescriptors.h>
#import <react/renderer/components/view/conversions.h>
#import "RNSVGFabricConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSVGFeMerge

#ifdef RCT_NEW_ARCH_ENABLED
using namespace facebook::react;

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGFeMergeProps>();
    _props = defaultProps;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGFeMergeComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = static_cast<const RNSVGFeMergeProps &>(*props);

  if (newProps.nodes.size() > 0) {
    NSMutableArray<NSString *> *nodesArray = [NSMutableArray new];
    for (auto node : newProps.nodes) {
      [nodesArray addObject:[NSString stringWithCString:node.c_str() encoding:NSUTF8StringEncoding]];
    }
    self.nodes = nodesArray;
  }
  setCommonFilterProps(newProps, self);
  _props = std::static_pointer_cast<RNSVGFeMergeProps const>(props);
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _nodes = nil;
}
#endif // RCT_NEW_ARCH_ENABLED

- (void)setNodes:(NSArray<NSString *> *)nodes
{
  if (nodes == _nodes) {
    return;
  }

  _nodes = nodes;
  [self invalidate];
}

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results
    previousFilterResult:(CIImage *)previous
                     ctm:(CGAffineTransform)ctm
{
  CIFilter *filter = [CIFilter filterWithName:@"CISourceOverCompositing"];
  [filter setDefaults];

  CIImage *result;

  for (int i = 0; i < [self.nodes count]; i++) {
    NSString *nodeKey = [self.nodes objectAtIndex:i];
    CIImage *inputImage = [nodeKey isEqual:@""] ? previous : [results objectForKey:nodeKey];
    if (inputImage == nil) {
      continue;
    }
    if (result == nil) {
      result = inputImage;
      continue;
    }
    [filter setValue:result forKey:@"inputBackgroundImage"];
    [filter setValue:inputImage forKey:@"inputImage"];

    result = [filter valueForKey:@"outputImage"];
  }
  return result;
}

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSVGFeMergeCls(void)
{
  return RNSVGFeMerge.class;
}
#endif // RCT_NEW_ARCH_ENABLED

@end
