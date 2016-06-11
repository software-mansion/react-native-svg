/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Point;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;

/**
 * Shadow node for virtual RNSVGGroup view
 */
public class RNSVGGroupShadowNode extends RNSVGVirtualNode {

    public void draw(Canvas canvas, Paint paint, float opacity) {
        opacity *= mOpacity;
        RNSVGSvgViewShadowNode svg = getSvgShadowNode();

        if (opacity > MIN_OPACITY_FOR_DRAW) {
            int count = saveAndSetupCanvas(canvas);
            clip(canvas, paint);

            for (int i = 0; i < getChildCount(); i++) {
                RNSVGVirtualNode child = (RNSVGVirtualNode) getChildAt(i);
                child.setupDimensions(canvas);
                child.draw(canvas, paint, opacity);

                if (child.isResponsible()) {
                    svg.enableTouchEvents();
                }
            }

            restoreCanvas(canvas, count);
        }
    }

    @Override
    protected Path getPath(Canvas canvas, Paint paint) {
        Path path = new Path();

        for (int i = 0; i < getChildCount(); i++) {
            RNSVGVirtualNode child = (RNSVGVirtualNode) getChildAt(i);
            child.setupDimensions(canvas);
            path.addPath(child.getPath(canvas, paint));
        }
        return path;
    }

    @Override
    public int hitTest(Point point, View view) {
        int viewTag = -1;
        for (int i = getChildCount() - 1; i >= 0; i--) {
            viewTag = ((RNSVGVirtualNode) getChildAt(i)).hitTest(point, ((ViewGroup) view).getChildAt(i));
            if (viewTag != -1) {
                break;
            }
        }

        return viewTag;
    }
}
