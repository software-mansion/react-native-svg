#import "RNSVGContextBrush.h"
#import "RNSVGFilterPrimitive.h"
#import "RNSVGGroup.h"
#import "RNSVGLength.h"
#import "RNSVGPainterBrush.h"
#import "RNSVGRenderable.h"
#import "RNSVGSolidColorBrush.h"
#import "RNSVGText.h"
#import "RNSVGVBMOS.h"

#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>

#import <folly/dynamic.h>

// copied from RCTFollyConvert
static id RNSVGConvertFollyDynamicToId(const folly::dynamic &dyn)
{
  // I could imagine an implementation which avoids copies by wrapping the
  // dynamic in a derived class of NSDictionary.  We can do that if profiling
  // implies it will help.

  switch (dyn.type()) {
    case folly::dynamic::NULLT:
      return nil;
    case folly::dynamic::BOOL:
      return dyn.getBool() ? @YES : @NO;
    case folly::dynamic::INT64:
      return @(dyn.getInt());
    case folly::dynamic::DOUBLE:
      return @(dyn.getDouble());
    case folly::dynamic::STRING:
      return [[NSString alloc] initWithBytes:dyn.c_str() length:dyn.size() encoding:NSUTF8StringEncoding];
    case folly::dynamic::ARRAY: {
      NSMutableArray *array = [[NSMutableArray alloc] initWithCapacity:dyn.size()];
      for (const auto &elem : dyn) {
        id value = RNSVGConvertFollyDynamicToId(elem);
        if (value) {
          [array addObject:value];
        }
      }
      return array;
    }
    case folly::dynamic::OBJECT: {
      NSMutableDictionary *dict = [[NSMutableDictionary alloc] initWithCapacity:dyn.size()];
      for (const auto &elem : dyn.items()) {
        id key = RNSVGConvertFollyDynamicToId(elem.first);
        id value = RNSVGConvertFollyDynamicToId(elem.second);
        if (key && value) {
          dict[key] = value;
        }
      }
      return dict;
    }
  }
}

template <typename T>
void setCommonNodeProps(const T &nodeProps, RNSVGNode *node)
{
  node.name = RCTNSStringFromStringNilIfEmpty(nodeProps.name);
  node.opacity = nodeProps.opacity;
  if (nodeProps.matrix.size() == 6) {
    node.matrix = CGAffineTransformMake(
        nodeProps.matrix.at(0),
        nodeProps.matrix.at(1),
        nodeProps.matrix.at(2),
        nodeProps.matrix.at(3),
        nodeProps.matrix.at(4),
        nodeProps.matrix.at(5));
  }
  CATransform3D transform3d = RCTCATransform3DFromTransformMatrix(nodeProps.transform);
  CGAffineTransform transform = CATransform3DGetAffineTransform(transform3d);
  node.invTransform = CGAffineTransformInvert(transform);
  node.transforms = transform;
  node.mask = RCTNSStringFromStringNilIfEmpty(nodeProps.mask);
  node.markerStart = RCTNSStringFromStringNilIfEmpty(nodeProps.markerStart);
  node.markerMid = RCTNSStringFromStringNilIfEmpty(nodeProps.markerMid);
  node.markerEnd = RCTNSStringFromStringNilIfEmpty(nodeProps.markerEnd);
  node.clipPath = RCTNSStringFromStringNilIfEmpty(nodeProps.clipPath);
  node.clipRule = nodeProps.clipRule == 0 ? kRNSVGCGFCRuleEvenodd : kRNSVGCGFCRuleNonzero;
  node.responsible = nodeProps.responsible;
  // onLayout
  node.display = RCTNSStringFromStringNilIfEmpty(nodeProps.display);
  std::string pointerEvents = nodeProps.pointerEvents;
  NSString *pointerEventsString = RCTNSStringFromStringNilIfEmpty(pointerEvents);
  if ([pointerEventsString isEqualToString:@"auto"]) {
    node.pointerEvents = RCTPointerEventsUnspecified;
  } else if ([pointerEventsString isEqualToString:@"none"]) {
    node.pointerEvents = RCTPointerEventsNone;
  } else if ([pointerEventsString isEqualToString:@"box-none"]) {
    node.pointerEvents = RCTPointerEventsNone;
  } else if ([pointerEventsString isEqualToString:@"box-only"]) {
    node.pointerEvents = RCTPointerEventsNone;
  } else {
    node.pointerEvents = RCTPointerEventsUnspecified;
  }
  node.accessibilityIdentifier = RCTNSStringFromStringNilIfEmpty(nodeProps.testId);
#if !TARGET_OS_OSX
  node.isAccessibilityElement = nodeProps.accessible;
#else
  node.accessibilityElement = nodeProps.accessible;
#endif // !TARGET_OS_OSX
  node.accessibilityLabel = RCTNSStringFromStringNilIfEmpty(nodeProps.accessibilityLabel);
}

template <typename T>
void setCommonRenderableProps(const T &renderableProps, RNSVGRenderable *renderableNode)
{
  setCommonNodeProps(renderableProps, renderableNode);
  if (RCTUIColorFromSharedColor(renderableProps.color)) {
    [renderableNode setColor:RCTUIColorFromSharedColor(renderableProps.color)];
  }
  id fill = RNSVGConvertFollyDynamicToId(renderableProps.fill);
  if (fill != nil) {
    renderableNode.fill = [RCTConvert RNSVGBrush:fill];
  }
  renderableNode.fillOpacity = renderableProps.fillOpacity;
  renderableNode.fillRule = renderableProps.fillRule == 0 ? kRNSVGCGFCRuleEvenodd : kRNSVGCGFCRuleNonzero;
  id stroke = RNSVGConvertFollyDynamicToId(renderableProps.stroke);
  if (stroke != nil) {
    renderableNode.stroke = [RCTConvert RNSVGBrush:stroke];
  }
  renderableNode.strokeOpacity = renderableProps.strokeOpacity;
  id strokeWidth = RNSVGConvertFollyDynamicToId(renderableProps.strokeWidth);
  if (strokeWidth != nil) {
    renderableNode.strokeWidth = [RCTConvert RNSVGLength:strokeWidth];
  }
  renderableNode.strokeLinecap = renderableProps.strokeLinecap == 0 ? kCGLineCapButt
      : renderableProps.strokeLinecap == 1                          ? kCGLineCapRound
                                                                    : kCGLineCapSquare;
  renderableNode.strokeLinejoin = renderableProps.strokeLinejoin == 0 ? kCGLineJoinMiter
      : renderableProps.strokeLinejoin == 1                           ? kCGLineJoinRound
                                                                      : kCGLineJoinBevel;
  id strokeDasharray = RNSVGConvertFollyDynamicToId(renderableProps.strokeDasharray);
  if (strokeDasharray != nil) {
    renderableNode.strokeDasharray = [RCTConvert RNSVGLengthArray:strokeDasharray];
  }
  renderableNode.strokeDashoffset = renderableProps.strokeDashoffset;
  renderableNode.strokeMiterlimit = renderableProps.strokeMiterlimit;
  renderableNode.vectorEffect = renderableProps.vectorEffect == 0 ? kRNSVGVectorEffectDefault
      : renderableProps.vectorEffect == 1                         ? kRNSVGVectorEffectNonScalingStroke
      : renderableProps.vectorEffect == 2                         ? kRNSVGVectorEffectInherit
                                                                  : kRNSVGVectorEffectUri;
  if (renderableProps.propList.size() > 0) {
    NSMutableArray<NSString *> *propArray = [NSMutableArray new];
    for (auto str : renderableProps.propList) {
      [propArray addObject:RCTNSStringFromString(str)];
    }
    renderableNode.propList = propArray;
  }
  renderableNode.filter = RCTNSStringFromStringNilIfEmpty(renderableProps.filter);
}

template <typename T>
void setCommonGroupProps(const T &groupProps, RNSVGGroup *groupNode)
{
  setCommonRenderableProps(groupProps, groupNode);

  id fontSize = RNSVGConvertFollyDynamicToId(groupProps.fontSize);
  if (fontSize != nil) {
    groupNode.font = @{@"fontSize" : fontSize};
  }
  id fontWeight = RNSVGConvertFollyDynamicToId(groupProps.fontWeight);
  if (fontWeight != nil) {
    groupNode.font = @{@"fontWeight" : fontWeight};
  }
  id font = RNSVGConvertFollyDynamicToId(groupProps.font);
  if (font != nil) {
    NSDictionary *fontDict = (NSDictionary *)font;
    if (groupNode.font == nil || fontDict.count > 0) {
      // some of text's rendering logic requires that `font` is not nil so we always set it
      // even if to an empty dict
      groupNode.font = fontDict;
    }
  }
}

template <typename T>
void setCommonFilterProps(const T &filterProps, RNSVGFilterPrimitive *filterPrimitiveNode)
{
  id x = RNSVGConvertFollyDynamicToId(filterProps.x);
  if (x != nil) {
    filterPrimitiveNode.x = [RCTConvert RNSVGLength:x];
  }
  id y = RNSVGConvertFollyDynamicToId(filterProps.y);
  if (y != nil) {
    filterPrimitiveNode.y = [RCTConvert RNSVGLength:y];
  }
  id height = RNSVGConvertFollyDynamicToId(filterProps.height);
  if (height != nil) {
    filterPrimitiveNode.height = [RCTConvert RNSVGLength:height];
  }
  id width = RNSVGConvertFollyDynamicToId(filterProps.width);
  if (width != nil) {
    filterPrimitiveNode.width = [RCTConvert RNSVGLength:width];
  }
  filterPrimitiveNode.result = RCTNSStringFromStringNilIfEmpty(filterProps.result);
}

template <typename T>
void setCommonTextProps(const T &textProps, RNSVGText *textNode)
{
  setCommonGroupProps(textProps, textNode);
  id deltaX = RNSVGConvertFollyDynamicToId(textProps.dx);
  if (deltaX != nil) {
    textNode.deltaX = [RCTConvert RNSVGLengthArray:deltaX];
  }
  id deltaY = RNSVGConvertFollyDynamicToId(textProps.dy);
  if (deltaY != nil) {
    textNode.deltaY = [RCTConvert RNSVGLengthArray:deltaY];
  }
  id positionX = RNSVGConvertFollyDynamicToId(textProps.x);
  if (positionX != nil) {
    textNode.positionX = [RCTConvert RNSVGLengthArray:positionX];
  }
  id positionY = RNSVGConvertFollyDynamicToId(textProps.y);
  if (positionY != nil) {
    textNode.positionY = [RCTConvert RNSVGLengthArray:positionY];
  }
  id rotate = RNSVGConvertFollyDynamicToId(textProps.rotate);
  if (rotate != nil) {
    textNode.rotate = [RCTConvert RNSVGLengthArray:rotate];
  }
  id textLength = RNSVGConvertFollyDynamicToId(textProps.textLength);
  if (textLength != nil) {
    textNode.textLength = [RCTConvert RNSVGLength:textLength];
  }
  id inlineSize = RNSVGConvertFollyDynamicToId(textProps.inlineSize);
  if (inlineSize != nil) {
    textNode.inlineSize = [RCTConvert RNSVGLength:inlineSize];
  }
  id baselineShift = RNSVGConvertFollyDynamicToId(textProps.baselineShift);
  if (baselineShift != nil) {
    if ([baselineShift isKindOfClass:[NSString class]]) {
      NSString *stringValue = (NSString *)baselineShift;
      textNode.baselineShift = stringValue;
    } else {
      textNode.baselineShift = [NSString stringWithFormat:@"%f", [baselineShift doubleValue]];
    }
  }
  textNode.lengthAdjust = RCTNSStringFromStringNilIfEmpty(textProps.lengthAdjust);
  textNode.alignmentBaseline = RCTNSStringFromStringNilIfEmpty(textProps.alignmentBaseline);
}

static RNSVGVBMOS intToRNSVGVBMOS(int value)
{
  switch (value) {
    case 0:
      return kRNSVGVBMOSMeet;
    case 1:
      return kRNSVGVBMOSSlice;
    case 2:
      return kRNSVGVBMOSNone;
    default:
      return kRNSVGVBMOSMeet;
  }
}
