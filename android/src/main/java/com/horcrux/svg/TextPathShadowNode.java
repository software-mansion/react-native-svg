/*
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

import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

/**
 * Shadow node for virtual TextPath view
 */
class TextPathShadowNode extends TextShadowNode {

    private String mHref;
    private String mMethod;
    private String mSpacing;
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

    @ReactProp(name = "method")
    public void setMethod(@Nullable String method) {
        mMethod = method;
        markUpdated();
    }

    @ReactProp(name = "spacing")
    public void setSpacing(@Nullable String spacing) {
        mSpacing = spacing;
        markUpdated();
    }

    String getMethod() {
        return mMethod;
    }

    public String getSpacing() {
        return mSpacing;
    }

    String getStartOffset() {
        return mStartOffset;
    }

    @Override
    public void draw(Canvas canvas, Paint paint, float opacity) {
        drawGroup(canvas, paint, opacity);
    }

    public Path getPath() {
        SvgViewShadowNode svg = getSvgShadowNode();
        VirtualNode template = svg.getDefinedTemplate(mHref);

        if (template == null || template.getClass() != PathShadowNode.class) {
            // warning about this.
            return null;
        }

        PathShadowNode path = (PathShadowNode)template;
        return path.getPath();
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
