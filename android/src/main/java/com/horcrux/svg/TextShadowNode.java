/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import javax.annotation.Nullable;

import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Rect;
import android.graphics.RectF;
import android.util.Log;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Shadow node for virtual RNSVGText view
 */

public class RNSVGTextShadowNode extends RNSVGGroupShadowNode {

    private float mOffsetX = 0;
    private float mOffsetY = 0;

    private static final int TEXT_ALIGNMENT_LEFT = 0;
    private static final int TEXT_ALIGNMENT_RIGHT = 1;

    private int mTextAlignment = TEXT_ALIGNMENT_LEFT;
    private Path mTextPath;

    @ReactProp(name = "alignment", defaultInt = TEXT_ALIGNMENT_LEFT)
    public void setAlignment(int alignment) {
        mTextAlignment = alignment;
    }

    @ReactProp(name = "path")
    public void setPath(@Nullable ReadableArray textPath) {
        float[] pathData = PropHelper.toFloatArray(textPath);
        mTextPath = new Path();
        super.createPath(pathData, mTextPath);
        markUpdated();
    }

    @Override
    public void draw(Canvas canvas, Paint paint, float opacity) {
        float shift = getShift(paint);

        final int count = canvas.save();

        Matrix matrix = new Matrix();
        matrix.postTranslate(-shift, 0);
        canvas.concat(matrix);
        super.draw(canvas, paint, opacity);

        restoreCanvas(canvas, count);
        markUpdateSeen();
    }

    @Override
    protected Path getPath(Canvas canvas, Paint paint) {
        Path path = getPathFromSuper(canvas, paint);

        float shift = getShift(paint);
        Matrix matrix = new Matrix();
        matrix.setTranslate(shift, 0);
        path.transform(matrix);

        return path;
    }

    private Path getPathFromSuper(Canvas canvas, Paint paint) {
        Path path = super.getPath(canvas, paint);
        // reset offsetX and offsetY
        mOffsetX = mOffsetY = 0;
        return path;
    }

    public void setOffsetX(float x, boolean increase) {
        if (increase) {
            mOffsetX += x;
        } else {
            mOffsetX = x;
        }
    }

    public void setOffsetY(float y, boolean increase) {
        if (increase) {
            mOffsetY += y;
        } else {
            mOffsetY = y;
        }
    }

    public float getOffsetX() {
        return mOffsetX;
    }

    public float getOffsetY() {
        return mOffsetY;
    }

    private float getShift(Paint paint) {
        Rect rect = new Rect();

        for (int i = getChildCount() - 1; i >= 0; i--) {
            if (!(getChildAt(i) instanceof RNSVGVirtualNode)) {
                continue;
            }

            RectF box = ((RNSVGSpanShadowNode) getChildAt(i)).getBox(paint);

            if (rect.top > box.top) {
                rect.top = (int)box.top;
            }
            if (rect.right < box.right) {
                rect.right = (int)box.right;
            }
            if (rect.bottom < box.bottom) {
                rect.bottom = (int)box.bottom;
            }
            if (rect.left > box.left) {
                rect.left = (int)box.left;
            }
        }


        float width = rect.width();
        float shift;

        switch (mTextAlignment) {
            case TEXT_ALIGNMENT_RIGHT:
                shift = width;
                break;
            case TEXT_ALIGNMENT_LEFT:
                shift = 0;
                break;
            default:
                shift = width / 2;
        }
        return shift;
    }
}
