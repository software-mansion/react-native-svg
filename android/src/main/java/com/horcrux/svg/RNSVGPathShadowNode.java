/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
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

    private static final int RULE_EVENODD = 0;
    private static final int RULE_NONZERO = 1;

    private static final int PATH_TYPE_ARC = 4;
    private static final int PATH_TYPE_CLOSE = 1;
    private static final int PATH_TYPE_CURVETO = 3;
    private static final int PATH_TYPE_LINETO = 2;
    private static final int PATH_TYPE_MOVETO = 0;

    protected @Nullable Path mPath;
    private @Nullable float[] mStrokeColor;
    private @Nullable float[] mFillColor;
    private @Nullable float[] mStrokeDash;
    private float mStrokeWidth = 1;
    private int mStrokeLinecap = CAP_ROUND;
    private int mStrokeLinejoin = JOIN_ROUND;
    private int mFillRule = RULE_NONZERO;

    private Point mPaint;

    @ReactProp(name = "d")
    public void setPath(@Nullable ReadableArray shapePath) {
        float[] pathData = PropHelper.toFloatArray(shapePath);
        mPath = createPath(pathData);
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


    @ReactProp(name = "fillRule", defaultInt = RULE_NONZERO)
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

                    // TODO:
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
                    float [] rawMatrix = new float[9];
                    rawMatrix[0] = 1;
                    rawMatrix[1] = 0;
                    rawMatrix[2] = 0;
                    rawMatrix[3] = 0;
                    rawMatrix[4] = radiusRatio;
                    rawMatrix[5] = 0;
                    rawMatrix[6] = 0;
                    rawMatrix[7] = 0;
                    rawMatrix[8] = 1;

                    radialMatrix.setValues(rawMatrix);
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

    /**
     * Creates a {@link Path} from an array of instructions constructed by JS
     * (see RNSVGSerializablePath.js). Each instruction starts with a type (see PATH_TYPE_*) followed
     * by arguments for that instruction. For example, to create a line the instruction will be
     * 2 (PATH_LINE_TO), x, y. This will draw a line from the last draw point (or 0,0) to x,y.
     *
     * @param data the array of instructions
     * @return the {@link Path} that can be drawn to a canvas
     */
    private Path createPath(float[] data) {
        Path path = new Path();
        switch (mFillRule) {
            case RULE_EVENODD:
                path.setFillType(Path.FillType.EVEN_ODD);
                break;
            case RULE_NONZERO:
                //path.setFillType(Path.FillType.INVERSE_WINDING);
                break;
            default:
                throw new JSApplicationIllegalArgumentException(
                    "fillRule " + mFillRule + " unrecognized");
        }

        path.moveTo(0, 0);
        int i = 0;
        while (i < data.length) {
            int type = (int) data[i++];
            switch (type) {
                case PATH_TYPE_MOVETO:
                    path.moveTo(data[i++] * mScale, data[i++] * mScale);
                    break;
                case PATH_TYPE_CLOSE:
                    path.close();
                    break;
                case PATH_TYPE_LINETO:
                    path.lineTo(data[i++] * mScale, data[i++] * mScale);
                    break;
                case PATH_TYPE_CURVETO:
                    path.cubicTo(
                        data[i++] * mScale,
                        data[i++] * mScale,
                        data[i++] * mScale,
                        data[i++] * mScale,
                        data[i++] * mScale,
                        data[i++] * mScale);
                    break;
                case PATH_TYPE_ARC:
                {
                    float x = data[i++] * mScale;
                    float y = data[i++] * mScale;
                    float r = data[i++] * mScale;
                    float start = (float) Math.toDegrees(data[i++]);
                    float end = (float) Math.toDegrees(data[i++]);
                    boolean clockwise = data[i++] == 0f;
                    if (!clockwise) {
                        end = 360 - end;
                    }
                    float sweep = start - end;
                    RectF oval = new RectF(x - r, y - r, x + r, y + r);
                    path.addArc(oval, start, sweep);
                    break;
                }
                default:
                    throw new JSApplicationIllegalArgumentException(
                        "Unrecognized drawing instruction " + type);
            }
        }
        return path;
    }
}
