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
import android.graphics.Region;

import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.JavaOnlyArray;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.uimanager.ReactShadowNode;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

/**
 * Shadow node for virtual Text view
 */

class TextShadowNode extends GroupShadowNode {
    String mTextLength = null;
    private String mBaselineShift = null;
    TextLengthAdjust mLengthAdjust = TextLengthAdjust.spacing;
    private AlignmentBaseline mAlignmentBaseline;
    private @Nullable ReadableArray mPositionX;
    private @Nullable ReadableArray mPositionY;
    private @Nullable ReadableArray mRotate;
    private @Nullable ReadableArray mDeltaX;
    private @Nullable ReadableArray mDeltaY;

    @Override
    public void markUpdated() {
        super.markUpdated();
        releaseCachedPath();
    }

    @ReactProp(name = "textLength")
    public void setTextLength(Dynamic length) {
        if (length.getType() == ReadableType.String) {
            mTextLength = length.asString();
        } else {
            mTextLength = String.valueOf(length.asDouble());
        }
        markUpdated();
    }

    @ReactProp(name = "lengthAdjust")
    public void setLengthAdjust(@Nullable String adjustment) {
        mLengthAdjust = TextLengthAdjust.valueOf(adjustment);
        markUpdated();
    }

    @ReactProp(name = "alignmentBaseline")
    public void setMethod(@Nullable String alignment) {
        mAlignmentBaseline = AlignmentBaseline.getEnum(alignment);
        markUpdated();
    }

    @ReactProp(name = "baselineShift")
    public void setBaselineShift(Dynamic baselineShift) {
        if (baselineShift.getType() == ReadableType.String) {
            mBaselineShift = baselineShift.asString();
        } else {
            mBaselineShift = String.valueOf(baselineShift.asDouble());
        }
        markUpdated();
    }

    @ReactProp(name = "verticalAlign")
    public void setVerticalAlign(@Nullable String verticalAlign) {
        if (verticalAlign != null) {
            verticalAlign = verticalAlign.trim();
            int i = verticalAlign.lastIndexOf(' ');
            try {
                mAlignmentBaseline = AlignmentBaseline.getEnum(verticalAlign.substring(i));
            } catch (IllegalArgumentException e) {
                mAlignmentBaseline = AlignmentBaseline.baseline;
            }
            try {
                mBaselineShift = verticalAlign.substring(0, i);
            } catch (IndexOutOfBoundsException e) {
                mBaselineShift = null;
            }
        } else {
            mAlignmentBaseline = AlignmentBaseline.baseline;
            mBaselineShift = null;
        }
        markUpdated();
    }

    @ReactProp(name = "rotate")
    public void setRotate(Dynamic rotate) {
        if (rotate.isNull()) {
            mRotate = null;
        } else {
            switch (rotate.getType()) {
                case Array: {
                    mRotate = rotate.asArray();
                    break;
                }
                case String: {
                    mRotate = JavaOnlyArray.of(rotate.asString());
                    break;
                }
                case Number: {
                    mRotate = JavaOnlyArray.of(String.valueOf(rotate.asDouble()));
                    break;
                }
            }
        }
        markUpdated();
    }

    @ReactProp(name = "dx")
    public void setDeltaX(Dynamic deltaX) {
        if (deltaX.isNull()) {
            mDeltaX = null;
        } else {
            switch (deltaX.getType()) {
                case Array: {
                    mDeltaX = deltaX.asArray();
                    break;
                }
                case String: {
                    mDeltaX = JavaOnlyArray.of(deltaX.asString());
                    break;
                }
                case Number: {
                    mDeltaX = JavaOnlyArray.of(String.valueOf(deltaX.asDouble()));
                    break;
                }
            }
        }
        markUpdated();
    }

    @ReactProp(name = "dy")
    public void setDeltaY(Dynamic deltaY) {
        if (deltaY.isNull()) {
            mDeltaY = null;
        } else {
            switch (deltaY.getType()) {
                case Array: {
                    mDeltaY = deltaY.asArray();
                    break;
                }
                case String: {
                    mDeltaY = JavaOnlyArray.of(deltaY.asString());
                    break;
                }
                case Number: {
                    mDeltaY = JavaOnlyArray.of(String.valueOf(deltaY.asDouble()));
                    break;
                }
            }
        }
        markUpdated();
    }

    @ReactProp(name = "x")
    public void setPositionX(Dynamic positionX) {
        if (positionX.isNull()) {
            mPositionX = null;
        } else {
            switch (positionX.getType()) {
                case Array: {
                    mPositionX = positionX.asArray();
                    break;
                }
                case String: {
                    mPositionX = JavaOnlyArray.of(positionX.asString());
                    break;
                }
                case Number: {
                    mPositionX = JavaOnlyArray.of(String.valueOf(positionX.asDouble()));
                    break;
                }
            }
        }
        markUpdated();
    }

    @ReactProp(name = "y")
    public void setPositionY(Dynamic positionY) {
        if (positionY.isNull()) {
            mPositionY = null;
        } else {
            switch (positionY.getType()) {
                case Array: {
                    mPositionY = positionY.asArray();
                    break;
                }
                case String: {
                    mPositionY = JavaOnlyArray.of(positionY.asString());
                    break;
                }
                case Number: {
                    mPositionY = JavaOnlyArray.of(String.valueOf(positionY.asDouble()));
                    break;
                }
            }
        }
        markUpdated();
    }

    @ReactProp(name = "font")
    public void setFont(@Nullable ReadableMap font) {
        mFont = font;
        markUpdated();
    }

    @Override
    public void draw(Canvas canvas, Paint paint, float opacity) {
        if (opacity > MIN_OPACITY_FOR_DRAW) {
            setupGlyphContext(canvas);
            clip(canvas, paint);
            getGroupPath(canvas, paint);
            drawGroup(canvas, paint, opacity);
        }
    }

    @Override
    protected Path getPath(Canvas canvas, Paint paint) {
        setupGlyphContext(canvas);
        Path groupPath = getGroupPath(canvas, paint);
        return groupPath;
    }

    @Override
    protected Path getPath(Canvas canvas, Paint paint, Region.Op op) {
        return getPath(canvas, paint);
    }

    AlignmentBaseline getAlignmentBaseline() {
        if (mAlignmentBaseline == null) {
            ReactShadowNode parent = this.getParent();
            while (parent != null) {
                if (parent instanceof TextShadowNode) {
                    TextShadowNode node = (TextShadowNode)parent;
                    final AlignmentBaseline baseline = node.mAlignmentBaseline;
                    if (baseline != null) {
                        mAlignmentBaseline = baseline;
                        return baseline;
                    }
                }
                parent = parent.getParent();
            }
        }
        if (mAlignmentBaseline == null) {
            mAlignmentBaseline = AlignmentBaseline.baseline;
        }
        return mAlignmentBaseline;
    }

    String getBaselineShift() {
        if (mBaselineShift == null) {
            ReactShadowNode parent = this.getParent();
            while (parent != null) {
                if (parent instanceof TextShadowNode) {
                    TextShadowNode node = (TextShadowNode)parent;
                    final String baselineShift = node.mBaselineShift;
                    if (baselineShift != null) {
                        mBaselineShift = baselineShift;
                        return baselineShift;
                    }
                }
                parent = parent.getParent();
            }
        }
        return mBaselineShift;
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
