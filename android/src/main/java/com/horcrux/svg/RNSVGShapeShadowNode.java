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
public class RNSVGShapeShadowNode extends RNSVGPathShadowNode {

    protected ReadableMap mShape;

    @ReactProp(name = "shape")
    public void setShape(@Nullable ReadableMap shape) {
        mShape = shape;
        markUpdated();
    }

    @Override
    public void draw(Canvas canvas, Paint paint, float opacity) {

        if (mShape != null) {
            int type = mShape.getInt("type");
            Rect box = canvas.getClipBounds();
            float height = box.height();
            float width = box.width();
            mPath = new Path();

            switch (type) {
                case 0: {
                    // draw circle
                    // TODO:
                    float cx = getActualProp("cx", width);
                    float cy = getActualProp("cy", height);

                    float r;
                    ReadableMap value = mShape.getMap("r");
                    if (value.getBoolean("percentage")) {
                        float percent = (float)value.getDouble("value");
                        float powX = (float)Math.pow((width * percent), 2);
                        float powY = (float)Math.pow((height*percent), 2);
                        r = (float)Math.sqrt(powX + powY) / (float)Math.sqrt(2);
                    } else {
                        r =  (float)value.getDouble("value") * mScale;
                    }

                    mPath.addCircle(cx, cy, r, Path.Direction.CW);
                    break;
                }
                case 1: {
                    // draw ellipse
                    float cx = getActualProp("cx", width);
                    float cy = getActualProp("cy", height);
                    float rx = getActualProp("rx", width);
                    float ry = getActualProp("ry", height);
                    RectF oval = new RectF(cx - rx, cy - ry, cx + rx, cy + ry);
                    mPath.addOval(oval, Path.Direction.CW);
                    break;
                }
                case 2: {
                    // draw line
                    float x1 = getActualProp("x1", width);
                    float y1 = getActualProp("y1", height);
                    float x2 = getActualProp("x2", width);
                    float y2 = getActualProp("y2", height);
                    mPath.moveTo(x1, y1);
                    mPath.lineTo(x2, y2);
                    break;
                }
                case 3: {
                    // draw rect
                    float x = getActualProp("x", width);
                    float y = getActualProp("y", height);
                    float w = getActualProp("width", width);
                    float h = getActualProp("height", height);
                    float rx = getActualProp("rx", width);
                    float ry = getActualProp("ry", height);

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
                        mPath.addRoundRect(new RectF(x, y, x + w, y + h), rx, ry, Path.Direction.CW);
                    } else {
                        mPath.addRect(x, y, x + w, y + h,  Path.Direction.CW);
                    }
                    break;
                }
                default:
                    FLog.e(ReactConstants.TAG, "RNSVG: Invalid Shape type " + type + " at " + mShape);
            }

            RectF shapeBox = new RectF();
            mPath.computeBounds(shapeBox, true);
            mContentBoundingBox = shapeBox;
            super.draw(canvas, paint, opacity);
        }
    }

    private float getActualProp(String name, float relative) {
        if (mShape.hasKey(name)) {
            ReadableMap value = mShape.getMap(name);

            if (value.getBoolean("percentage")) {
                return (float)value.getDouble("value") * relative;
            } else {
                return (float)value.getDouble("value") * mScale;
            }
        } else {
            return 0f;
        }
    }
}
