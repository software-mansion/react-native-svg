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
import android.view.ViewGroup;

import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Shadow node for virtual RNSVGClipPath view
 */
public class RNSVGClipPathShadowNode extends RNSVGGroupShadowNode {

    private String mName = null;

    @ReactProp(name = "name")
    public void setName(String name) {
        mName = name;
        markUpdated();
    }

    @Override
    public void draw(Canvas canvas, Paint paint, float opacity) {
        getSvgShadowNode().defineClipPath(getPath(canvas, paint), mName);
    }

    @Override
    public int hitTest(Point point, View view) {
        return -1;
    }
}
