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

import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

@SuppressLint("ViewConstructor")
class CircleView extends RenderableView {
    private String mCx;
    private String mCy;
    private String mR;

    public CircleView(ReactContext reactContext) {
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

    @ReactProp(name = "r")
    public void setR(Dynamic r) {
        mR = getStringFromDynamic(r);
        invalidate();
    }

    @Override
    Path getPath(Canvas canvas, Paint paint) {
        Path path = new Path();

        double cx = relativeOnWidth(mCx);
        double cy = relativeOnHeight(mCy);

        double r;
        if (PropHelper.isPercentage(mR)) {
            r = relativeOnOther(mR);
        } else {
            r = Double.parseDouble(mR) * mScale;
        }

        path.addCircle((float) cx, (float) cy, (float) r, Path.Direction.CW);
        return path;
    }
}
