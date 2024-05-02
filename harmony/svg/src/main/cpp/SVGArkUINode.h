#pragma once
#include "SVGNode.h"
#include "RNOH/arkui/ArkUINode.h"
#include "arkui/native_interface.h"
#include "arkui/native_node.h"
#include "arkui/native_type.h"

namespace rnoh {

struct UserCallback {
    std::function<void(ArkUI_NodeCustomEvent *event)> callback;
};
// 4:实现对接ArkUINode
class SVGArkUINode : public ArkUINode {
private:
    void OnDraw(ArkUI_NodeCustomEvent *event);

    std::shared_ptr<SVGNode> root_;
    ArkUI_NativeNodeAPI_1 *nativeModule_ = nullptr;
    UserCallback *userCallback_ = nullptr;

public:
    SVGArkUINode();
    ~SVGArkUINode() override;
    void onNodeEvent(SVGNode node);
    SVGNode getSvgNode();
};
} // namespace rnoh