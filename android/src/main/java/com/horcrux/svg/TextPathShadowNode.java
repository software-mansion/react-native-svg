/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.drawable.shapes.PathShape;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

public class TextPathShadowNode extends TextShadowNode {

    private String mHref;
    private @Nullable String mStartOffset;

    @ReactProp(name = "href")
    public void setHref(String href) {
        mHref = href;
        markUpdated();
    }

    @ReactProp(name = "startOffset")
    public void setStartOffset(@Nullable String startOffset) {
        mStartOffset = startOffset;
        markUpdated();
    }

    @Override
    public void draw(Canvas canvas, Paint paint, float opacity) {
        drawGroup(canvas, paint, opacity);
    }

    public BezierTransformer getBezierTransformer() {
        SvgViewShadowNode svg = getSvgShadowNode();
        VirtualNode template = svg.getDefinedTemplate(mHref);

        if (template == null || template.getClass() != PathShadowNode.class) {
            // warning about this.
            return null;
        }

        PathShadowNode path = (PathShadowNode)template;

        return new BezierTransformer(path.getBezierCurves(), PropHelper.fromPercentageToFloat(mStartOffset, mCanvasWidth, 0, mScale));
    }

    @Override
    protected Path getPath(Canvas canvas, Paint paint) {
        return getGroupPath(canvas, paint);
    }

    @Override
    protected void pushGlyphContext() {
        // do nothing
    }

    @Override
    protected void popGlyphContext() {
        // do nothing
    }

}
