/*
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

import com.facebook.react.bridge.Dynamic;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Shadow node for virtual Line view
 */
class LineShadowNode extends RenderableShadowNode {
    private String mX1;
    private String mY1;
    private String mX2;
    private String mY2;

    @ReactProp(name = "x1")
    public void setX1(Dynamic x1) {
        mX1 = getStringFromDynamic(x1);
        markUpdated();
    }

    @ReactProp(name = "y1")
    public void setY1(Dynamic y1) {
        mY1 = getStringFromDynamic(y1);
        markUpdated();
    }

    @ReactProp(name = "x2")
    public void setX2(Dynamic x2) {
        mX2 = getStringFromDynamic(x2);
        markUpdated();
    }

    @ReactProp(name = "y2")
    public void setY2(Dynamic y2) {
        mY2 = getStringFromDynamic(y2);
        markUpdated();
    }

    @Override
    Path getPath(Canvas canvas, Paint paint) {
        Path path = new Path();
        double x1 = relativeOnWidth(mX1);
        double y1 = relativeOnHeight(mY1);
        double x2 = relativeOnWidth(mX2);
        double y2 = relativeOnHeight(mY2);

        path.moveTo((float) x1, (float) y1);
        path.lineTo((float) x2, (float) y2);
        return path;
    }
}
