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
import android.graphics.DashPathEffect;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Point;
import android.graphics.RadialGradient;
import android.graphics.Rect;
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
    private @Nullable ReadableArray mStrokeColor;
    private @Nullable ReadableArray mFillColor;
    private @Nullable float[] mStrokeDasharray;
    private float mStrokeWidth = 1;
    private float mStrokeDashoffset = 0;
    private int mStrokeLinecap = CAP_ROUND;
    private int mStrokeLinejoin = JOIN_ROUND;
    private int mFillRule = FILL_RULE_NONZERO;
    private boolean mFillRuleSet;
    protected Path mPath;
    private boolean mPathSet;
    private float[] mD;
    protected RectF mContentBoundingBox;
    private Point mPaint;

    @ReactProp(name = "d")
    public void setPath(@Nullable ReadableArray shapePath) {
        mD = PropHelper.toFloatArray(shapePath);
        mPathSet = true;
        setupPath();
        markUpdated();
    }

    @ReactProp(name = "fill")
    public void setFill(@Nullable ReadableArray fillColors) {
        mFillColor = fillColors;
        markUpdated();
    }


    @ReactProp(name = "fillRule", defaultInt = FILL_RULE_NONZERO)
    public void setFillRule(int fillRule) {
        mFillRule = fillRule;
        mFillRuleSet = true;
        setupPath();
        markUpdated();
    }

    @ReactProp(name = "stroke")
    public void setStroke(@Nullable ReadableArray strokeColors) {
        mStrokeColor = strokeColors;
        markUpdated();
    }

    @ReactProp(name = "strokeDasharray")
    public void setStrokeDasharray(@Nullable ReadableArray strokeDasharray) {

        mStrokeDasharray = PropHelper.toFloatArray(strokeDasharray);
        if (mStrokeDasharray != null && mStrokeDasharray.length > 0) {
            for (int i = 0; i < mStrokeDasharray.length; i++) {
                mStrokeDasharray[i] = mStrokeDasharray[i] * mScale;
            }
        }
        markUpdated();
    }

    @ReactProp(name = "strokeDashoffset", defaultFloat = 0f)
    public void setStrokeDashoffset(float strokeWidth) {
        mStrokeDashoffset = strokeWidth * mScale;
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

            if (setupFillPaint(paint, opacity, null)) {
                canvas.drawPath(mPath, paint);
            }
            if (setupStrokePaint(paint, opacity, null)) {
                canvas.drawPath(mPath, paint);
            }

            restoreCanvas(canvas);
        }
        markUpdateSeen();
    }

    private void setupPath() {
        // init path after both fillRule and path have been set
        if (mFillRuleSet && mPathSet) {
            mPath = getPath(null);
            RectF box = new RectF();
            mPath.computeBounds(box, true);
            mContentBoundingBox = box;
        }
    }

  /**
   * sorting stops and stopsColors from array
   */
    private static void parseGradientStops(ReadableArray value, int stopsCount, float[] stops, int[] stopsColors, int startColorsPosition) {
        int startStops = value.size() - stopsCount;
        for (int i = 0; i < stopsCount; i++) {
            stops[i] = (float)value.getDouble(startStops + i);
            stopsColors[i] = Color.argb(
                    (int) (value.getDouble(startColorsPosition + i * 4 + 3) * 255),
                    (int) (value.getDouble(startColorsPosition + i * 4) * 255),
                    (int) (value.getDouble(startColorsPosition + i * 4 + 1) * 255),
                    (int) (value.getDouble(startColorsPosition + i * 4 + 2) * 255));

        }
    }


    /**
     * Sets up {@link #mPaint} according to the props set on a shadow view. Returns {@code true}
     * if the fill should be drawn, {@code false} if not.
     */
    protected boolean setupFillPaint(Paint paint, float opacity, @Nullable RectF box) {
        if (mFillColor != null && mFillColor.size() > 0) {
            paint.reset();
            paint.setFlags(Paint.ANTI_ALIAS_FLAG);
            paint.setStyle(Paint.Style.FILL);
            setupPaint(paint, opacity, mFillColor, box);
            return true;
        }
        return false;
    }

    /**
     * Sets up {@link #mPaint} according to the props set on a shadow view. Returns {@code true}
     * if the stroke should be drawn, {@code false} if not.
     */
    protected boolean setupStrokePaint(Paint paint, float opacity, @Nullable  RectF box) {
        if (mStrokeWidth == 0 || mStrokeColor == null || mStrokeColor.size() == 0) {
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
        setupPaint(paint, opacity, mStrokeColor, box);

        if (mStrokeDasharray != null && mStrokeDasharray.length > 0) {
            paint.setPathEffect(new DashPathEffect(mStrokeDasharray, mStrokeDashoffset));
        }

        return true;
    }


    private void setupPaint(Paint paint, float opacity, ReadableArray colors, @Nullable RectF box) {
        int colorType = colors.getInt(0);
        if (colorType == 0) {
            // solid color
            paint.setARGB(
                (int) (colors.size() > 4 ? colors.getDouble(4) * opacity * 255 : opacity * 255),
                (int) (colors.getDouble(1) * 255),
                (int) (colors.getDouble(2) * 255),
                (int) (colors.getDouble(3) * 255));
        } else if (colorType == 1 || colorType == 2) {
            if (box == null) {
                box = mContentBoundingBox;
            }

            int startColorsPosition = colorType == 1 ? 5 : 7;

            int stopsCount = (colors.size() - startColorsPosition) / 5;
            int [] stopsColors = new int [stopsCount];
            float [] stops = new float[stopsCount];
            float height = box.height();
            float width = box.width();
            float midX = box.centerX();
            float midY = box.centerY();
            float offsetX = (midX - width / 2);
            float offsetY = (midY - height / 2);

            parseGradientStops(colors, stopsCount, stops, stopsColors, startColorsPosition);

            if (colorType == 1) {
                float x1 = PropHelper.fromPercentageToFloat(colors.getString(1), width, offsetX, mScale);
                float y1 = PropHelper.fromPercentageToFloat(colors.getString(2), height, offsetY, mScale);
                float x2 = PropHelper.fromPercentageToFloat(colors.getString(3), width, offsetX, mScale);
                float y2 = PropHelper.fromPercentageToFloat(colors.getString(4), height, offsetY, mScale);
                paint.setShader(
                    new LinearGradient(
                        x1,
                        y1,
                        x2,
                        y2,
                        stopsColors,
                        stops,
                        Shader.TileMode.CLAMP));
            } else {
                float rx = PropHelper.fromPercentageToFloat(colors.getString(3), width, 0f, mScale);
                float ry = PropHelper.fromPercentageToFloat(colors.getString(4), height, 0f, mScale);
                float cx = PropHelper.fromPercentageToFloat(colors.getString(5), width, offsetX, mScale);
                float cy = PropHelper.fromPercentageToFloat(colors.getString(6), height, offsetY, mScale) / (ry / rx);
                // TODO: do not support focus point.
                float fx = PropHelper.fromPercentageToFloat(colors.getString(1), width, offsetX, mScale);
                float fy = PropHelper.fromPercentageToFloat(colors.getString(2), height, offsetY, mScale) / (ry / rx);
                Shader radialGradient = new RadialGradient(
                    cx,
                    cy,
                    rx,
                    stopsColors,
                    stops,
                    Shader.TileMode.CLAMP
                );

                Matrix radialMatrix = new Matrix();
                radialMatrix.preScale(1f, ry / rx);
                radialGradient.setLocalMatrix(radialMatrix);
                paint.setShader(radialGradient);
            }
        } else {
            // TODO: Support pattern.
            FLog.w(ReactConstants.TAG, "RNSVG: Color type " + colorType + " not supported!");
        }
    }

    protected Path getPath(@Nullable Canvas canvas) {
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
        super.createPath(mD, path);
        return path;
    }
}
