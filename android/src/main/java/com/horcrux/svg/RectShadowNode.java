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
 * Shadow node for virtual Rect view
 */
class RectShadowNode extends RenderableShadowNode {

    private String mX;
    private String mY;
    private String mW;
    private String mH;
    private String mRx;
    private String mRy;


    @ReactProp(name = "x")
    public void setX(Dynamic x) {
        if (x.getType() == ReadableType.String) {
            mX = x.asString();
        } else {
            mX = String.valueOf(x.asDouble());
        }
        markUpdated();
    }

    @ReactProp(name = "y")
    public void setY(Dynamic y) {
        if (y.getType() == ReadableType.String) {
            mY = y.asString();
        } else {
            mY = String.valueOf(y.asDouble());
        }
        markUpdated();
    }

    @ReactProp(name = "width")
    public void setWidth(Dynamic width) {
        if (width.getType() == ReadableType.String) {
            mW = width.asString();
        } else {
            mW = String.valueOf(width.asDouble());
        }
        markUpdated();
    }

    @ReactProp(name = "height")
    public void setHeight(Dynamic height) {
        if (height.getType() == ReadableType.String) {
            mH = height.asString();
        } else {
            mH = String.valueOf(height.asDouble());
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
        double x = relativeOnWidth(mX);
        double y = relativeOnHeight(mY);
        double w = relativeOnWidth(mW);
        double h = relativeOnHeight(mH);
        double rx = relativeOnWidth(mRx);
        double ry = relativeOnHeight(mRy);

        if (rx != 0 || ry != 0) {
            if (rx == 0) {
                rx = ry;
            } else if (ry == 0) {
                ry = rx;
            }

            if (rx > w / 2) {
                rx = w / 2;
            }

            if (ry > h / 2) {
                ry = h / 2;
            }
            path.addRoundRect(new RectF((float) x, (float) y, (float) (x + w), (float) (y + h)), (float) rx, (float) ry, Path.Direction.CW);
        } else {
            path.addRect((float) x, (float) y, (float) (x + w), (float) (y + h), Path.Direction.CW);
        }
        return path;
    }
}
