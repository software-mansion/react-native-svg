/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.util.Log;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

/**
 * Shadow node for virtual RNSVGPath view
 */
public class SpanShadowNode extends PathShadowNode {

    private static final String PROP_FONT_FAMILY = "fontFamily";
    private static final String PROP_FONT_SIZE = "fontSize";
    private static final String PROP_FONT_STYLE = "fontStyle";
    private static final String PROP_FONT_WEIGHT = "fontWeight";

    private static final int DEFAULT_FONT_SIZE = 12;

    private float mDx;
    private float mDy;
    private @Nullable String mPx;
    private @Nullable String mPy;
    private ReadableMap mFont;
    private String mContent;

    @ReactProp(name = "dx")
    public void setDx(float dx) {
        mDx = dx * mScale;
        markUpdated();
    }

    @ReactProp(name = "dy")
    public void setDy(float dy) {
        mDy = dy * mScale;
        markUpdated();
    }

    @ReactProp(name = "px")
    public void setPx(String px) {
        mPx = px;
        markUpdated();
    }

    @ReactProp(name = "py")
    public void setPy(String py) {
        mPy = py;
        markUpdated();
    }

    @ReactProp(name = "font")
    public void setFont(ReadableMap font) {
        mFont = font;
        markUpdated();
    }

    @ReactProp(name = "content")
    public void setContent(String content) {
        mContent = content;
        markUpdated();
    }

    @Override
    public void draw(Canvas canvas, Paint paint, float opacity) {
        mPath = getPath(canvas, paint);
        super.draw(canvas, paint, opacity);
    }

    @Override
    protected Path getPath(Canvas canvas, Paint paint) {
        Path path = new Path();
        RNSVGTextShadowNode text = (RNSVGTextShadowNode)getParent();

        if (text == null) {
            return path;
        }

        applyTextPropertiesToPaint(paint);
        paint.getTextPath(mContent, 0, mContent.length(), 0, 0, path);

        if (!mContent.isEmpty()) {
            if (mPx != null) {
                text.setOffsetX(PropHelper.fromPercentageToFloat(mPx, mCanvasWidth, 0, mScale), false);
            }

            if (mPy != null) {
                text.setOffsetY(PropHelper.fromPercentageToFloat(mPy, mCanvasHeight, 0, mScale) - paint.ascent(), false);
            }

            text.setOffsetX(mDx, true);
            text.setOffsetY(mDy, true);

            Matrix matrix = new Matrix();
            matrix.setTranslate(text.getOffsetX(), text.getOffsetY());

            text.setOffsetX(getBox(paint).width(), true);

            path.transform(matrix);
        } else {
            text.setOffsetX(mDx, true);
            text.setOffsetY(mDy, true);
        }

        return path;
    }

    private void applyTextPropertiesToPaint(Paint paint) {
        paint.setTextAlign(Paint.Align.LEFT);

        float fontSize = DEFAULT_FONT_SIZE;
        if (mFont.hasKey(PROP_FONT_SIZE)) {
            fontSize = (float) mFont.getDouble(PROP_FONT_SIZE);
        }
        paint.setTextSize(fontSize * mScale);
        boolean isBold = mFont.hasKey(PROP_FONT_WEIGHT) && "bold".equals(mFont.getString(PROP_FONT_WEIGHT));
        boolean isItalic = mFont.hasKey(PROP_FONT_STYLE) && "italic".equals(mFont.getString(PROP_FONT_STYLE));
        int fontStyle;
        if (isBold && isItalic) {
            fontStyle = Typeface.BOLD_ITALIC;
        } else if (isBold) {
            fontStyle = Typeface.BOLD;
        } else if (isItalic) {
            fontStyle = Typeface.ITALIC;
        } else {
            fontStyle = Typeface.NORMAL;
        }
        // NB: if the font family is null / unsupported, the default one will be used
        paint.setTypeface(Typeface.create(mFont.getString(PROP_FONT_FAMILY), fontStyle));
    }

    public RectF getBox(Paint paint) {
        applyTextPropertiesToPaint(paint);
        Rect bound = new Rect();
        paint.getTextBounds(mContent, 0, mContent.length(), bound);
        return new RectF(bound);
    }
}
