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

import com.facebook.react.bridge.ReadableArray;

import java.util.ArrayList;

/**
 * Shadow node for virtual RNSVGGroup view
 */
public class RNSVGGroupShadowNode extends RNSVGPathShadowNode {

    public void draw(Canvas canvas, Paint paint, float opacity) {
        RNSVGSvgViewShadowNode svg = getSvgShadowNode();

        if (opacity > MIN_OPACITY_FOR_DRAW) {
            int count = saveAndSetupCanvas(canvas);
            clip(canvas, paint);
            for (int i = 0; i < getChildCount(); i++) {
                RNSVGVirtualNode child = (RNSVGVirtualNode) getChildAt(i);
                child.setupDimensions(canvas);

                child.mergeProperties(this, mPropList, true);
                child.draw(canvas, paint, opacity * mOpacity);

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

    protected void saveDefinition() {
        if (mName != null) {
            getSvgShadowNode().defineTemplate(this, mName);
        }

        for (int i = getChildCount() - 1; i >= 0; i--) {
            ((RNSVGVirtualNode) getChildAt(i)).saveDefinition();
        }
    }

    protected void removeDefinition() {
        if (mName != null) {
            getSvgShadowNode().removeTemplate(mName);
        }

        for (int i = getChildCount() - 1; i >= 0; i--) {
            ((RNSVGVirtualNode) getChildAt(i)).removeDefinition();
        }
    }

    @Override
    public void mergeProperties(RNSVGVirtualNode target, ReadableArray mergeList) {
        if (mergeList.size() != 0) {
            for (int i = getChildCount() - 1; i >= 0; i--) {
                ((RNSVGVirtualNode) getChildAt(i)).mergeProperties(target, mergeList);
            }
        }
    }

    @Override
    public void resetProperties() {
        for (int i = getChildCount() - 1; i >= 0; i--) {
            ((RNSVGVirtualNode) getChildAt(i)).resetProperties();
        }
    }
}
