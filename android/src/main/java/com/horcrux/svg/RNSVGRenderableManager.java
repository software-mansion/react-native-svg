/*
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.graphics.Matrix;
import android.graphics.Path;
import android.graphics.PathMeasure;
import android.graphics.RectF;
import android.graphics.Region;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;

import javax.annotation.Nonnull;

class RNSVGRenderableManager extends ReactContextBaseJavaModule {
    RNSVGRenderableManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Nonnull
    @Override
    public String getName() {
        return "RNSVGRenderableManager";
    }

    private static void isPointInFill(final int tag, final float[] src, final Callback successCallback, final int attempt) {
        UiThreadUtil.runOnUiThread(
                new Runnable() {
                    @Override
                    public void run() {
                        RenderableView svg = RenderableViewManager.getRenderableViewByTag(tag);

                        if (svg == null) {
                            if (attempt < 1) {
                                RenderableViewManager.runWhenViewIsAvailable(tag, new Runnable() {
                                    @Override
                                    public void run() {
                                        RenderableView svg = RenderableViewManager.getRenderableViewByTag(tag);
                                        if (svg == null) { // Should never happen
                                            successCallback.invoke(false);
                                            return;
                                        }
                                        isPointInFill(tag, src, successCallback, attempt + 1);
                                    }
                                });
                            } else {
                                successCallback.invoke(false);
                            }
                        } else {
                            float scale = svg.mScale;
                            src[0] *= scale;
                            src[1] *= scale;
                            int i = svg.hitTest(src);
                            successCallback.invoke(i != -1);
                        }
                    }
                }
        );
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void isPointInFill(int tag, ReadableMap options, Callback successCallback) {
        float x = (float) options.getDouble("x");
        float y = (float) options.getDouble("y");
        float[] src = new float[]{x, y};
        isPointInFill(tag, src, successCallback, 0);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void isPointInStroke(int tag, ReadableMap options, Callback successCallback) {
        RenderableView svg = RenderableViewManager.getRenderableViewByTag(tag);
        if (svg == null) {
            successCallback.invoke(false);
            return;
        }
        svg.getPath(null, null);
        svg.initBounds();
        Region strokeRegion = svg.mStrokeRegion;
        float scale = svg.mScale;
        int x = (int) (options.getDouble("x") * scale);
        int y = (int) (options.getDouble("y") * scale);
        boolean hit = strokeRegion != null && strokeRegion.contains(x, y);
        successCallback.invoke(hit);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void getTotalLength(int tag, Callback successCallback) {
        RenderableView svg = RenderableViewManager.getRenderableViewByTag(tag);
        PathMeasure pm = new PathMeasure(svg.getPath(null, null), false);
        successCallback.invoke(pm.getLength());
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void getPointAtLength(int tag, ReadableMap options, Callback successCallback) {
        float length = (float) options.getDouble("length");
        RenderableView svg = RenderableViewManager.getRenderableViewByTag(tag);
        PathMeasure pm = new PathMeasure(svg.getPath(null, null), false);
        float pathLength = pm.getLength();
        float[] pos = new float[2];
        float[] tan = new float[2];
        pm.getPosTan(Math.max(0, Math.min(length, pathLength)), pos, tan);
        double angle = Math.atan2(tan[1], tan[0]);
        WritableMap result = Arguments.createMap();
        result.putDouble("x", pos[0]);
        result.putDouble("y", pos[1]);
        result.putDouble("angle", angle);
        successCallback.invoke(result);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void getBBox(int tag, ReadableMap options, Callback successCallback) {
        boolean fill = options.getBoolean("fill");
        boolean stroke = options.getBoolean("stroke");
        boolean markers = options.getBoolean("markers");
        boolean clipped = options.getBoolean("clipped");
        RenderableView svg = RenderableViewManager.getRenderableViewByTag(tag);
        Path path = svg.getPath(null, null);
        svg.initBounds();
        RectF bounds = new RectF();
        if (fill) {
            bounds.union(svg.mFillBounds);
        }
        if (stroke) {
            bounds.union(svg.mStrokeBounds);
        }
        if (markers) {
            bounds.union(svg.mMarkerBounds);
        }
        if (clipped) {
            RectF clipBounds = svg.mClipBounds;
            if (clipBounds != null) {
                bounds.intersect(svg.mClipBounds);
            }
        }
        WritableMap result = Arguments.createMap();
        result.putDouble("x", bounds.left);
        result.putDouble("y", bounds.top);
        result.putDouble("width", bounds.width());
        result.putDouble("height", bounds.height());
        successCallback.invoke(result);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void getCTM(int tag, Callback successCallback) {
        RenderableView svg = RenderableViewManager.getRenderableViewByTag(tag);
        Matrix screenCTM = svg.mCTM;
        Matrix invViewBox = svg.getSvgView().mInvViewBoxMatrix;
        Matrix ctm = new Matrix(screenCTM);
        ctm.preConcat(invViewBox);

        float[] values = new float[9];
        ctm.getValues(values);
        WritableMap result = Arguments.createMap();
        result.putDouble("a", values[Matrix.MSCALE_X]);
        result.putDouble("b", values[Matrix.MSKEW_Y]);
        result.putDouble("c", values[Matrix.MSKEW_X]);
        result.putDouble("d", values[Matrix.MSCALE_Y]);
        result.putDouble("e", values[Matrix.MTRANS_X]);
        result.putDouble("f", values[Matrix.MTRANS_Y]);
        successCallback.invoke(result);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void getScreenCTM(int tag, Callback successCallback) {
        RenderableView svg = RenderableViewManager.getRenderableViewByTag(tag);
        Matrix screenCTM = svg.mCTM;
        float[] values = new float[9];
        screenCTM.getValues(values);
        WritableMap result = Arguments.createMap();
        result.putDouble("a", values[Matrix.MSCALE_X]);
        result.putDouble("b", values[Matrix.MSKEW_Y]);
        result.putDouble("c", values[Matrix.MSKEW_X]);
        result.putDouble("d", values[Matrix.MSCALE_Y]);
        result.putDouble("e", values[Matrix.MTRANS_X]);
        result.putDouble("f", values[Matrix.MTRANS_Y]);
        successCallback.invoke(result);
    }
}
