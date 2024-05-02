#include "RNSVGCircleComponentInstance.h"
#include "Props.h"
#include <react/renderer/core/ConcreteState.h>
#include <sstream>

namespace rnoh {

RNSVGCircleComponentInstance::RNSVGCircleComponentInstance(Context context) : CppComponentInstance(std::move(context)) {}

void RNSVGCircleComponentInstance::onPropsChanged(SharedConcreteProps const &props) {
//     CppComponentInstance::onPropsChanged(props);
    LOG(INFO) << "[RNSVGCircleComponentInstance] Props->tinColor: " ;
}

// void FastImageViewComponentInstance::onStateChanged(SharedConcreteState const& state) {
//   CppComponentInstance::onStateChanged(state);
//   auto vector = {state->getData().getImageSource()};
//   this->getLocalRootArkUINode().setSources(vector);
//   this->getLocalRootArkUINode().setBlur(state->getData().getBlurRadius());
// }

// SVGArkUINode &RNSVGCircleComponentInstance::getLocalRootArkUINode() { return null; }

// void FastImageViewComponentInstance::onComplete(float width, float height) {
//     if (m_eventEmitter == nullptr) {
//         return;
//     }
//     m_eventEmitter->onFastImageLoad({width, height});
//     m_eventEmitter->onFastImageProgress({1, 1});
//     m_eventEmitter->onFastImageLoadEnd({});
// }
//
// void FastImageViewComponentInstance::onError(int32_t errorCode) {
//   if (m_eventEmitter == nullptr) {
//     return;
//   }
//   m_eventEmitter->onFastImageLoadEnd({});
// }
//
// void FastImageViewComponentInstance::onLoadStart() {
//   if (m_eventEmitter) {
//     m_eventEmitter->onFastImageLoadStart({});
//   }
// }
//
// facebook::react::ImageResizeMode
// FastImageViewComponentInstance::convertToImageResizeMode(facebook::react::FastImageViewResizeMode mode) {
//   switch (mode) {
//   case facebook::react::FastImageViewResizeMode::Contain:
//         return facebook::react::ImageResizeMode::Contain;
//   case facebook::react::FastImageViewResizeMode::Cover:
//         return facebook::react::ImageResizeMode::Cover;
//   case facebook::react::FastImageViewResizeMode::Stretch:
//         return facebook::react::ImageResizeMode::Stretch;
//   case facebook::react::FastImageViewResizeMode::Center:
//         return facebook::react::ImageResizeMode::Center;
//   }
// }

} // namespace rnoh
