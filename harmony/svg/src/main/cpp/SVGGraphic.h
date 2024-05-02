/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

#ifndef FOUNDATION_ACE_FRAMEWORKS_CORE_COMPONENTS_NG_SVG_PARSE_SVG_GRAPHIC_H
#define FOUNDATION_ACE_FRAMEWORKS_CORE_COMPONENTS_NG_SVG_PARSE_SVG_GRAPHIC_H

// #include "include/core/SkMaskFilter.h"
// #include "base/utils/utils.h"
// #include "core/components_ng/render/drawing_forward.h"
// #ifndef USE_ROSEN_DRAWING
// #include "include/core/SkPaint.h"
// #else
// #include "core/components_ng/render/drawing.h"
// #endif

#include "SVGNode.h"
#include "RNOH/CppComponentInstance.h"
namespace rnoh {

class SvgGraphic : public SVGNode {
public:
    SvgGraphic() : SVGNode() {
        //         InitGraphicFlag();
    }
    ~SvgGraphic() override = default;

    //     void OnDraw(OH_Drawing_Canvas *canvas, const Size& layout, const std::optional<Color>& color) override;
    void OnDraw(OH_Drawing_Canvas *canvas) override {
        LOG(INFO) << "[SVGNode] onDraw:";
    }
    // protected:
    //     void OnGraphicFill()
    //     {
    // #ifndef USE_ROSEN_DRAWING
    //         if (skCanvas_) {
    //             auto smoothEdge = GetSmoothEdge();
    //             if (GreatNotEqual(smoothEdge, 0.0f)) {
    //                 auto filter = SkMaskFilter::MakeBlur(SkBlurStyle::kNormal_SkBlurStyle, smoothEdge, false);
    //                 auto tmpFillPaint = fillPaint_;
    //                 tmpFillPaint.setMaskFilter(filter);
    //                 skCanvas_->drawPath(path_, tmpFillPaint);
    //                 tmpFillPaint.setMaskFilter(nullptr);
    //             } else {
    //                 skCanvas_->drawPath(path_, fillPaint_);
    //             }
    //         }
    // #else
    //         if (rsCanvas_) {
    //             auto smoothEdge = GetSmoothEdge();
    //             if (GreatNotEqual(smoothEdge, 0.0f)) {
    //                 RSFilter filter;
    //                 filter.SetMaskFilter(RSMaskFilter::CreateBlurMaskFilter(
    //                     RSBlurType::NORMAL, static_cast<double>(smoothEdge), false
    //                 ));
    //                 auto tmpFillBrush = fillBrush_;
    //                 tmpFillBrush.SetFilter(filter);
    //                 rsCanvas_->AttachBrush(tmpFillBrush);
    //                 rsCanvas_->DrawPath(path_);
    //                 rsCanvas_->DetachBrush();
    //             } else {
    //                 rsCanvas_->AttachBrush(fillBrush_);
    //                 rsCanvas_->DrawPath(path_);
    //                 rsCanvas_->DetachBrush();
    //             }
    //         }
    // #endif
    //     }
    //
    //     void OnGraphicStroke()
    //     {
    // #ifndef USE_ROSEN_DRAWING
    //         if (skCanvas_) {
    //             auto smoothEdge = GetSmoothEdge();
    //             if (GreatNotEqual(smoothEdge, 0.0f)) {
    //                 auto filter = SkMaskFilter::MakeBlur(SkBlurStyle::kNormal_SkBlurStyle, smoothEdge, false);
    //                 auto tmpStrokePaint = strokePaint_;
    //                 tmpStrokePaint.setMaskFilter(filter);
    //                 skCanvas_->drawPath(path_, tmpStrokePaint);
    //                 tmpStrokePaint.setMaskFilter(nullptr);
    //             } else {
    //                 skCanvas_->drawPath(path_, strokePaint_);
    //             }
    //         }
    // #else
    //         if (rsCanvas_) {
    //             auto smoothEdge = GetSmoothEdge();
    //             if (GreatNotEqual(smoothEdge, 0.0f)) {
    //                 RSFilter filter;
    //                 filter.SetMaskFilter(RSMaskFilter::CreateBlurMaskFilter(
    //                     RSBlurType::NORMAL, static_cast<double>(smoothEdge), false
    //                 ));
    //                 auto tmpStrokePen = strokePen_;
    //                 tmpStrokePen.SetFilter(filter);
    //                 rsCanvas_->AttachPen(tmpStrokePen);
    //                 rsCanvas_->DrawPath(path_);
    //                 rsCanvas_->DetachPen();
    //             } else {
    //                 rsCanvas_->AttachPen(strokePen_);
    //                 rsCanvas_->DrawPath(path_);
    //                 rsCanvas_->DetachPen();
    //             }
    //         }
    // #endif
    //     }
    //
    //     // rect line polygon path circle ellipse
    //     void InitGraphicFlag()
    //     {
    //         hrefFill_ = true;
    //         hrefRender_ = true;
    //         passStyle_ = false;
    //         inheritStyle_ = true;
    //         drawTraversed_ = true;
    //     }
    //
    //     // Update fillStates & strokeStates
    //     void UpdateGradient(const Size& viewPort);
    //     bool UpdateFillStyle(const std::optional<Color>& color, bool antiAlias = true);
    //     bool UpdateStrokeStyle(bool antiAlias = true);
    //     void SetGradientStyle(double opacity);
    //     void UpdateLineDash();
    //
    // #ifndef USE_ROSEN_DRAWING
    //     SkPath path_;
    //     SkPaint fillPaint_;
    //     SkPaint strokePaint_;
    // #else
    //     RSRecordingPath path_;
    //     RSBrush fillBrush_;
    //     RSPen strokePen_;
    // #endif
    //     FillState fillState_;
    //
    // private:
    //     void UpdateColorFilter(RSFilter& filter);
};

} // namespace rnoh

#endif // FOUNDATION_ACE_FRAMEWORKS_CORE_COMPONENTS_NG_SVG_PARSE_SVG_GRAPHIC_H