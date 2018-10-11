/*
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.graphics.Matrix;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

/**
 * Shadow node for virtual Mask definition view
 */
class MaskShadowNode extends GroupShadowNode {

    String mX;
    String mY;
    String mWidth;
    String mHeight;
    Brush.BrushUnits mMaskUnits;
    Brush.BrushUnits mMaskContentUnits;

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

    @ReactProp(name = "maskUnits")
    public void setMaskUnits(int maskUnits) {
        switch (maskUnits) {
            case 0:
                mMaskUnits = Brush.BrushUnits.OBJECT_BOUNDING_BOX;
                break;
            case 1:
                mMaskUnits = Brush.BrushUnits.USER_SPACE_ON_USE;
                break;
        }
        markUpdated();
    }

    @ReactProp(name = "maskContentUnits")
    public void setMaskContentUnits(int maskContentUnits) {
        switch (maskContentUnits) {
            case 0:
                mMaskContentUnits = Brush.BrushUnits.OBJECT_BOUNDING_BOX;
                break;
            case 1:
                mMaskContentUnits = Brush.BrushUnits.USER_SPACE_ON_USE;
                break;
        }
        markUpdated();
    }

    @ReactProp(name = "maskTransform")
    public void setMaskTransform(@Nullable ReadableArray matrixArray) {
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

    @Override
    protected void saveDefinition() {
        if (mName != null) {
            SvgViewShadowNode svg = getSvgShadowNode();
            svg.defineMask(this, mName);
        }
    }
}
