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
import android.view.View;
import android.util.Log;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.ArrayList;

/**
 * Shadow node for virtual RNSVGPath view
 */
public class RNSVGDefsShadowNode extends RNSVGVirtualNode {

    @Override
    public void draw(Canvas canvas, Paint paint, float opacity) {
        int count = saveAndSetupCanvas(canvas);
        clip(canvas, paint);

        for (int i = 0; i < getChildCount(); i++) {
            RNSVGVirtualNode child = (RNSVGVirtualNode) getChildAt(i);
            child.saveDefinition();
        }

        restoreCanvas(canvas, count);
    }

    @Override
    public boolean isResponsible() {
        return false;
    }

    protected Path getPath(Canvas canvas, Paint paint) {
        return new Path();
    }

    @Override
    public int hitTest(Point point, View view) {
        return -1;
    }

    @Override
    public void mergeProperties(RNSVGVirtualNode target, ReadableArray mergeList, boolean inherited) {}

    @Override
    public void mergeProperties(RNSVGVirtualNode target, ReadableArray mergeList) {}

    @Override
    public void resetProperties() {}
}
