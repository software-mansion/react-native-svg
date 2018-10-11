/*
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.graphics.Matrix;
import android.graphics.RectF;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

/**
 * Shadow node for virtual Pattern definition view
 */
class PatternShadowNode extends GroupShadowNode {

    private String mX;
    private String mY;
    private String mWidth;
    private String mHeight;
    private Brush.BrushUnits mPatternUnits;
    private Brush.BrushUnits mPatternContentUnits;

    private float mMinX;
    private float mMinY;
    private float mVbWidth;
    private float mVbHeight;
    String mAlign;
    int mMeetOrSlice;

    private static final float[] sRawMatrix = new float[]{
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    };
    private Matrix mMatrix = null;

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
            mWidth = width.asString();
        } else {
            mWidth = String.valueOf(width.asDouble());
        }
        markUpdated();
    }

    @ReactProp(name = "height")
    public void setHeight(Dynamic height) {
        if (height.getType() == ReadableType.String) {
            mHeight = height.asString();
        } else {
            mHeight = String.valueOf(height.asDouble());
        }
        markUpdated();
    }

    @ReactProp(name = "patternUnits")
    public void setPatternUnits(int patternUnits) {
        switch (patternUnits) {
            case 0:
                mPatternUnits = Brush.BrushUnits.OBJECT_BOUNDING_BOX;
                break;
            case 1:
                mPatternUnits = Brush.BrushUnits.USER_SPACE_ON_USE;
                break;
        }
        markUpdated();
    }

    @ReactProp(name = "patternContentUnits")
    public void setPatternContentUnits(int patternContentUnits) {
        switch (patternContentUnits) {
            case 0:
                mPatternContentUnits = Brush.BrushUnits.OBJECT_BOUNDING_BOX;
                break;
            case 1:
                mPatternContentUnits = Brush.BrushUnits.USER_SPACE_ON_USE;
                break;
        }
        markUpdated();
    }

    @ReactProp(name = "patternTransform")
    public void setPatternTransform(@Nullable ReadableArray matrixArray) {
        if (matrixArray != null) {
            int matrixSize = PropHelper.toMatrixData(matrixArray, sRawMatrix, mScale);
            if (matrixSize == 6) {
                if (mMatrix == null) {
                    mMatrix = new Matrix();
                }
                mMatrix.setValues(sRawMatrix);
            } else if (matrixSize != -1) {
                FLog.w(ReactConstants.TAG, "RNSVG: Transform matrices must be of size 6");
            }
        } else {
            mMatrix = null;
        }

        markUpdated();
    }

    @ReactProp(name = "minX")
    public void setMinX(float minX) {
        mMinX = minX;
        markUpdated();
    }

    @ReactProp(name = "minY")
    public void setMinY(float minY) {
        mMinY = minY;
        markUpdated();
    }

    @ReactProp(name = "vbWidth")
    public void setVbWidth(float vbWidth) {
        mVbWidth = vbWidth;
        markUpdated();
    }

    @ReactProp(name = "vbHeight")
    public void setVbHeight(float vbHeight) {
        mVbHeight = vbHeight;
        markUpdated();
    }

    @ReactProp(name = "align")
    public void setAlign(String align) {
        mAlign = align;
        markUpdated();
    }

    @ReactProp(name = "meetOrSlice")
    public void setMeetOrSlice(int meetOrSlice) {
        mMeetOrSlice = meetOrSlice;
        markUpdated();
    }


    RectF getViewBox() {
        return new RectF(mMinX * mScale, mMinY * mScale, (mMinX + mVbWidth) * mScale, (mMinY + mVbHeight) * mScale);
    }

    @Override
    protected void saveDefinition() {
        if (mName != null) {
            WritableArray points = Arguments.createArray();
            points.pushString(mX);
            points.pushString(mY);
            points.pushString(mWidth);
            points.pushString(mHeight);

            Brush brush = new Brush(Brush.BrushType.PATTERN, points, mPatternUnits);
            brush.setContentUnits(mPatternContentUnits);
            brush.setPattern(this);

            if (mMatrix != null) {
                brush.setGradientTransform(mMatrix);
            }

            SvgViewShadowNode svg = getSvgShadowNode();
            if (mPatternUnits == Brush.BrushUnits.USER_SPACE_ON_USE || mPatternContentUnits == Brush.BrushUnits.USER_SPACE_ON_USE) {
                brush.setUserSpaceBoundingBox(svg.getCanvasBounds());
            }

            svg.defineBrush(brush, mName);
        }
    }
}
