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
import android.graphics.Rect;
import android.graphics.RectF;
import android.util.Log;

import com.facebook.common.logging.FLog;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

/**
 * Shadow node for virtual RNSVGPath view
 */
public class RNSVGCircleShadowNode extends RNSVGPathShadowNode {

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
    public void draw(Canvas canvas, Paint paint, float opacity) {
        mPath = getPath(canvas, paint);
        super.draw(canvas, paint, opacity);
    }

    @Override
    protected Path getPath(Canvas canvas, Paint paint) {
        Path path = new Path();

        Rect box = canvas.getClipBounds();
        float height = box.height();
        float width = box.width();

        float cx = PropHelper.fromPercentageToFloat(mCx, width, 0, mScale);
        float cy = PropHelper.fromPercentageToFloat(mCy, height, 0, mScale);

        float r;
        if (PropHelper.isPercentage(mR)) {
            r = PropHelper.fromPercentageToFloat(mR, 1, 0, 1);
            float powX = (float)Math.pow((width * r), 2);
            float powY = (float)Math.pow((height * r), 2);
            r = (float)Math.sqrt(powX + powY) / (float)Math.sqrt(2);
        } else {
            r =  Float.parseFloat(mR) * mScale;
        }

        path.addCircle(cx, cy, r, Path.Direction.CW);
        return path;
    }
}
