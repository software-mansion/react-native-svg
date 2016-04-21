/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.horcrux.svg;

import javax.annotation.Nullable;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.util.Log;

import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.DisplayMetricsHolder;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.ReactShadowNode;

/**
 * Base class for RNSVGView virtual nodes: {@link RNSVGGroupShadowNode}, {@link RNSVGPathShadowNode} and
 * indirectly for {@link RNSVGTextShadowNode}.
 */
public abstract class RNSVGVirtualNode extends ReactShadowNode {

    protected static final float MIN_OPACITY_FOR_DRAW = 0.01f;

    private static final float[] sMatrixData = new float[9];
    private static final float[] sRawMatrix = new float[9];

    protected float mOpacity = 1f;
    private @Nullable Matrix mMatrix = new Matrix();

    protected @Nullable Path mClipPath;

    private static final int PATH_TYPE_ARC = 4;
    private static final int PATH_TYPE_CLOSE = 1;
    private static final int PATH_TYPE_CURVETO = 3;
    private static final int PATH_TYPE_LINETO = 2;
    private static final int PATH_TYPE_MOVETO = 0;

    private static final int CLIP_RULE_EVENODD = 0;
    private static final int CLIP_RULE_NONZERO = 1;
    protected final float mScale;
    private float[] mClipData;

    public RNSVGVirtualNode() {
        mScale = DisplayMetricsHolder.getWindowDisplayMetrics().density;
    }

    @Override
    public boolean isVirtual() {
        return true;
    }

    public abstract void draw(Canvas canvas, Paint paint, float opacity);

    /**
     * Sets up the transform matrix on the canvas before an element is drawn.
     *
     * NB: for perf reasons this does not apply opacity, as that would mean creating a new canvas
     * layer (which allocates an offscreen bitmap) and having it composited afterwards. Instead, the
     * drawing code should apply opacity recursively.
     *
     * @param canvas the canvas to set up
     */
    protected final void saveAndSetupCanvas(Canvas canvas) {
        canvas.save();
        if (mMatrix != null) {
            canvas.concat(mMatrix);
        }
    }

    /**
     * Restore the canvas after an element was drawn. This is always called in mirror with
     * {@link #saveAndSetupCanvas}.
     *
     * @param canvas the canvas to restore
     */
    protected void restoreCanvas(Canvas canvas) {
        canvas.restore();
    }

    @ReactProp(name = "clipPath")
    public void setClipPath(@Nullable ReadableArray clipPath) {
        mClipData = PropHelper.toFloatArray(clipPath);
        markUpdated();
    }

    @ReactProp(name = "clipRule", defaultInt = CLIP_RULE_NONZERO)
    public void setClipRule(int clipRule) {
        Path path = new Path();
        switch (clipRule) {
            case CLIP_RULE_EVENODD:
                path.setFillType(Path.FillType.EVEN_ODD);
                break;
            case CLIP_RULE_NONZERO:
                break;
            default:
                throw new JSApplicationIllegalArgumentException(
                    "clipRule " + clipRule + " unrecognized");
        }

        mClipPath = createPath(mClipData, path);
        markUpdated();
    }

    @ReactProp(name = "opacity", defaultFloat = 1f)
    public void setOpacity(float opacity) {
        mOpacity = opacity;
        markUpdated();
    }

    @ReactProp(name = "transform")
    public void setTransform(@Nullable ReadableArray transformArray) {
        if (transformArray != null) {
            int matrixSize = PropHelper.toFloatArray(transformArray, sMatrixData);
            if (matrixSize == 6) {
                setupMatrix();
            } else if (matrixSize != -1) {
                throw new JSApplicationIllegalArgumentException("Transform matrices must be of size 6");
            }
        } else {
            mMatrix = null;
        }
        markUpdated();
    }

    protected void setupMatrix() {
        sRawMatrix[0] = sMatrixData[0];
        sRawMatrix[1] = sMatrixData[2];
        sRawMatrix[2] = sMatrixData[4] * mScale;
        sRawMatrix[3] = sMatrixData[1];
        sRawMatrix[4] = sMatrixData[3];
        sRawMatrix[5] = sMatrixData[5] * mScale;
        sRawMatrix[6] = 0;
        sRawMatrix[7] = 0;
        sRawMatrix[8] = 1;
        if (mMatrix == null) {
            mMatrix = new Matrix();
        }
        mMatrix.setValues(sRawMatrix);
    }

    /**
     * Creates a {@link Path} from an array of instructions constructed by JS
     * (see RNSVGSerializablePath.js). Each instruction starts with a type (see PATH_TYPE_*) followed
     * by arguments for that instruction. For example, to create a line the instruction will be
     * 2 (PATH_LINE_TO), x, y. This will draw a line from the last draw point (or 0,0) to x,y.
     *
     * @param data the array of instructions
     * @return the {@link Path} that can be drawn to a canvas
     */
    protected Path createPath(float[] data, Path path) {
        path.moveTo(0, 0);
        int i = 0;
        while (i < data.length) {
            int type = (int) data[i++];
            switch (type) {
                case PATH_TYPE_MOVETO:
                    path.moveTo(data[i++] * mScale, data[i++] * mScale);
                    break;
                case PATH_TYPE_CLOSE:
                    path.close();
                    break;
                case PATH_TYPE_LINETO:
                    path.lineTo(data[i++] * mScale, data[i++] * mScale);
                    break;
                case PATH_TYPE_CURVETO:
                    path.cubicTo(
                        data[i++] * mScale,
                        data[i++] * mScale,
                        data[i++] * mScale,
                        data[i++] * mScale,
                        data[i++] * mScale,
                        data[i++] * mScale);
                    break;
                case PATH_TYPE_ARC:
                {
                    float x = data[i++] * mScale;
                    float y = data[i++] * mScale;
                    float r = data[i++] * mScale;
                    float start = (float) Math.toDegrees(data[i++]);
                    float end = (float) Math.toDegrees(data[i++]);
                    boolean clockwise = data[i++] == 0f;
                    if (!clockwise) {
                        end = 360 - end;
                    }
                    float sweep = start - end;
                    RectF oval = new RectF(x - r, y - r, x + r, y + r);
                    path.addArc(oval, start, sweep);
                    break;
                }
                default:
                    throw new JSApplicationIllegalArgumentException(
                        "Unrecognized drawing instruction " + type);
            }
        }
        return path;
    }
}
