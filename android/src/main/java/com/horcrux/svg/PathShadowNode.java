/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import javax.annotation.Nullable;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.DashPathEffect;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Point;
import android.graphics.RectF;

import android.graphics.Color;
import android.util.Log;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.JavaOnlyArray;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Shadow node for virtual RNSVGPath view
 */
public class PathShadowNode extends RenderableShadowNode {

    private Path mPath;

    @ReactProp(name = "d")
    public void setD(String d) {
        PropHelper.PathParser parser = new PropHelper.PathParser(d, mScale);
        mPath = parser.getPath();
        markUpdated();
    }

    @Override
    protected Path getPath(Canvas canvas, Paint paint) {
        return mPath;
    }
}
