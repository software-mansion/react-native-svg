#include <react/renderer/components/view/YogaLayoutableShadowNode.h>
#include "RNSVGLayoutableState.h"

namespace facebook::react {

class RNSVGLayoutableShadowNode : public YogaLayoutableShadowNode {
 public:
  RNSVGLayoutableShadowNode(
      const ShadowNodeFragment &fragment,
      const ShadowNodeFamily::Shared &family,
      ShadowNodeTraits traits);

  RNSVGLayoutableShadowNode(
      const ShadowNode &sourceShadowNode,
      const ShadowNodeFragment &fragment);

  void layout(LayoutContext layoutContext) override;
  void setShadowNodePosition(float x, float y);
};

} // namespace facebook::react
