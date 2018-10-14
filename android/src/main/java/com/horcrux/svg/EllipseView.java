/*
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;

import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Shadow node for virtual Ellipse view
 */
@SuppressLint("ViewConstructor")
class EllipseView extends RenderableView {
    private String mCx;
    private String mCy;
    private String mRx;
    private String mRy;

    public EllipseView(ReactContext reactContext) {
        super(reactContext);
    }

    @ReactProp(name = "cx")
    public void setCx(Dynamic cx) {
        mCx = getStringFromDynamic(cx);
        invalidate();
    }

    @ReactProp(name = "cy")
    public void setCy(Dynamic cy) {
        mCy = getStringFromDynamic(cy);
        invalidate();
    }

    @ReactProp(name = "rx")
    public void setRx(Dynamic rx) {
        mRx = getStringFromDynamic(rx);
        invalidate();
    }

    @ReactProp(name = "ry")
    public void setRy(Dynamic ry) {
        mRy = getStringFromDynamic(ry);
        invalidate();
    }

    @Override
    Path getPath(Canvas canvas, Paint paint) {
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
