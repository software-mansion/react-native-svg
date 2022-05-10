#import "RNSVGPainterBrush.h"
#import "RNSVGSolidColorBrush.h"
#import "RNSVGContextBrush.h"
#import "RNSVGRenderable.h"

#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"

template<typename T>
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
            RNSVGColor *color = RCTUIColorFromSharedColor(fillObject.value);
            return [[RNSVGSolidColorBrush alloc] initWithColor:color];
        }
        case 1: // brush
        {
            NSArray *arr = @[@(type), RCTNSStringFromString(fillObject.brushRef)];
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

template<typename T>
void setCommonNodeProps(T nodeProps, RNSVGNode *node)
{
    node.name =  RCTNSStringFromStringNilIfEmpty(nodeProps.name);
    node.opacity = nodeProps.opacity;
    if (nodeProps.matrix.size() == 6) {
        node.matrix = CGAffineTransformMake(nodeProps.matrix.at(0), nodeProps.matrix.at(1), nodeProps.matrix.at(2), nodeProps.matrix.at(3), nodeProps.matrix.at(4), nodeProps.matrix.at(5));
    }
    // transfrom
    node.mask =  RCTNSStringFromStringNilIfEmpty(nodeProps.mask);
    node.markerStart =  RCTNSStringFromStringNilIfEmpty(nodeProps.markerStart);
    node.markerMid =  RCTNSStringFromStringNilIfEmpty(nodeProps.markerMid);
    node.markerEnd =  RCTNSStringFromStringNilIfEmpty(nodeProps.markerEnd);
    node.clipPath =  RCTNSStringFromStringNilIfEmpty(nodeProps.clipPath);
    node.clipRule =  nodeProps.clipRule == 0 ? kRNSVGCGFCRuleEvenodd : kRNSVGCGFCRuleNonzero;
    node.responsible = nodeProps.responsible;
    // onLayout
    node.display =  RCTNSStringFromStringNilIfEmpty(nodeProps.display);
    // pointerEvents
}

template<typename T>
void setCommonRenderableProps(T renderableProps, RNSVGRenderable *renderableNode)
{
    setCommonNodeProps(renderableProps, renderableNode);
    renderableNode.fill = brushFromColorStruct(renderableProps.fill);
    renderableNode.fillOpacity = renderableProps.fillOpacity;
    renderableNode.fillRule = renderableProps.fillRule == 0 ? kRNSVGCGFCRuleEvenodd : kRNSVGCGFCRuleNonzero;
    renderableNode.stroke = brushFromColorStruct(renderableProps.stroke);
    renderableNode.strokeOpacity = renderableProps.strokeOpacity;
    renderableNode.strokeWidth =  [RNSVGLength lengthWithString:RCTNSStringFromString(renderableProps.strokeWidth)];
    renderableNode.strokeLinecap = renderableProps.strokeLinecap == 0 ? kCGLineCapButt : renderableProps.strokeLinecap == 1 ? kCGLineCapRound : kCGLineCapSquare;
    renderableNode.strokeLinejoin =  renderableProps.strokeLinejoin == 0 ? kCGLineJoinMiter : renderableProps.strokeLinejoin == 1 ? kCGLineJoinRound : kCGLineJoinBevel;
//    std::vector<std::string> strokeDasharray{};
    renderableNode.strokeDashoffset = renderableProps.strokeDashoffset;
    renderableNode.strokeMiterlimit = renderableProps.strokeMiterlimit;
    renderableNode.vectorEffect = renderableProps.vectorEffect == 0 ? kRNSVGVectorEffectDefault : renderableProps.vectorEffect == 1 ? kRNSVGVectorEffectNonScalingStroke : renderableProps.vectorEffect == 2 ? kRNSVGVectorEffectInherit : kRNSVGVectorEffectUri;
    if (renderableProps.propList.size() > 0) {
        NSMutableArray<NSString *> *propArray = [NSMutableArray new];
        for (auto str : renderableProps.propList) {
            NSString *nsstr = [NSString stringWithUTF8String:str.c_str()];
            [propArray addObject:nsstr];
        }
        renderableNode.propList = propArray;
    }
}
