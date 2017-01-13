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
import android.graphics.Rect;
import android.util.Base64;
import android.graphics.Color;
import android.graphics.PorterDuff;

import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.UIViewOperationQueue;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * Shadow node for RNSVG virtual tree root - RNSVGSvgView
 */
public class SvgViewShadowNode extends LayoutShadowNode {
    private boolean mResponsible = false;

    private final Map<String, VirtualNode> mDefinedClipPaths = new HashMap<>();
    private final Map<String, VirtualNode> mDefinedTemplates = new HashMap<>();
    private final Map<String, PropHelper.RNSVGBrush> mDefinedBrushes = new HashMap<>();
    private Canvas mCanvas;

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
        uiUpdater.enqueueUpdateExtraData(getReactTag(), drawOutput());
    }

    @Override
    public void setReactTag(int reactTag) {
        super.setReactTag(reactTag);
        SvgInstancesManager.registerShadowNode(this);
    }

    public Object drawOutput() {
        Bitmap bitmap = Bitmap.createBitmap(
                (int) getLayoutWidth(),
                (int) getLayoutHeight(),
                Bitmap.Config.ARGB_8888);

        mCanvas = new Canvas(bitmap);
        drawChildren(mCanvas);
        mCanvas = null;
        return bitmap;
    }

    public Rect getCanvasBounds() {
        return mCanvas.getClipBounds();
    }

    private void drawChildren(Canvas canvas) {
        canvas.getClipBounds();
        canvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR);
        Paint paint = new Paint();

        for (int i = 0; i < getChildCount(); i++) {
            if (!(getChildAt(i) instanceof VirtualNode)) {
                continue;
            }

            VirtualNode child = (VirtualNode) getChildAt(i);
            child.saveDefinition();

            int count = child.saveAndSetupCanvas(canvas);
            child.draw(canvas, paint, 1f);
            child.restoreCanvas(canvas, count);
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
}
