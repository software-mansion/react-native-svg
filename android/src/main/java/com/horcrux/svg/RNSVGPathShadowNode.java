/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import javax.annotation.Nullable;

import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Point;
import android.graphics.RadialGradient;
import android.graphics.RectF;

import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Region;
import android.graphics.Shader;
import android.graphics.Matrix;
import android.util.Log;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Shadow node for virtual RNSVGPath view
 */
public class RNSVGPathShadowNode extends RNSVGVirtualNode {

    private static final int CAP_BUTT = 0;
    private static final int CAP_ROUND = 1;
    private static final int CAP_SQUARE = 2;

    private static final int JOIN_BEVEL = 2;
    private static final int JOIN_MITER = 0;
    private static final int JOIN_ROUND = 1;

    private static final int FILL_RULE_EVENODD = 0;
    private static final int FILL_RULE_NONZERO = 1;

    protected @Nullable Path mPath;
    private @Nullable float[] mStrokeColor;
    private @Nullable float[] mFillColor;
    private @Nullable float[] mStrokeDash;
    private float mStrokeWidth = 1;
    private int mStrokeLinecap = CAP_ROUND;
    private int mStrokeLinejoin = JOIN_ROUND;
    private int mFillRule = FILL_RULE_NONZERO;

    private Point mPaint;

    @ReactProp(name = "d")
    public void setPath(@Nullable ReadableArray shapePath) {
        float[] pathData = PropHelper.toFloatArray(shapePath);
        Path path = new Path();
        switch (mFillRule) {
            case FILL_RULE_EVENODD:
                path.setFillType(Path.FillType.EVEN_ODD);
                break;
            case FILL_RULE_NONZERO:
                break;
            default:
                throw new JSApplicationIllegalArgumentException(
                    "fillRule " + mFillRule + " unrecognized");
        }

        mPath = super.createPath(pathData, path);
        markUpdated();
    }

    @ReactProp(name = "stroke")
    public void setStroke(@Nullable ReadableArray strokeColors) {
        mStrokeColor = PropHelper.toFloatArray(strokeColors);
        markUpdated();
    }

    @ReactProp(name = "strokeDash")
    public void setStrokeDash(@Nullable ReadableArray strokeDash) {
        mStrokeDash = PropHelper.toFloatArray(strokeDash);
        markUpdated();
    }

    @ReactProp(name = "fill")
    public void setFill(@Nullable ReadableArray fillColors) {
        mFillColor = PropHelper.toFloatArray(fillColors);
        markUpdated();
    }


    @ReactProp(name = "fillRule", defaultInt = FILL_RULE_NONZERO)
    public void setFillRule(int fillRule) {
        mFillRule = fillRule;
        markUpdated();
    }

    @ReactProp(name = "strokeWidth", defaultFloat = 1f)
    public void setStrokeWidth(float strokeWidth) {
        mStrokeWidth = strokeWidth;
        markUpdated();
    }

    @ReactProp(name = "strokeLinecap", defaultInt = CAP_ROUND)
    public void setStrokeLinecap(int strokeLinecap) {
        mStrokeLinecap = strokeLinecap;
        markUpdated();
    }

    @ReactProp(name = "strokeLinejoin", defaultInt = JOIN_ROUND)
    public void setStrokeLinejoin(int strokeLinejoin) {
        mStrokeLinejoin = strokeLinejoin;
        markUpdated();
    }

    @Override
    public void draw(Canvas canvas, Paint paint, float opacity) {
        opacity *= mOpacity;
        if (opacity > MIN_OPACITY_FOR_DRAW) {
            saveAndSetupCanvas(canvas);
            if (mPath == null) {
                throw new JSApplicationIllegalArgumentException(
                    "Paths should have a valid path (d) prop");
            }

            clip(canvas, paint);

            if (setupFillPaint(paint, opacity)) {
                canvas.drawPath(mPath, paint);
            }
            if (setupStrokePaint(paint, opacity)) {
                canvas.drawPath(mPath, paint);
            }

            restoreCanvas(canvas);
        }
        markUpdateSeen();
    }

    /**
     * Sets up {@link #mPaint} according to the props set on a shadow view. Returns {@code true}
     * if the stroke should be drawn, {@code false} if not.
     */
    protected boolean setupStrokePaint(Paint paint, float opacity) {
        if (mStrokeWidth == 0 || mStrokeColor == null || mStrokeColor.length == 0) {
            return false;
        }
        paint.reset();
        paint.setFlags(Paint.ANTI_ALIAS_FLAG);
        paint.setStyle(Paint.Style.STROKE);
        switch (mStrokeLinecap) {
            case CAP_BUTT:
                paint.setStrokeCap(Paint.Cap.BUTT);
                break;
            case CAP_SQUARE:
                paint.setStrokeCap(Paint.Cap.SQUARE);
                break;
            case CAP_ROUND:
                paint.setStrokeCap(Paint.Cap.ROUND);
                break;
            default:
                throw new JSApplicationIllegalArgumentException(
                    "strokeLinecap " + mStrokeLinecap + " unrecognized");
        }
        switch (mStrokeLinejoin) {
            case JOIN_MITER:
                paint.setStrokeJoin(Paint.Join.MITER);
                break;
            case JOIN_BEVEL:
                paint.setStrokeJoin(Paint.Join.BEVEL);
                break;
            case JOIN_ROUND:
                paint.setStrokeJoin(Paint.Join.ROUND);
                break;
            default:
                throw new JSApplicationIllegalArgumentException(
                    "strokeLinejoin " + mStrokeLinejoin + " unrecognized");
        }

        paint.setStrokeWidth(mStrokeWidth * mScale);
        paint.setARGB(
            (int) (mStrokeColor.length > 3 ? mStrokeColor[3] * opacity * 255 : opacity * 255),
            (int) (mStrokeColor[0] * 255),
            (int) (mStrokeColor[1] * 255),
            (int) (mStrokeColor[2] * 255));
        if (mStrokeDash != null && mStrokeDash.length > 0) {
            // TODO(6352067): Support dashes
            FLog.w(ReactConstants.TAG, "RNSVG: Dashes are not supported yet!");
        }

        return true;
    }

    /*
   * sorting stops and stopsColors from array
   */
    private static void parseGradientStops(float[] value, int stopsCount, float[] stops, int[] stopsColors, int startColorsPosition) {
        int startStops = value.length - stopsCount;
        for (int i = 0; i < stopsCount; i++) {
            int half = stopsCount / 2;

            // stops keep in a order like this
            // 0 1 2 3 4 9 8 7 6 5

            stops[i] = value[startStops + (i < half ? i : (half + (stopsCount - i) - 1))];

            stopsColors[i] = Color.argb(
                    (int) (value[startColorsPosition + i * 4 + 3] * 255),
                    (int) (value[startColorsPosition + i * 4] * 255),
                    (int) (value[startColorsPosition + i * 4 + 1] * 255),
                    (int) (value[startColorsPosition + i * 4 + 2] * 255));

        }
    }


    /**
     * Sets up {@link #mPaint} according to the props set on a shadow view. Returns {@code true}
     * if the fill should be drawn, {@code false} if not.
     */
    protected boolean setupFillPaint(Paint paint, float opacity) {
        int stopsCount;
        int [] stopsColors;
        float [] stops;
        if (mFillColor != null && mFillColor.length > 0) {
            paint.reset();
            paint.setFlags(Paint.ANTI_ALIAS_FLAG);
            paint.setStyle(Paint.Style.FILL);
            int colorType = (int) mFillColor[0];
            switch (colorType) {
                case 0:
                    paint.setARGB(
                        (int) (mFillColor.length > 4 ? mFillColor[4] * opacity * 255 : opacity * 255),
                        (int) (mFillColor[1] * 255),
                        (int) (mFillColor[2] * 255),
                        (int) (mFillColor[3] * 255));
                    break;
                case 1:
                    stopsCount = (mFillColor.length - 5) / 5;
                    stopsColors = new int [stopsCount];
                    stops = new float[stopsCount];

                    parseGradientStops(mFillColor, stopsCount, stops, stopsColors, 5);
                    paint.setShader(
                        new LinearGradient(
                            mFillColor[1] * mScale,
                            mFillColor[2] * mScale,
                            mFillColor[3] * mScale,
                            mFillColor[4] * mScale,
                            stopsColors,
                            stops,
                            Shader.TileMode.CLAMP));
                    break;
                case 2:
                    stopsCount = (mFillColor.length - 7) / 5;
                    stopsColors = new int [stopsCount];
                    stops = new float[stopsCount];
                    parseGradientStops(mFillColor, stopsCount, stops, stopsColors, 7);

                    // TODO: support focus
                    float focusX = mFillColor[1];
                    float focusY = mFillColor[2];

                    float radius = mFillColor[3];
                    float radiusRatio = mFillColor[4] / radius;
                    Shader radialGradient = new RadialGradient(
                        mFillColor[5] * mScale,
                        mFillColor[6] * mScale / radiusRatio,
                        radius * mScale,
                        stopsColors,
                        stops,
                        Shader.TileMode.CLAMP
                    );

                    Matrix radialMatrix = new Matrix();

                    // seems like a bug here?
                    radialMatrix.preScale(1f, radiusRatio);
                    radialGradient.setLocalMatrix(radialMatrix);
                    paint.setShader(radialGradient);
                    break;
                default:
                    // TODO: Support pattern.
                    FLog.w(ReactConstants.TAG, "RNSVG: Color type " + colorType + " not supported!");
            }
            return true;
        }
        return false;
    }
}
