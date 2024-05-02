/*
 * Copyright (c) 2022-2024 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// #include "SVGCircle.h"
//
// #include "base/utils/utils.h"
// #include "core/components_ng/svg/parse/svg_animation.h"
// #include "frameworks/core/components/declaration/svg/svg_circle_declaration.h"
//
// namespace OHOS::Ace::NG {
//
// SvgCircle::SvgCircle() : SvgGraphic() {}
//
// RefPtr<SvgNode> SvgCircle::Create()
// {
//     return AceType::MakeRefPtr<SvgCircle>();
// }
//
// #ifndef USE_ROSEN_DRAWING
// SkPath SvgCircle::AsPath(const Size& viewPort) const
// {
//     SkPath path;
//     path.addCircle(ConvertDimensionToPx(circleAttr_.cx, viewPort, SvgLengthType::HORIZONTAL),
//         ConvertDimensionToPx(circleAttr_.cy, viewPort, SvgLengthType::VERTICAL),
//         ConvertDimensionToPx(circleAttr_.r, viewPort, SvgLengthType::OTHER));
//     return path;
// }
// #else
// RSRecordingPath SvgCircle::AsPath(const Size& viewPort) const
// {
//     RSRecordingPath path;
//     path.AddCircle(ConvertDimensionToPx(circleAttr_.cx, viewPort, SvgLengthType::HORIZONTAL),
//         ConvertDimensionToPx(circleAttr_.cy, viewPort, SvgLengthType::VERTICAL),
//         ConvertDimensionToPx(circleAttr_.r, viewPort, SvgLengthType::OTHER));
//     return path;
// }
// #endif
//
// void SvgCircle::PrepareAnimation(const RefPtr<SvgAnimation>& animate)
// {
//     auto attr = animate->GetAttributeName();
//     if (attr == DOM_SVG_CX) {
//         AnimateOnAttribute(animate, circleAttr_.cx);
//     } else if (attr == DOM_SVG_CY) {
//         AnimateOnAttribute(animate, circleAttr_.cy);
//     } else if (attr == DOM_SVG_R) {
//         AnimateOnAttribute(animate, circleAttr_.r);
//     } else {
//         SvgNode::PrepareAnimation(animate);
//     }
// }
//
// bool SvgCircle::ParseAndSetSpecializedAttr(const std::string& name, const std::string& value)
// {
//     static const LinearMapNode<void (*)(const std::string&, SvgCircleAttribute&)> attrs[] = {
//         { DOM_SVG_CX,
//             [](const std::string& val, SvgCircleAttribute& attr) {
//                 attr.cx = SvgAttributesParser::ParseDimension(val);
//             } },
//         { DOM_SVG_CY,
//             [](const std::string& val, SvgCircleAttribute& attr) {
//                 attr.cy = SvgAttributesParser::ParseDimension(val);
//             } },
//         { DOM_SVG_R,
//             [](const std::string& val, SvgCircleAttribute& attr) {
//                 attr.r = SvgAttributesParser::ParseDimension(val);
//             } },
//     };
//     auto attrIter = BinarySearchFindIndex(attrs, ArraySize(attrs), name.c_str());
//     if (attrIter != -1) {
//         attrs[attrIter].value(value, circleAttr_);
//         return true;
//     }
//     return false;
// }
//
// } // namespace OHOS::Ace::NG


