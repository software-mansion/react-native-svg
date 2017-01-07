/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.SurfaceTexture;
import android.support.annotation.Nullable;
import android.util.Base64;
import android.util.Log;
import android.util.SparseArray;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.view.Surface;
import android.view.TextureView;

import com.facebook.common.logging.FLog;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.ReactShadowNode;
import com.facebook.react.uimanager.UIViewOperationQueue;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * Shadow node for RNSVG virtual tree root - RNSVGSvgView
 */
public class SvgViewShadowNode extends LayoutShadowNode implements TextureView.SurfaceTextureListener {

    private static final SparseArray<SvgViewShadowNode> mTagToShadowNode = new SparseArray<>();
    private @Nullable Surface mSurface;

    public static SvgViewShadowNode getShadowNodeByTag(int tag) {
        return mTagToShadowNode.get(tag);
    }

    private boolean mResponsible = false;

    private final Map<String, VirtualNode> mDefinedClipPaths = new HashMap<>();
    private final Map<String, VirtualNode> mDefinedTemplates = new HashMap<>();
    private final Map<String, PropHelper.RNSVGBrush> mDefinedBrushes = new HashMap<>();

    @Override
    public boolean isVirtual() {
        return false;
    }

    @Override
    public boolean isVirtualAnchor() {
        return true;
    }

    @Override
    public void onCollectExtraUpdates(UIViewOperationQueue uiUpdater) {
        super.onCollectExtraUpdates(uiUpdater);
        drawOutput();
        uiUpdater.enqueueUpdateExtraData(getReactTag(), this);
    }

    @Override
    public void setReactTag(int reactTag) {
        super.setReactTag(reactTag);
        mTagToShadowNode.put(getReactTag(), this);
    }

    public void drawOutput() {
        if (mSurface == null || !mSurface.isValid()) {
            markChildrenUpdatesSeen(this);
            return;
        }

        try {
            Canvas canvas = mSurface.lockCanvas(null);
            drawChildren(canvas);

            if (mSurface != null) {
                mSurface.unlockCanvasAndPost(canvas);
            }

        } catch (IllegalArgumentException | IllegalStateException e) {
            FLog.e(ReactConstants.TAG, e.getClass().getSimpleName() + " in Svg.unlockCanvasAndPost");
        }
    }

    private void markChildrenUpdatesSeen(ReactShadowNode shadowNode) {
        for (int i = 0; i < shadowNode.getChildCount(); i++) {
            ReactShadowNode child = shadowNode.getChildAt(i);
            child.markUpdateSeen();
            markChildrenUpdatesSeen(child);
        }
    }

    @Override
    public void onSurfaceTextureAvailable(SurfaceTexture surface, int width, int height) {
        mSurface = new Surface(surface);
        drawOutput();
    }

    @Override
    public boolean onSurfaceTextureDestroyed(SurfaceTexture surface) {
        surface.release();
        mSurface = null;
        return true;
    }

    @Override
    public void onSurfaceTextureSizeChanged(SurfaceTexture surface, int width, int height) {}

    @Override
    public void onSurfaceTextureUpdated(SurfaceTexture surface) {}

    private void drawChildren(Canvas canvas) {
        canvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR);
        Paint paint = new Paint();

        for (int i = 0; i < getChildCount(); i++) {
            if (!(getChildAt(i) instanceof VirtualNode)) {
                continue;
            }

            VirtualNode child = (VirtualNode) getChildAt(i);
            child.setupDimensions(canvas);
            child.saveDefinition();
            child.draw(canvas, paint, 1f);
            child.markUpdateSeen();

            if (child.isResponsible() && !mResponsible) {
                mResponsible = true;
            }
        }
    }

    public String getBase64() {
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

    public void enableTouchEvents() {
        if (!mResponsible) {
            mResponsible = true;
        }
    }

    public int hitTest(Point point) {
        if (!mResponsible) {
            return -1;
        }

        int count = getChildCount();
        int viewTag = -1;
        for (int i = count - 1; i >= 0; i--) {
            if (!(getChildAt(i) instanceof VirtualNode)) {
                continue;
            }

            viewTag = ((VirtualNode) getChildAt(i)).hitTest(point);
            if (viewTag != -1) {
                break;
            }
        }

        return viewTag;
    }

    public void defineClipPath(VirtualNode clipPath, String clipPathRef) {
        mDefinedClipPaths.put(clipPathRef, clipPath);
    }

    public VirtualNode getDefinedClipPath(String clipPathRef) {
        return mDefinedClipPaths.get(clipPathRef);
    }

    public void defineTemplate(VirtualNode template, String templateRef) {
        mDefinedTemplates.put(templateRef, template);
    }

    public VirtualNode getDefinedTemplate(String templateRef) {
        return mDefinedTemplates.get(templateRef);
    }

    public void defineBrush(PropHelper.RNSVGBrush brush, String brushRef) {
        mDefinedBrushes.put(brushRef, brush);
    }

    public PropHelper.RNSVGBrush getDefinedBrush(String brushRef) {
        return mDefinedBrushes.get(brushRef);
    }

    public void finalize() {
        mTagToShadowNode.remove(getReactTag());
    }
}
