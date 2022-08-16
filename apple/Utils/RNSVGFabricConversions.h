#import "RNSVGContextBrush.h"
#import "RNSVGGroup.h"
#import "RNSVGLength.h"
#import "RNSVGPainterBrush.h"
#import "RNSVGRenderable.h"
#import "RNSVGSolidColorBrush.h"
#import "RNSVGVBMOS.h"

#import "RCTConversions.h"
#import "RCTFabricComponentsPlugins.h"

template <typename T>
RNSVGBrush *brushFromColorStruct(T fillObject)
{
  int type = fillObject.type;

  switch (type) {
    case -1: // empty struct
      return nil;
    case 0: // solid color
    {
      // These are probably expensive allocations since it's often the same value.
      // We should memoize colors but look ups may be just as expensive.
      RNSVGColor *color = RCTUIColorFromSharedColor(fillObject.value) ?: [RNSVGColor clearColor];
      return [[RNSVGSolidColorBrush alloc] initWithColor:color];
    }
    case 1: // brush
    {
      NSArray *arr = @[ @(type), RCTNSStringFromString(fillObject.brushRef) ];
      return [[RNSVGPainterBrush alloc] initWithArray:arr];
    }
    case 2: // currentColor
      return [[RNSVGBrush alloc] initWithArray:nil];
    case 3: // context-fill
      return [[RNSVGContextBrush alloc] initFill];
    case 4: // context-stroke
      return [[RNSVGContextBrush alloc] initStroke];
    default:
      RCTLogError(@"Unknown brush type: %d", type);
      return nil;
  }
}

template <typename T>
void setCommonNodeProps(T nodeProps, RNSVGNode *node)
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
  switch (nodeProps.pointerEvents) {
    case facebook::react::PointerEventsMode::Auto:
      node.pointerEvents = RCTPointerEventsUnspecified;
    case facebook::react::PointerEventsMode::None:
      node.pointerEvents = RCTPointerEventsNone;
    case facebook::react::PointerEventsMode::BoxNone:
      node.pointerEvents = RCTPointerEventsBoxNone;
    case facebook::react::PointerEventsMode::BoxOnly:
      node.pointerEvents = RCTPointerEventsBoxOnly;
    default:
      node.pointerEvents = RCTPointerEventsUnspecified;
  }
}

static NSMutableArray<RNSVGLength *> *createLengthArrayFromStrings(std::vector<std::string> stringArray)
{
  if (stringArray.empty()) {
    return nil;
  }
  NSMutableArray<RNSVGLength *> *lengthArray = [NSMutableArray new];
  for (auto str : stringArray) {
    RNSVGLength *lengthFromString = [RNSVGLength lengthWithString:RCTNSStringFromString(str)];
    [lengthArray addObject:lengthFromString];
  }
  return lengthArray;
}

template <typename T>
void setCommonRenderableProps(T renderableProps, RNSVGRenderable *renderableNode)
{
  setCommonNodeProps(renderableProps, renderableNode);
  renderableNode.fill = brushFromColorStruct(renderableProps.fill);
  renderableNode.fillOpacity = renderableProps.fillOpacity;
  renderableNode.fillRule = renderableProps.fillRule == 0 ? kRNSVGCGFCRuleEvenodd : kRNSVGCGFCRuleNonzero;
  renderableNode.stroke = brushFromColorStruct(renderableProps.stroke);
  renderableNode.strokeOpacity = renderableProps.strokeOpacity;
  renderableNode.strokeWidth = [RNSVGLength lengthWithString:RCTNSStringFromString(renderableProps.strokeWidth)];
  renderableNode.strokeLinecap = renderableProps.strokeLinecap == 0 ? kCGLineCapButt
      : renderableProps.strokeLinecap == 1                          ? kCGLineCapRound
                                                                    : kCGLineCapSquare;
  renderableNode.strokeLinejoin = renderableProps.strokeLinejoin == 0 ? kCGLineJoinMiter
      : renderableProps.strokeLinejoin == 1                           ? kCGLineJoinRound
                                                                      : kCGLineJoinBevel;
  renderableNode.strokeDasharray = createLengthArrayFromStrings(renderableProps.strokeDasharray);
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
}

static void addValueToDict(NSMutableDictionary *dict, std::string value, NSString *key)
{
  NSString *valueOrNil = RCTNSStringFromStringNilIfEmpty(value);
  if (valueOrNil) {
    dict[key] = valueOrNil;
  }
}

template <typename T>
NSDictionary *parseFontStruct(T fontStruct)
{
  NSMutableDictionary *fontDict = [NSMutableDictionary new];

  // TODO: do it better maybe
  addValueToDict(fontDict, fontStruct.fontStyle, @"fontStyle");
  addValueToDict(fontDict, fontStruct.fontVariant, @"fontVariant");
  addValueToDict(fontDict, fontStruct.fontWeight, @"fontWeight");
  addValueToDict(fontDict, fontStruct.fontStretch, @"fontStretch");
  addValueToDict(fontDict, fontStruct.fontSize, @"fontSize");
  addValueToDict(fontDict, fontStruct.fontFamily, @"fontFamily");
  addValueToDict(fontDict, fontStruct.textAnchor, @"textAnchor");
  addValueToDict(fontDict, fontStruct.textDecoration, @"textDecoration");
  addValueToDict(fontDict, fontStruct.letterSpacing, @"letterSpacing");
  addValueToDict(fontDict, fontStruct.wordSpacing, @"wordSpacing");
  addValueToDict(fontDict, fontStruct.kerning, @"kerning");
  addValueToDict(fontDict, fontStruct.fontFeatureSettings, @"fontFeatureSettings");
  addValueToDict(fontDict, fontStruct.fontVariantLigatures, @"fontVariantLigatures");
  addValueToDict(fontDict, fontStruct.fontVariationSettings, @"fontVariationSettings");
  return [NSDictionary dictionaryWithDictionary:fontDict];
}

template <typename T>
void setCommonGroupProps(T groupProps, RNSVGGroup *groupNode)
{
  setCommonRenderableProps(groupProps, groupNode);

  if (RCTNSStringFromStringNilIfEmpty(groupProps.fontSize)) {
    groupNode.font = @{@"fontSize" : RCTNSStringFromString(groupProps.fontSize)};
  }
  if (RCTNSStringFromStringNilIfEmpty(groupProps.fontWeight)) {
    groupNode.font = @{@"fontWeight" : RCTNSStringFromString(groupProps.fontWeight)};
  }
  NSDictionary *fontDict = parseFontStruct(groupProps.font);
  if (groupNode.font == nil || fontDict.count > 0) {
    // some of text's rendering logic requires that `font` is not nil so we always set it
    // even if to an empty dict
    groupNode.font = fontDict;
  }
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
