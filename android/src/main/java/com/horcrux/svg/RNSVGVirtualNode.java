/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import javax.annotation.Nullable;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Point;
import android.graphics.RectF;
import android.graphics.Region;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.DisplayMetricsHolder;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.ReactShadowNode;

import java.util.HashMap;
import java.util.Map;

/**
 * Base class for RNSVGView virtual nodes: {@link RNSVGGroupShadowNode}, {@link RNSVGPathShadowNode} and
 * indirectly for {@link RNSVGTextShadowNode}.
 */
public abstract class RNSVGVirtualNode extends LayoutShadowNode {

    protected static final float MIN_OPACITY_FOR_DRAW = 0.01f;

    private static final float[] sMatrixData = new float[9];
    private static final float[] sRawMatrix = new float[9];
    protected float mOpacity = 1f;
    protected  @Nullable Matrix mMatrix = new Matrix();

    protected @Nullable Path mClipPath;
    protected @Nullable String mClipPathId;
    private static final int PATH_TYPE_ARC = 4;
    private static final int PATH_TYPE_CLOSE = 1;
    private static final int PATH_TYPE_CURVETO = 3;
    private static final int PATH_TYPE_LINETO = 2;
    private static final int PATH_TYPE_MOVETO = 0;

    private static final int CLIP_RULE_EVENODD = 0;
    private static final int CLIP_RULE_NONZERO = 1;
    protected final float mScale;
    private float[] mClipData;
    private int mClipRule;
    private boolean mClipRuleSet;
    private boolean mClipDataSet;
    protected boolean mResponsible;
    protected int mWidth;
    protected int mHeight;

    private RNSVGSvgViewShadowNode mSvgShadowNode;

    public RNSVGVirtualNode() {
        mScale = DisplayMetricsHolder.getWindowDisplayMetrics().density;
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
    protected final int saveAndSetupCanvas(Canvas canvas) {
        int count = canvas.getSaveCount();
        canvas.save();
        if (mMatrix != null) {
            canvas.concat(mMatrix);
        }

        return count;
    }

    /**
     * Restore the canvas after an element was drawn. This is always called in mirror with
     * {@link #saveAndSetupCanvas}.
     *
     * @param canvas the canvas to restore
     */
    protected void restoreCanvas(Canvas canvas, int count) {
        canvas.restoreToCount(count);
    }

    @ReactProp(name = "clipPath")
    public void setClipPath(@Nullable ReadableArray clipPath) {
        mClipData = PropHelper.toFloatArray(clipPath);
        mClipDataSet = true;
        setupClip();
        markUpdated();
    }

    @ReactProp(name = "clipPathId")
    public void setClipPathId(String clipPathId) {
        mClipPathId = clipPathId;
        markUpdated();
    }

    @ReactProp(name = "clipRule", defaultInt = CLIP_RULE_NONZERO)
    public void setClipRule(int clipRule) {
        mClipRule = clipRule;
        mClipRuleSet = true;
        setupClip();
        markUpdated();
    }

    @ReactProp(name = "opacity", defaultFloat = 1f)
    public void setOpacity(float opacity) {
        mOpacity = opacity;
        markUpdated();
    }

    @ReactProp(name = "trans")
    public void setTrans(@Nullable ReadableArray transformArray) {
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

    @ReactProp(name = "responsible", defaultBoolean = false)
    public void setResponsible(boolean responsible) {
        mResponsible = responsible;
        markUpdated();
    }

    private void setupClip() {
        if (mClipDataSet && mClipRuleSet) {
            mClipPath = new Path();
            switch (mClipRule) {
                case CLIP_RULE_EVENODD:
                    mClipPath.setFillType(Path.FillType.EVEN_ODD);
                    break;
                case CLIP_RULE_NONZERO:
                    break;
                default:
                    throw new JSApplicationIllegalArgumentException(
                        "clipRule " + mClipRule + " unrecognized");
            }
            createPath(mClipData, mClipPath);
        }
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
     * Returns the floor modulus of the float arguments. Java modulus will return a negative remainder
     * when the divisor is negative. Modulus should always be positive. This mimics the behavior of
     * Math.floorMod, introduced in Java 8.
     */
    private float modulus(float x, float y) {
        float remainder = x % y;
        float ret = remainder;
        if (remainder < 0) {
            ret += y;
        }
        return ret;
    }

    /**
     * Creates a {@link Path} from an array of instructions constructed by JS
     * (see RNSVGSerializablePath.js). Each instruction starts with a type (see PATH_TYPE_*) followed
     * by arguments for that instruction. For example, to create a line the instruction will be
     * 2 (PATH_LINE_TO), x, y. This will draw a line from the last draw point (or 0,0) to x,y.
     *
     * @param data the array of instructions
     * @param path the {@link Path} that can be drawn to a canvas
     */
    protected void createPath(float[] data, Path path) {
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

                    boolean clockwise = data[i++] == 1f;
                    float sweep = end - start;
                    if (Math.abs(sweep) > 360) {
                        sweep = 360;
                    } else {
                        sweep = modulus(sweep, 360);
                    }
                    if (!clockwise && sweep < 360) {
                        start = end;
                        sweep = 360 - sweep;
                    }

                    RectF oval = new RectF(x - r, y - r, x + r, y + r);
                    path.addArc(oval, start, sweep);
                    break;
                }
                default:
                    throw new JSApplicationIllegalArgumentException(
                        "Unrecognized drawing instruction " + type);
            }
        }
    }

    protected void clip(Canvas canvas, Paint paint) {
        Path clip = mClipPath;
        if (clip == null && mClipPathId != null) {
            clip = getSvgShadowNode().getDefinedClipPath(mClipPathId);
        }

        if (clip != null) {
            canvas.clipPath(clip, Region.Op.REPLACE);
            canvas.saveLayer(0f, 0f, 0f, 0f, paint, Canvas.CLIP_SAVE_FLAG);
        }
    }

    abstract public int hitTest(Point point, View view);

    public boolean isResponsible() {
        return mResponsible;
    }

    abstract protected Path getPath(Canvas canvas, Paint paint);

    protected RNSVGSvgViewShadowNode getSvgShadowNode() {
        if (mSvgShadowNode != null) {
            return mSvgShadowNode;
        }

        ReactShadowNode parent = getParent();

        while (!(parent instanceof RNSVGSvgViewShadowNode)) {
            if (parent == null) {
                return null;
            } else {
                parent = parent.getParent();
            }
        }
        mSvgShadowNode = (RNSVGSvgViewShadowNode) parent;
        return mSvgShadowNode;
    }

    protected void setupDimensions(Canvas canvas) {
        mWidth = canvas.getWidth();
        mHeight = canvas.getHeight();
    }
}
