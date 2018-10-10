/*
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.util.Base64;

import com.facebook.react.uimanager.DisplayMetricsHolder;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.ReactShadowNode;
import com.facebook.react.uimanager.ReactShadowNodeImpl;
import com.facebook.react.uimanager.UIViewOperationQueue;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Shadow node for RNSVG virtual tree root - RNSVGSvgView
 */
public class SvgViewShadowNode extends LayoutShadowNode {
    private boolean mResponsible = false;

    private final Map<String, VirtualNode> mDefinedClipPaths = new HashMap<>();
    private final Map<String, VirtualNode> mDefinedTemplates = new HashMap<>();
    private final Map<String, VirtualNode> mDefinedMasks = new HashMap<>();
    private final Map<String, Brush> mDefinedBrushes = new HashMap<>();
    private Canvas mCanvas;
    private final float mScale;

    private float mMinX;
    private float mMinY;
    private float mVbWidth;
    private float mVbHeight;
    private String mbbWidth;
    private String mbbHeight;
    private String mAlign;
    private int mMeetOrSlice;
    private Matrix mInvViewBoxMatrix = new Matrix();
    private boolean mInvertible = true;
    private boolean mRendered = false;
    int mTintColor = 0;

    public SvgViewShadowNode() {
        mScale = DisplayMetricsHolder.getScreenDisplayMetrics().density;
    }

    private void releaseCachedPath() {
        if (!mRendered) {
            return;
        }
        mRendered = false;
        traverseChildren(new VirtualNode.NodeRunnable() {
            public void run(ReactShadowNode node) {
                if (node instanceof VirtualNode) {
                    VirtualNode n = ((VirtualNode)node);
                    n.releaseCachedPath();
                }
            }
        });
    }

    @ReactProp(name = "tintColor", customType = "Color")
    public void setTintColor(@Nullable Integer tintColor) {
        if (tintColor == null) {
            mTintColor = 0;
        } else {
            mTintColor = tintColor;
        }
    }

    @ReactProp(name = "minX")
    public void setMinX(float minX) {
        mMinX = minX;
        markUpdated();
        releaseCachedPath();
    }

    @ReactProp(name = "minY")
    public void setMinY(float minY) {
        mMinY = minY;
        markUpdated();
        releaseCachedPath();
    }

    @ReactProp(name = "vbWidth")
    public void setVbWidth(float vbWidth) {
        mVbWidth = vbWidth;
        markUpdated();
        releaseCachedPath();
    }

    @ReactProp(name = "vbHeight")
    public void setVbHeight(float vbHeight) {
        mVbHeight = vbHeight;
        markUpdated();
        releaseCachedPath();
    }

    @ReactProp(name = "bbWidth")
    public void setVbWidth(String bbWidth) {
        mbbWidth = bbWidth;
        markUpdated();
        releaseCachedPath();
    }

    @ReactProp(name = "bbHeight")
    public void setVbHeight(String bbHeight) {
        mbbHeight = bbHeight;
        markUpdated();
        releaseCachedPath();
    }

    @ReactProp(name = "align")
    public void setAlign(String align) {
        mAlign = align;
        markUpdated();
        releaseCachedPath();
    }

    @ReactProp(name = "meetOrSlice")
    public void setMeetOrSlice(int meetOrSlice) {
        mMeetOrSlice = meetOrSlice;
        markUpdated();
        releaseCachedPath();
    }

    @Override
    public boolean isVirtual() {
        return false;
    }

    @Override
    public boolean isVirtualAnchor() {
        return false;
    }

    @Override
    public void onCollectExtraUpdates(UIViewOperationQueue uiUpdater) {
        super.onCollectExtraUpdates(uiUpdater);
        uiUpdater.enqueueUpdateExtraData(getReactTag(), null);
    }

    @Override
    public void setReactTag(int reactTag) {
        super.setReactTag(reactTag);
        SvgViewManager.setShadowNode(this);
    }

    Bitmap drawOutput() {
        mRendered = true;
        float width = getLayoutWidth();
        float height = getLayoutHeight();
        boolean early = Float.isNaN(width) || Float.isNaN(height) || width * height == 0 || (Math.log10(width) + Math.log10(height) > 42);
        if (early) {
            ReactShadowNodeImpl parent = getParent();
            float parentWidth = parent == null ? 0 : parent.getLayoutWidth();
            float parentHeight = parent == null ? 0 : parent.getLayoutHeight();
            width = (float) PropHelper.fromRelative(mbbWidth, parentWidth, 0, mScale, 12);
            height = (float) PropHelper.fromRelative(mbbHeight, parentHeight, 0, mScale, 12);
        }
        Bitmap bitmap = Bitmap.createBitmap(
                (int) width,
                (int) height,
                Bitmap.Config.ARGB_8888);

        drawChildren(new Canvas(bitmap));
        return bitmap;
    }

    Rect getCanvasBounds() {
        return mCanvas.getClipBounds();
    }

    void drawChildren(final Canvas canvas) {
        mCanvas = canvas;
        if (mAlign != null) {
            RectF vbRect = getViewBox();
            float width = canvas.getWidth();
            float height = canvas.getHeight();
            boolean nested = getNativeParent() instanceof SvgViewShadowNode;
            if (nested) {
                width = (float) PropHelper.fromRelative(mbbWidth, width, 0f, mScale, 12);
                height = (float) PropHelper.fromRelative(mbbHeight, height, 0f, mScale, 12);
            }
            RectF eRect = new RectF(0,0, width, height);
            if (nested) {
                canvas.clipRect(eRect);
            }
            Matrix mViewBoxMatrix = ViewBox.getTransform(vbRect, eRect, mAlign, mMeetOrSlice);
            mInvertible = mViewBoxMatrix.invert(mInvViewBoxMatrix);
            canvas.concat(mViewBoxMatrix);
        }

        final Paint paint = new Paint();

        paint.setFlags(Paint.ANTI_ALIAS_FLAG | Paint.DEV_KERN_TEXT_FLAG | Paint.SUBPIXEL_TEXT_FLAG);

        paint.setTypeface(Typeface.DEFAULT);


        traverseChildren(new VirtualNode.NodeRunnable() {
            public void run(ReactShadowNode node) {
                if (node instanceof VirtualNode) {
                    ((VirtualNode)node).saveDefinition();
                }
            }
        });

        traverseChildren(new VirtualNode.NodeRunnable() {
            public void run(ReactShadowNode lNode) {
                if (lNode instanceof VirtualNode) {
                    VirtualNode node = (VirtualNode)lNode;
                    int count = node.saveAndSetupCanvas(canvas);
                    node.render(canvas, paint, 1f);
                    node.restoreCanvas(canvas, count);
                    node.markUpdateSeen();

                    if (node.isResponsible() && !mResponsible) {
                        mResponsible = true;
                    }
                } else {
                    lNode.calculateLayout();
                }
            }
        });
    }

    private RectF getViewBox() {
        return new RectF(mMinX * mScale, mMinY * mScale, (mMinX + mVbWidth) * mScale, (mMinY + mVbHeight) * mScale);
    }

    String toDataURL() {
        Bitmap bitmap = Bitmap.createBitmap(
                (int) getLayoutWidth(),
                (int) getLayoutHeight(),
                Bitmap.Config.ARGB_8888);

        drawChildren(new Canvas(bitmap));
        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream);
        bitmap.recycle();
        byte[] bitmapBytes = stream.toByteArray();
        return Base64.encodeToString(bitmapBytes, Base64.DEFAULT);
    }

    void enableTouchEvents() {
        if (!mResponsible) {
            mResponsible = true;
        }
    }

    int hitTest(Point point) {
        if (!mResponsible || !mInvertible) {
            return getReactTag();
        }

        float[] transformed = { point.x, point.y };
        mInvViewBoxMatrix.mapPoints(transformed);

        int count = getChildCount();
        int viewTag = -1;
        for (int i = count - 1; i >= 0; i--) {
            ReactShadowNodeImpl child = getChildAt(i);
            if (!(child instanceof VirtualNode)) {
                continue;
            }

            viewTag = ((VirtualNode) child).hitTest(transformed);
            if (viewTag != -1) {
                break;
            }
        }

        return viewTag == -1 ? getReactTag() : viewTag;
    }

    void defineClipPath(VirtualNode clipPath, String clipPathRef) {
        mDefinedClipPaths.put(clipPathRef, clipPath);
    }

    VirtualNode getDefinedClipPath(String clipPathRef) {
        return mDefinedClipPaths.get(clipPathRef);
    }

    void defineTemplate(VirtualNode template, String templateRef) {
        mDefinedTemplates.put(templateRef, template);
    }

    VirtualNode getDefinedTemplate(String templateRef) {
        return mDefinedTemplates.get(templateRef);
    }

    void defineBrush(Brush brush, String brushRef) {
        mDefinedBrushes.put(brushRef, brush);
    }

    Brush getDefinedBrush(String brushRef) {
        return mDefinedBrushes.get(brushRef);
    }

    void defineMask(VirtualNode mask, String maskRef) {
        mDefinedMasks.put(maskRef, mask);
    }

    VirtualNode getDefinedMask(String maskRef) {
        return mDefinedMasks.get(maskRef);
    }

    void traverseChildren(VirtualNode.NodeRunnable runner) {
        for (int i = 0; i < getChildCount(); i++) {
            ReactShadowNode child = getChildAt(i);
            runner.run(child);
        }
    }

}
