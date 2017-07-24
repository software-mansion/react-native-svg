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

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

/**
 * Shadow node for virtual Text view
 */

class TextShadowNode extends GroupShadowNode {
    // static final String INHERIT = "inherit";

    // static final String TEXT_ANCHOR_AUTO = "auto";
    // static final String TEXT_ANCHOR_START = "start";
    static final String TEXT_ANCHOR_MIDDLE = "middle";
    static final String TEXT_ANCHOR_END = "end";

    // static final String TEXT_DECORATION_NONE = "none";
    static final String TEXT_DECORATION_UNDERLINE = "underline";
    // static final String TEXT_DECORATION_OVERLINE = "overline";
    static final String TEXT_DECORATION_LINE_THROUGH = "line-through";
    // static final String TEXT_DECORATION_BLINK = "blink";

    static final String KERNING = "kerning";
    static final String TEXT_ANCHOR = "textAnchor";
    static final String WORD_SPACING = "wordSpacing";
    static final String LETTER_SPACING = "letterSpacing";
    static final String TEXT_DECORATION = "textDecoration";

    private @Nullable ReadableArray mPositionX;
    private @Nullable ReadableArray mPositionY;
    private @Nullable ReadableArray mRotate;
    private @Nullable ReadableArray mDeltaX;
    private @Nullable ReadableArray mDeltaY;

    @ReactProp(name = "rotate")
    public void setRotate(@Nullable ReadableArray rotate) {
        mRotate = rotate;
        markUpdated();
    }

    @ReactProp(name = "deltaX")
    public void setDeltaX(@Nullable ReadableArray deltaX) {
        mDeltaX = deltaX;
        markUpdated();
    }

    @ReactProp(name = "deltaY")
    public void setDeltaY(@Nullable ReadableArray deltaY) {
        mDeltaY = deltaY;
        markUpdated();
    }

    @ReactProp(name = "positionX")
    public void setPositionX(@Nullable ReadableArray positionX) {
        mPositionX = positionX;
        markUpdated();
    }

    @ReactProp(name = "positionY")
    public void setPositionY(@Nullable ReadableArray positionY) {
        mPositionY = positionY;
        markUpdated();
    }

    @ReactProp(name = "font")
    public void setFont(@Nullable ReadableMap font) {
        mFont = font;
        markUpdated();
    }

    // TODO implement https://www.w3.org/TR/SVG2/text.html#TextLayoutAlgorithm

    @Override
    public void draw(Canvas canvas, Paint paint, float opacity) {
        if (opacity > MIN_OPACITY_FOR_DRAW) {
            setupGlyphContext(canvas);
            clip(canvas, paint);
            getGroupPath(canvas, paint);
            drawGroup(canvas, paint, opacity);
            releaseCachedPath();
        }
    }

    @Override
    protected Path getPath(Canvas canvas, Paint paint) {
        setupGlyphContext(canvas);
        Path groupPath = getGroupPath(canvas, paint);
        releaseCachedPath();
        return groupPath;
    }

    void releaseCachedPath() {
        traverseChildren(new NodeRunnable() {
            public void run(VirtualNode node) {
                TextShadowNode text = (TextShadowNode)node;
                text.releaseCachedPath();
            }
        });
    }

    Path getGroupPath(Canvas canvas, Paint paint) {
        pushGlyphContext();
        Path groupPath = super.getPath(canvas, paint);
        popGlyphContext();

        return groupPath;
    }

    @Override
    void pushGlyphContext() {
        boolean isTextNode = !(this instanceof TextPathShadowNode) && !(this instanceof TSpanShadowNode);
        getTextRootGlyphContext().pushContext(isTextNode, this, mFont, mPositionX, mPositionY, mDeltaX, mDeltaY, mRotate);
    }
}
