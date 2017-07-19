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
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Shadow node for virtual Circle view
 */
public class CircleShadowNode extends RenderableShadowNode {

    /*
        N[1/Sqrt[2], 36]
        The inverse of the square root of 2.
        Provide enough digits for the 128-bit IEEE quad (36 significant digits).
    */
    private static final double M_SQRT1_2l = 0.707106781186547524400844362104849039;

    private String mCx;
    private String mCy;
    private String mR;

    @ReactProp(name = "cx")
    public void setCx(String cx) {
        mCx = cx;
        markUpdated();
    }

    @ReactProp(name = "cy")
    public void setCy(String cy) {
        mCy = cy;
        markUpdated();
    }

    @ReactProp(name = "r")
    public void setR(String r) {
        mR = r;
        markUpdated();
    }

    @Override
    protected Path getPath(Canvas canvas, Paint paint) {
        Path path = new Path();

        float cx = relativeOnWidth(mCx);
        float cy = relativeOnHeight(mCy);

        float r;
        if (PropHelper.isPercentage(mR)) {
            r = PropHelper.fromRelativeToFloat(mR, 1, 0, 1, paint.getTextSize());
            double powX = Math.pow((getCanvasWidth() * r), 2);
            double powY = Math.pow((getCanvasHeight() * r), 2);
            r = (float) (Math.sqrt(powX + powY) * M_SQRT1_2l);
        } else {
            r =  Float.parseFloat(mR) * mScale;
        }

        path.addCircle(cx, cy, r, Path.Direction.CW);
        return path;
    }
}
