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
import android.util.Log;
import android.view.ViewGroup;

import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.UIViewOperationQueue;

/**
 * Shadow node for RNSVG virtual tree root - RNSVGSvgView
 */
public class RNSVGSvgViewShadowNode extends LayoutShadowNode {
    @Override
    public void onCollectExtraUpdates(UIViewOperationQueue uiUpdater) {
        super.onCollectExtraUpdates(uiUpdater);
        uiUpdater.enqueueUpdateExtraData(getReactTag(), drawOutput());
    }

    private Object drawOutput() {
        // TODO(7255985): Use TextureView and pass Svg from the view to draw on it asynchronously
        // instead of passing the bitmap (which is inefficient especially in terms of memory usage)
        float width = (int) getLayoutWidth();
        float height = (int) getLayoutHeight();
        Bitmap bitmap = Bitmap.createBitmap(
            (int) width,
            (int) height,
            Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        Paint paint = new Paint();

        for (int i = 0; i < getChildCount(); i++) {
            RNSVGVirtualNode child = (RNSVGVirtualNode) getChildAt(i);
            child.setDimensions(width, height);
            child.draw(canvas, paint, 1f);
            child.markUpdateSeen();
        }
        
        return bitmap;
    }

    public int hitTest(Point point, ViewGroup view) {
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
