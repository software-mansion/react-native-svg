#import "RNSVGSvgViewComponentView.h"
#import "RNSVGViewBox.h"
#import "RNSVGNode.h"
#import <React/RCTLog.h>

#import <react/renderer/components/rnsvg/Props.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@implementation RNSVGSvgViewComponentView {
    NSMutableDictionary<NSString *, RNSVGNode *> *_clipPaths;
    NSMutableDictionary<NSString *, RNSVGNode *> *_templates;
    NSMutableDictionary<NSString *, RNSVGPainter *> *_painters;
    NSMutableDictionary<NSString *, RNSVGNode *> *_markers;
    NSMutableDictionary<NSString *, RNSVGNode *> *_masks;
    CGAffineTransform _invviewBoxTransform;
    bool rendered;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGSvgViewProps>();
    _props = defaultProps;
#if !TARGET_OS_OSX // Not available on macOS
    // This is necessary to ensure that [self setNeedsDisplay] actually triggers
    // a redraw when our parent transitions between hidden and visible.
    self.contentMode = UIViewContentModeRedraw;
#endif
    rendered = false;
  }
  return self;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [super mountChildComponentView:childComponentView index:index];
  [self invalidate];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [super unmountChildComponentView:childComponentView index:index];
  [self invalidate];
}

- (void)invalidate
{
    RNSVGPlatformView* parent = self.superview;
    if ([parent isKindOfClass:[RNSVGNode class]]) {
        if (!rendered) {
            return;
        }
        RNSVGNode* svgNode = (RNSVGNode*)parent;
        [svgNode invalidate];
        rendered = false;
        return;
    }
    [self setNeedsDisplay];
}

- (void)drawToContext:(CGContextRef)context withRect:(CGRect)rect {
    rendered = true;
    self.initialCTM = CGContextGetCTM(context);
    self.invInitialCTM = CGAffineTransformInvert(self.initialCTM);
    if (self.align) {
        CGRect tRect = CGRectMake(self.minX, self.minY, self.vbWidth, self.vbHeight);
        _viewBoxTransform = [RNSVGViewBox getTransform:tRect
                                                 eRect:rect
                                                 align:self.align
                                           meetOrSlice:self.meetOrSlice];
        _invviewBoxTransform = CGAffineTransformInvert(_viewBoxTransform);
        CGContextConcatCTM(context, _viewBoxTransform);
    } else {
        _viewBoxTransform = CGAffineTransformIdentity;
        _invviewBoxTransform = CGAffineTransformIdentity;
    }

    for (RNSVGView *node in self.subviews) {
        if ([node isKindOfClass:[RNSVGNode class]]) {
            RNSVGNode *svg = (RNSVGNode *)node;
            [svg renderTo:context
                     rect:rect];
        } else {
            [node drawRect:rect];
        }
    }
}

- (void)drawRect:(CGRect)rect
{
    RNSVGPlatformView* parent = self.superview;
    if ([parent isKindOfClass:[RNSVGNode class]]) {
        return;
    }
    rendered = true;
    _clipPaths = nil;
    _templates = nil;
    _painters = nil;
    _boundingBox = rect;
    CGContextRef context = UIGraphicsGetCurrentContext();

    for (RNSVGPlatformView *node in self.subviews) {
        if ([node isKindOfClass:[RNSVGNode class]]) {
            RNSVGNode *svg = (RNSVGNode *)node;
            if (svg.responsible && !self.responsible) {
                self.responsible = YES;
            }

            [svg parseReference];
        }
    }

    [self drawToContext:context withRect:rect];
}

- (RNSVGPlatformView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    CGPoint transformed = point;
    if (self.align) {
        transformed = CGPointApplyAffineTransform(transformed, _invviewBoxTransform);
    }
    for (RNSVGNode *node in [self.subviews reverseObjectEnumerator]) {
        if (![node isKindOfClass:[RNSVGNode class]]) {
            continue;
        }

        if (event) {
            node.active = NO;
        }

        RNSVGPlatformView *hitChild = [node hitTest:transformed withEvent:event];

        if (hitChild) {
            node.active = YES;
            return (node.responsible || (node != hitChild)) ? hitChild : self;
        }
    }
    return nil;
}

#pragma mark - RCTComponentViewProtocol

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldScreenProps = *std::static_pointer_cast<const RNSVGSvgViewProps>(_props);
  const auto &newScreenProps = *std::static_pointer_cast<const RNSVGSvgViewProps>(props);

  [super updateProps:props oldProps:oldProps];
}

@end

Class<RCTComponentViewProtocol> RNSVGSvgViewCls(void)
{
  return RNSVGSvgViewComponentView.class;
}
