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
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Point;
import android.util.Log;
import android.view.ViewGroup;

import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.UIViewOperationQueue;

import java.util.HashMap;
import java.util.Map;

/**
 * Shadow node for RNSVG virtual tree root - RNSVGSvgView
 */
public class RNSVGSvgViewShadowNode extends LayoutShadowNode {

    private boolean mResponsible = false;

    private static final Map<String, Path> mDefinedClipPaths = new HashMap<>();

    @Override
    public void onCollectExtraUpdates(UIViewOperationQueue uiUpdater) {
        super.onCollectExtraUpdates(uiUpdater);
        uiUpdater.enqueueUpdateExtraData(getReactTag(), drawOutput());
    }

    private Object drawOutput() {
        Bitmap bitmap = Bitmap.createBitmap(
            (int) getLayoutWidth(),
            (int) getLayoutHeight(),
            Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        Paint paint = new Paint();

        drawChildren(canvas, paint);

        return bitmap;
    }

    public void drawChildren(Canvas canvas, Paint paint) {
        for (int i = 0; i < getChildCount(); i++) {
            RNSVGVirtualNode child = (RNSVGVirtualNode) getChildAt(i);
            child.setupDimensions(canvas);
            child.draw(canvas, paint, 1f);

            if (child.isResponsible() && !mResponsible) {
                mResponsible = true;
            }
        }
    }

    public void enableTouchEvents() {
        if (!mResponsible) {
            mResponsible = true;
        }
    }

    public int hitTest(Point point, ViewGroup view) {
        if (!mResponsible) {
            return -1;
        }

        int count = getChildCount();
        int viewTag = -1;
        for (int i = count - 1; i >= 0; i--) {
            viewTag = ((RNSVGVirtualNode) getChildAt(i)).hitTest(point, view.getChildAt(i));
            if (viewTag != -1) {
                break;
            }
        }

        return viewTag;
    }

    public void defineClipPath(Path clipPath, String clipPathId) {
        mDefinedClipPaths.put(clipPathId, clipPath);
    }

    // TODO: remove unmounted clipPath
    public void removeClipPath(String clipPathId) {
        mDefinedClipPaths.remove(clipPathId);
    }

    public Path getDefinedClipPath(String clipPathId) {
        return mDefinedClipPaths.get(clipPathId);
    }
}
