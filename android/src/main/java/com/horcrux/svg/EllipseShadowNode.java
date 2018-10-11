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
import android.graphics.RectF;

import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Shadow node for virtual Ellipse view
 */
class EllipseShadowNode extends RenderableShadowNode {

    private String mCx;
    private String mCy;
    private String mRx;
    private String mRy;

    @ReactProp(name = "cx")
    public void setCx(Dynamic cx) {
        if (cx.getType() == ReadableType.String) {
            mCx = cx.asString();
        } else {
            mCx = String.valueOf(cx.asDouble());
        }
        markUpdated();
    }

    @ReactProp(name = "cy")
    public void setCy(Dynamic cy) {
        if (cy.getType() == ReadableType.String) {
            mCy = cy.asString();
        } else {
            mCy = String.valueOf(cy.asDouble());
        }
        markUpdated();
    }

    @ReactProp(name = "rx")
    public void setRx(Dynamic rx) {
        if (rx.getType() == ReadableType.String) {
            mRx = rx.asString();
        } else {
            mRx = String.valueOf(rx.asDouble());
        }
        markUpdated();
    }

    @ReactProp(name = "ry")
    public void setRy(Dynamic ry) {
        if (ry.getType() == ReadableType.String) {
            mRy = ry.asString();
        } else {
            mRy = String.valueOf(ry.asDouble());
        }
        markUpdated();
    }

    @Override
    protected Path getPath(Canvas canvas, Paint paint) {
        Path path = new Path();
        double cx = relativeOnWidth(mCx);
        double cy = relativeOnHeight(mCy);
        double rx = relativeOnWidth(mRx);
        double ry = relativeOnHeight(mRy);
        RectF oval = new RectF((float) (cx - rx), (float) (cy - ry), (float) (cx + rx), (float) (cy + ry));
        path.addOval(oval, Path.Direction.CW);

        return path;
    }
}
