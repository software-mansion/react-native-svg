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
import android.graphics.Point;
import android.graphics.Region;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.uimanager.DisplayMetricsHolder;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.ReactShadowNode;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

import static com.horcrux.svg.GlyphContext.DEFAULT_FONT_SIZE;

public abstract class VirtualNode extends LayoutShadowNode {
    /*
        N[1/Sqrt[2], 36]
        The inverse of the square root of 2.
        Provide enough digits for the 128-bit IEEE quad (36 significant digits).
    */
    private static final double M_SQRT1_2l = 0.707106781186547524400844362104849039;

    protected static final float MIN_OPACITY_FOR_DRAW = 0.01f;

    private static final float[] sMatrixData = new float[9];
    private static final float[] sRawMatrix = new float[9];
    protected float mOpacity = 1f;
    protected float mScaleX = 1f;
    protected float mScaleY = 1f;
    protected double mFontSize = -1;
    protected double mParentFontSize = -1;
    protected Matrix mMatrix = new Matrix();

    private int mClipRule;
    protected @Nullable String mClipPath;

    private static final int CLIP_RULE_EVENODD = 0;
    private static final int CLIP_RULE_NONZERO = 1;

    protected final float mScale;
    protected boolean mResponsible;
    protected String mName;

    private SvgViewShadowNode mSvgShadowNode;
    private Path mCachedClipPath;
    private GroupShadowNode mParentTextRoot;
    private GroupShadowNode mTextRoot;
    private float canvasHeight = -1;
    private float canvasWidth = -1;

    public VirtualNode() {
        mScale = DisplayMetricsHolder.getScreenDisplayMetrics().density;
    }

    @Override
    public boolean isVirtual() {
        return true;
    }

    GroupShadowNode getTextRoot() {
        GroupShadowNode shadowNode = getShadowNode(GroupShadowNode.class);
        if (shadowNode == null) {
            return getShadowNode(TextShadowNode.class);
        }
        return shadowNode;
    }

    GroupShadowNode getParentTextRoot() {
        GroupShadowNode shadowNode = getParentShadowNode(GroupShadowNode.class);
        if (shadowNode == null) {
            return getParentShadowNode(TextShadowNode.class);
        }
        return shadowNode;
    }

    @android.support.annotation.Nullable
    private GroupShadowNode getParentShadowNode(Class shadowNodeClass) {
        ReactShadowNode node = this.getParent();
        if (mParentTextRoot == null) {
            while (node != null) {
                if (node.getClass() == shadowNodeClass) {
                    mParentTextRoot = (GroupShadowNode)node;
                    break;
                }

                ReactShadowNode parent = node.getParent();

                if (!(parent instanceof VirtualNode)) {
                    node = null;
                } else {
                    node = parent;
                }
            }
        }

        return mParentTextRoot;
    }

    @android.support.annotation.Nullable
    private GroupShadowNode getShadowNode(Class shadowNodeClass) {
        VirtualNode node = this;
        if (mTextRoot == null) {
            while (node != null) {
                if (node.getClass() == shadowNodeClass) {
                    mTextRoot = (GroupShadowNode)node;
                    break;
                }

                ReactShadowNode parent = node.getParent();

                if (!(parent instanceof VirtualNode)) {
                    node = null;
                } else {
                    node = (VirtualNode)parent;
                }
            }
        }

        return mTextRoot;
    }

    double getFontSizeFromContext() {
        if (mFontSize != -1) {
            return mFontSize;
        }
        GroupShadowNode root = getTextRoot();
        if (root == null) {
            mFontSize = DEFAULT_FONT_SIZE;
        } else {
            mFontSize = root.getGlyphContext().getFontSize();
        }
        return mFontSize;
    }

    double getFontSizeFromParentContext() {
        if (mParentFontSize != -1) {
            return mParentFontSize;
        }
        GroupShadowNode root = getParentTextRoot();
        if (root == null) {
            mParentFontSize = DEFAULT_FONT_SIZE;
        } else {
            mParentFontSize = root.getGlyphContext().getFontSize();
        }
        return mParentFontSize;
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
    protected int saveAndSetupCanvas(Canvas canvas) {
        int count = canvas.save();
        canvas.concat(mMatrix);
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

    @ReactProp(name = "name")
    public void setName(String name) {
        mName = name;
        markUpdated();
    }


    @ReactProp(name = "clipPath")
    public void setClipPath(String clipPath) {
        mClipPath = clipPath;
        markUpdated();
    }

    @ReactProp(name = "clipRule", defaultInt = CLIP_RULE_NONZERO)
    public void clipRule(int clipRule) {
        mClipRule = clipRule;
        markUpdated();
    }

    @ReactProp(name = "opacity", defaultFloat = 1f)
    public void setOpacity(float opacity) {
        mOpacity = opacity;
        markUpdated();
    }

    @ReactProp(name = "scaleX", defaultFloat = 1f)
    public void setScaleX(float scaleX) {
        mScaleX = scaleX;
        markUpdated();
    }

    @ReactProp(name = "scaleY", defaultFloat = 1f)
    public void setScaleY(float scaleY) {
        mScaleY = scaleY;
        markUpdated();
    }

    @ReactProp(name = "matrix")
    public void setMatrix(@Nullable ReadableArray matrixArray) {
        if (matrixArray != null) {
            int matrixSize = PropHelper.toFloatArray(matrixArray, sMatrixData);
            if (matrixSize == 6) {
                sRawMatrix[0] = sMatrixData[0];
                sRawMatrix[1] = sMatrixData[2];
                sRawMatrix[2] = sMatrixData[4] * mScale;
                sRawMatrix[3] = sMatrixData[1];
                sRawMatrix[4] = sMatrixData[3];
                sRawMatrix[5] = sMatrixData[5] * mScale;
                sRawMatrix[6] = 0;
                sRawMatrix[7] = 0;
                sRawMatrix[8] = 1;
                mMatrix.setValues(sRawMatrix);
            } else if (matrixSize != -1) {
                FLog.w(ReactConstants.TAG, "RNSVG: Transform matrices must be of size 6");
            }
        } else {
            mMatrix = null;
        }

        markUpdated();
    }

    public Matrix getMatrix() {
        return mMatrix;
    }

    public float getScaleX() {
        return mScaleX;
    }

    public float getScaleY() {
        return mScaleY;
    }

    @ReactProp(name = "responsible", defaultBoolean = false)
    public void setResponsible(boolean responsible) {
        mResponsible = responsible;
        markUpdated();
    }

    protected @Nullable Path getClipPath() {
        return mCachedClipPath;
    }

    protected @Nullable Path getClipPath(Canvas canvas, Paint paint) {
        if (mClipPath != null) {
            VirtualNode node = getSvgShadowNode().getDefinedClipPath(mClipPath);

            if (node != null) {
                Path clipPath = node.getPath(canvas, paint);
                switch (mClipRule) {
                    case CLIP_RULE_EVENODD:
                        clipPath.setFillType(Path.FillType.EVEN_ODD);
                        break;
                    case CLIP_RULE_NONZERO:
                        break;
                    default:
                        FLog.w(ReactConstants.TAG, "RNSVG: clipRule: " + mClipRule + " unrecognized");
                }
                mCachedClipPath = clipPath;
            } else {
                FLog.w(ReactConstants.TAG, "RNSVG: Undefined clipPath: " + mClipPath);
            }
        }

        return getClipPath();
    }

    protected void clip(Canvas canvas, Paint paint) {
        Path clip = getClipPath(canvas, paint);

        if (clip != null) {
            canvas.clipPath(clip, Region.Op.REPLACE);
        }
    }

    abstract public int hitTest(Point point, @Nullable Matrix matrix);

    public boolean isResponsible() {
        return mResponsible;
    }

    abstract protected Path getPath(Canvas canvas, Paint paint);

    protected SvgViewShadowNode getSvgShadowNode() {
        if (mSvgShadowNode != null) {
            return mSvgShadowNode;
        }

        ReactShadowNode parent = getParent();

        if (parent instanceof SvgViewShadowNode) {
            mSvgShadowNode = (SvgViewShadowNode)parent;
        } else if (parent instanceof VirtualNode) {
            mSvgShadowNode = ((VirtualNode) parent).getSvgShadowNode();
        } else {
            FLog.e(ReactConstants.TAG, "RNSVG: " + getClass().getName() + " should be descendant of a SvgViewShadow.");
        }

        return mSvgShadowNode;
    }

    protected float relativeOnWidth(String length) {
        return PropHelper.fromRelativeToFloat(length, getCanvasWidth(), 0, mScale, getFontSizeFromContext());
    }

    protected float relativeOnHeight(String length) {
        return PropHelper.fromRelativeToFloat(length, getCanvasHeight(), 0, mScale, getFontSizeFromContext());
    }

    protected float relativeOnOther(String length) {
        double powX = Math.pow((getCanvasWidth()), 2);
        double powY = Math.pow((getCanvasHeight()), 2);
        float r = (float) (Math.sqrt(powX + powY) * M_SQRT1_2l);
        return PropHelper.fromRelativeToFloat(length, r, 0, mScale, getFontSizeFromContext());
    }

    protected float getCanvasWidth() {
        if (canvasWidth != -1) {
            return canvasWidth;
        }
        GroupShadowNode root = getTextRoot();
        if (root == null) {
            canvasWidth = getSvgShadowNode().getCanvasBounds().width();
        } else {
            canvasWidth = root.getGlyphContext().getWidth();
        }

        return canvasWidth;
    }

    protected float getCanvasHeight() {
        if (canvasHeight != -1) {
            return canvasHeight;
        }
        GroupShadowNode root = getTextRoot();
        if (root == null) {
            canvasHeight = getSvgShadowNode().getCanvasBounds().height();
        } else {
            canvasHeight = root.getGlyphContext().getHeight();
        }

        return canvasHeight;
    }

    protected float getCanvasLeft() {
        return getSvgShadowNode().getCanvasBounds().left;
    }

    protected float getCanvasTop() {
        return getSvgShadowNode().getCanvasBounds().top;
    }

    protected void saveDefinition() {
        if (mName != null) {
            getSvgShadowNode().defineTemplate(this, mName);
        }
    }

    protected interface NodeRunnable {
        boolean run(VirtualNode node);
    }

    protected void traverseChildren(NodeRunnable runner) {
        for (int i = 0; i < getChildCount(); i++) {
            ReactShadowNode child = getChildAt(i);
            if (!(child instanceof VirtualNode)) {
                continue;
            }

            if (!runner.run((VirtualNode) child)) {
                break;
            }
        }
    }
}
