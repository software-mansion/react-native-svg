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
import com.facebook.react.bridge.ReadableType;
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
        if (x1.getType() == ReadableType.String) {
            mX1 = x1.asString();
        } else {
            mX1 = String.valueOf(x1.asDouble());
        }
        markUpdated();
    }

    @ReactProp(name = "y1")
    public void setY1(Dynamic y1) {
        if (y1.getType() == ReadableType.String) {
            mY1 = y1.asString();
        } else {
            mY1 = String.valueOf(y1.asDouble());
        }
        markUpdated();
    }

    @ReactProp(name = "x2")
    public void setX2(Dynamic x2) {
        if (x2.getType() == ReadableType.String) {
            mX2 = x2.asString();
        } else {
            mX2 = String.valueOf(x2.asDouble());
        }
        markUpdated();
    }

    @ReactProp(name = "y2")
    public void setY2(Dynamic y2) {
        if (y2.getType() == ReadableType.String) {
            mY2 = y2.asString();
        } else {
            mY2 = String.valueOf(y2.asDouble());
        }
        markUpdated();
    }

    @Override
    protected Path getPath(Canvas canvas, Paint paint) {
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
