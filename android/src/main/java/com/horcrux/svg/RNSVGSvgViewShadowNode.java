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
import android.graphics.Point;
import android.graphics.PorterDuff;
import android.util.Log;
import android.view.ViewGroup;

import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.UIViewOperationQueue;

/**
 * Shadow node for RNSVG virtual tree root - RNSVGSvgView
 */
public class RNSVGSvgViewShadowNode extends LayoutShadowNode {
    public boolean touchable = false;

    public int mBitmapCount = 0;

    @Override
    public void onCollectExtraUpdates(UIViewOperationQueue uiUpdater) {
        super.onCollectExtraUpdates(uiUpdater);
        uiUpdater.enqueueUpdateExtraData(getReactTag(), drawOutput());
    }

    private Object drawOutput() {
        float width = (int) getLayoutWidth();
        float height = (int) getLayoutHeight();
        Bitmap bitmap = Bitmap.createBitmap(
            (int) width,
            (int) height,
            Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        Paint paint = new Paint();

        drawChildren(canvas, paint, width, height);

        return bitmap;
    }

    public void drawChildren(Canvas canvas, Paint paint, float width, float height) {
        for (int i = 0; i < getChildCount(); i++) {
            RNSVGVirtualNode child = (RNSVGVirtualNode) getChildAt(i);
            child.setDimensions(width, height);
            child.draw(canvas, paint, 1f);
            //child.markUpdateSeen();

            if (child.isTouchable() && !touchable) {
                touchable = true;
            }
        }
    }

    public int hitTest(Point point, ViewGroup view) {
        if (!touchable) {
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
}
