/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.graphics.Color;
import android.graphics.Path;
import android.graphics.RectF;
import android.graphics.Paint;
import android.graphics.RadialGradient;
import android.graphics.LinearGradient;
import android.graphics.Shader;
import android.graphics.Matrix;
import android.util.Log;

import javax.annotation.Nullable;

import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.ReadableArray;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Contains static helper methods for accessing props.
 */
/* package */ class PropHelper {

    /**
     * Converts {@link ReadableArray} to an array of {@code float}. Returns newly created array.
     *
     * @return a {@code float[]} if converted successfully, or {@code null} if {@param value} was
     * {@code null}.
     */

    static
    @Nullable
    float[] toFloatArray(@Nullable ReadableArray value) {
        if (value != null) {
            float[] result = new float[value.size()];
            toFloatArray(value, result);
            return result;
        }
        return null;
    }

    /**
     * Converts given {@link ReadableArray} to an array of {@code float}. Writes result to the array
     * passed in {@param into}. This method will write to the output array up to the number of items
     * from the input array. If the input array is longer than output the remaining part of the input
     * will not be converted.
     *
     * @param value input array
     * @param into  output array
     * @return number of items copied from input to the output array
     */

    static int toFloatArray(ReadableArray value, float[] into) {
        int length = value.size() > into.length ? into.length : value.size();
        for (int i = 0; i < length; i++) {
            into[i] = (float) value.getDouble(i);
        }
        return value.size();

    }


    /**
     * Converts percentage string into actual based on a relative number
     *
     * @param percentage percentage string
     * @param relative   relative number
     * @param offset     offset number
     * @return actual float based on relative number
     */

    static float fromPercentageToFloat(String percentage, float relative, float offset, float scale) {
        Matcher matched = Pattern.compile("^(\\-?\\d+(?:\\.\\d+)?)%$").matcher(percentage);
        if (matched.matches()) {
            return Float.valueOf(matched.group(1)) / 100 * relative + offset;
        } else {
            return Float.valueOf(percentage) * scale;
        }
    }

    /**
     * Judge given string is a percentage-like string or not.
     *
     * @param string percentage string
     * @return string is percentage-like or not.
     */


    static boolean isPercentage(String string) {
        Pattern pattern = Pattern.compile("^(\\-?\\d+(?:\\.\\d+)?)%$");
        return pattern.matcher(string).matches();
    }

    /**
     *
     */
    static class RNSVGBrush {

        private GradientType mType = GradientType.LINEAR_GRADIENT;
        private ReadableArray mPoints;
        private ReadableArray mColors;

        public RNSVGBrush(GradientType type, ReadableArray points, ReadableArray colors) {
            mType = type;
            mPoints = points;
            mColors = colors;
        }

        public enum GradientType {
            LINEAR_GRADIENT(0),
            RADIAL_GRADIENT(1);

            GradientType(int ni) {
                nativeInt = ni;
            }

            final int nativeInt;
        }

        private static void parseGradientStops(ReadableArray value, int stopsCount, float[] stops, int[] stopsColors, float opacity) {
            int startStops = value.size() - stopsCount;
            for (int i = 0; i < stopsCount; i++) {
                stops[i] = (float) value.getDouble(startStops + i);
                stopsColors[i] = Color.argb(
                        (int) (value.getDouble(i * 4 + 3) * 255 * opacity),
                        (int) (value.getDouble(i * 4) * 255),
                        (int) (value.getDouble(i * 4 + 1) * 255),
                        (int) (value.getDouble(i * 4 + 2) * 255));

            }
        }

        public void setupPaint(Paint paint, RectF box, float scale, float opacity) {
            float height = box.height();
            float width = box.width();
            float midX = box.centerX();
            float midY = box.centerY();
            float offsetX = (midX - width / 2);
            float offsetY = (midY - height / 2);


            int stopsCount = mColors.size() / 5;
            int[] stopsColors = new int[stopsCount];
            float[] stops = new float[stopsCount];
            parseGradientStops(mColors, stopsCount, stops, stopsColors, opacity);

            if (mType == GradientType.LINEAR_GRADIENT) {
                float x1 = PropHelper.fromPercentageToFloat(mPoints.getString(0), width, offsetX, scale);
                float y1 = PropHelper.fromPercentageToFloat(mPoints.getString(1), height, offsetY, scale);
                float x2 = PropHelper.fromPercentageToFloat(mPoints.getString(2), width, offsetX, scale);
                float y2 = PropHelper.fromPercentageToFloat(mPoints.getString(3), height, offsetY, scale);
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
                float rx = PropHelper.fromPercentageToFloat(mPoints.getString(2), width, 0f, scale);
                float ry = PropHelper.fromPercentageToFloat(mPoints.getString(3), height, 0f, scale);
                float cx = PropHelper.fromPercentageToFloat(mPoints.getString(4), width, offsetX, scale);
                float cy = PropHelper.fromPercentageToFloat(mPoints.getString(5), height, offsetY, scale) / (ry / rx);
                // TODO: support focus point.
                //float fx = PropHelper.fromPercentageToFloat(mPoints.getString(0), width, offsetX) * scale;
                //float fy = PropHelper.fromPercentageToFloat(mPoints.getString(1), height, offsetY) * scale / (ry / rx);
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
        }
    }

    static class PathParser {
        static private Pattern PATH_REG_EXP = Pattern.compile("[a-df-z]|[\\-+]?(?:[\\d.]e[\\-+]?|[^\\s\\-+,a-z])+", Pattern.CASE_INSENSITIVE);
        static private Pattern DECIMAL_REG_EXP = Pattern.compile("(\\.\\d+)(?=\\-?\\.)");

        private Matcher mMatcher;
        private Path mPath;
        private String mString;
        private float mPenX = 0f;
        private float mPenY = 0f;
        private float mPenDownX;
        private float mPenDownY;
        private float mPivotX = 0f;
        private float mPivotY = 0f;
        private float mScale = 1f;
        private boolean mValid = true;
        private boolean mPendDownSet = false;

        private String mLastCommand;
        private String mLastValue;

        public PathParser(String d, float scale) {
            mScale = scale;
            mString = d;
            mPath = new Path();
            mMatcher = PATH_REG_EXP.matcher(DECIMAL_REG_EXP.matcher(mString).replaceAll("$1,"));

            while (mMatcher.find() && mValid) {
                executeCommand(mMatcher.group());
            }
        }

        private void executeCommand(String command) {
            switch (command) {
                // moveTo command
                case "m":
                    move(getNextFloat(), getNextFloat());
                    break;
                case "M":
                    moveTo(getNextFloat(), getNextFloat());
                    break;

                // lineTo command
                case "l":
                    line(getNextFloat(), getNextFloat());
                    break;
                case "L":
                    lineTo(getNextFloat(), getNextFloat());
                    break;

                // horizontalTo command
                case "h":
                    line(getNextFloat(), 0);
                    break;
                case "H":
                    lineTo(getNextFloat(), mPenY);
                    break;

                // verticalTo command
                case "v":
                    line(0, getNextFloat());
                    break;
                case "V":
                    lineTo(mPenX, getNextFloat());
                    break;

                // curveTo command
                case "c":
                    curve(getNextFloat(), getNextFloat(), getNextFloat(), getNextFloat(), getNextFloat(), getNextFloat());
                    break;
                case "C":
                    curveTo(getNextFloat(), getNextFloat(), getNextFloat(), getNextFloat(), getNextFloat(), getNextFloat());
                    break;

                // smoothCurveTo command
                case "s":
                    smoothCurve(getNextFloat(), getNextFloat(), getNextFloat(), getNextFloat());
                    break;
                case "S":
                    smoothCurveTo(getNextFloat(), getNextFloat(), getNextFloat(), getNextFloat());
                    break;

                // quadraticBezierCurveTo command
                case "q":
                    quadraticBezierCurve(getNextFloat(), getNextFloat(), getNextFloat(), getNextFloat());
                    break;
                case "Q":
                    quadraticBezierCurveTo(getNextFloat(), getNextFloat(), getNextFloat(), getNextFloat());
                    break;

                // smoothQuadraticBezierCurveTo command
                case "t":
                    smoothQuadraticBezierCurve(getNextFloat(), getNextFloat());
                    break;
                case "T":
                    smoothQuadraticBezierCurveTo(getNextFloat(), getNextFloat());
                    break;

                // arcTo command
                case "a":
                    arc(getNextFloat(), getNextFloat(), getNextFloat(), getNextBoolean(), getNextBoolean(), getNextFloat(), getNextFloat());
                    break;
                case "A":
                    arcTo(getNextFloat(), getNextFloat(), getNextFloat(), getNextBoolean(), getNextBoolean(), getNextFloat(), getNextFloat());
                    break;

                // close command
                case "Z":
                case "z":
                    close();
                    break;
                default:
                    mLastValue = command;
                    executeCommand(mLastCommand);
                    return;
            }

            mLastCommand = command;

            if (command.equals("m")) {
                mLastCommand = "l";
            } else if (command.equals("M")) {
                mLastCommand = "L";
            }
        }

        public Path getPath() {
            return mPath;
        }

        private boolean getNextBoolean() {
            if (mMatcher.find()) {
                return mMatcher.group().equals("1");
            } else {
                mValid = false;
                mPath = new Path();
                return false;
            }
        }

        private float getNextFloat() {
            if (mLastValue != null) {
                String lastValue = mLastValue;
                mLastValue = null;
                return Float.parseFloat(lastValue);
            } else if (mMatcher.find()) {
                return Float.parseFloat(mMatcher.group());
            } else {
                mValid = false;
                mPath = new Path();
                return 0;
            }
        }
        private void move(float x, float y) {
            moveTo(x + mPenX, y + mPenY);
        }

        private void moveTo(float x, float y) {
            mPivotX = mPenX = x;
            mPivotY = mPenY = y;
            mPath.moveTo(x * mScale, y * mScale);
        }

        private void line(float x, float y) {
            lineTo(x + mPenX, y + mPenY);
        }

        private void lineTo(float x, float y) {
            setPenDown();
            mPivotX = mPenX = x;
            mPivotY = mPenY = y;
            mPath.lineTo(x * mScale, y * mScale);
        }

        private void curve(float c1x, float c1y, float c2x, float c2y, float ex, float ey) {
            curveTo(c1x + mPenX, c1y + mPenY, c2x + mPenX, c2y + mPenY, ex + mPenX, ey + mPenY);
        }

        private void curveTo(float c1x, float c1y, float c2x, float c2y, float ex, float ey) {
            mPivotX = c2x;
            mPivotY = c2y;
            cubicTo(c1x, c1y, c2x, c2y, ex, ey);
        }

        private void cubicTo(float c1x, float c1y, float c2x, float c2y, float ex, float ey) {
            setPenDown();
            mPenX = ex;
            mPenY = ey;
            mPath.cubicTo(c1x * mScale, c1y * mScale, c2x * mScale, c2y * mScale, ex * mScale, ey * mScale);
        }

        private void smoothCurve(float c1x, float c1y, float ex, float ey) {
            smoothCurveTo(c1x + mPenX, c1y + mPenY, ex + mPenX, ey + mPenY);
        }

        private void smoothCurveTo(float c1x, float c1y, float ex, float ey) {
            float c2x = c1x;
            float c2y = c1y;
            c1x = (mPenX * 2) - mPivotX;
            c1y = (mPenY * 2) - mPivotY;
            mPivotX = c2x;
            mPivotY = c2y;
            cubicTo(c1x, c1y, c2x, c2y, ex, ey);
        }

        private void quadraticBezierCurve(float c1x, float c1y, float c2x, float c2y) {
            quadraticBezierCurveTo(c1x + mPenX, c1y + mPenY, c2x + mPenX, c2y + mPenY);
        }

        private void quadraticBezierCurveTo(float c1x, float c1y, float c2x, float c2y) {
            mPivotX = c1x;
            mPivotY = c1y;
            float ex = c2x;
            float ey = c2y;
            c2x = (ex + c1x * 2) / 3;
            c2y = (ey + c1y * 2) / 3;
            c1x = (mPenX + c1x * 2) / 3;
            c1y = (mPenY + c1y * 2) / 3;
            cubicTo(c1x, c1y, c2x, c2y, ex, ey);
        }

        private void smoothQuadraticBezierCurve(float c1x, float c1y) {
            smoothQuadraticBezierCurveTo(c1x + mPenX, c1y + mPenY);
        }

        private void smoothQuadraticBezierCurveTo(float c1x, float c1y) {
            float c2x = c1x;
            float c2y = c1y;
            c1x = (mPenX * 2) - mPivotX;
            c1y = (mPenY * 2) - mPivotY;
            quadraticBezierCurveTo(c1x, c1y, c2x, c2y);
        }

        private void arc(float rx, float ry, float rotation, boolean outer, boolean clockwise, float x, float y) {
            arcTo(rx, ry, rotation, outer, clockwise, x + mPenX, y + mPenY);
        }

        private void arcTo(float rx, float ry, float rotation, boolean outer, boolean clockwise, float x, float y) {
            float tX = mPenX;
            float tY = mPenY;

            ry = Math.abs(ry == 0 ? (rx == 0 ? (y - tY) : rx) : ry);
            rx = Math.abs(rx == 0 ? (x - tX) : rx);

            if (rx == 0 || ry == 0 || (x == tX && y == tY)) {
                lineTo(x, y);
                return;
            }

            float rad = (float) Math.toRadians(rotation);
            float cos = (float) Math.cos(rad);
            float sin = (float) Math.sin(rad);
            x -= tX;
            y -= tY;

            // Ellipse Center
            float cx = cos * x / 2 + sin * y / 2;
            float cy = -sin * x / 2 + cos * y / 2;
            float rxry = rx * rx * ry * ry;
            float rycx = ry * ry * cx * cx;
            float rxcy = rx * rx * cy * cy;
            float a = rxry - rxcy - rycx;

            if (a < 0){
                a = (float)Math.sqrt(1 - a / rxry);
                rx *= a;
                ry *= a;
                cx = x / 2;
                cy = y / 2;
            } else {
                a = (float)Math.sqrt(a / (rxcy + rycx));

                if (outer == clockwise) {
                    a = -a;
                }
                float cxd = -a * cy * rx / ry;
                float cyd =  a * cx * ry / rx;
                cx = cos * cxd - sin * cyd + x / 2;
                cy = sin * cxd + cos * cyd + y / 2;
            }

            // Rotation + Scale Transform
            float xx =  cos / rx;
            float yx = sin / rx;
            float xy = -sin / ry;
            float yy = cos / ry;

            // Start and End Angle
            float sa = (float) Math.atan2(xy * -cx + yy * -cy, xx * -cx + yx * -cy);
            float ea = (float) Math.atan2(xy * (x - cx) + yy * (y - cy), xx * (x - cx) + yx * (y - cy));

            cx += tX;
            cy += tY;
            x += tX;
            y += tY;

            setPenDown();

            mPenX = mPivotX = x;
            mPenY = mPivotY = y;

            if (rx != ry || rad != 0f) {
                arcToBezier(cx, cy, rx, ry, sa, ea, clockwise, rad);
            } else {

                float start = (float) Math.toDegrees(sa);
                float end = (float) Math.toDegrees(ea);
                float sweep = Math.abs((start - end) % 360);

                if (outer) {
                    if (sweep < 180) {
                        sweep = 360 - sweep;
                    }
                } else {
                    if (sweep > 180) {
                        sweep = 360 - sweep;
                    }
                }

                if (!clockwise) {
                    sweep = -sweep;
                }

                RectF oval = new RectF(
                        (cx - rx) * mScale,
                        (cy - rx) * mScale,
                        (cx + rx) * mScale,
                        (cy + rx) * mScale);

                mPath.arcTo(oval, start, sweep);
            }
        }

        private void close() {
            if (mPendDownSet) {
                mPenX = mPenDownX;
                mPenY = mPenDownY;
                mPendDownSet = false;
                mPath.close();
            }
        }

        private void arcToBezier(float cx, float cy, float rx, float ry, float sa, float ea, boolean clockwise, float rad) {
            // Inverse Rotation + Scale Transform
            float cos = (float) Math.cos(rad);
            float sin = (float) Math.sin(rad);
            float xx = cos * rx;
            float yx = -sin * ry;
            float xy = sin * rx;
            float yy =  cos * ry;

            // Bezier Curve Approximation
            float arc = ea - sa;
            if (arc < 0 && clockwise) {
                arc += Math.PI * 2;
            } else if (arc > 0 && !clockwise) {
                arc -= Math.PI * 2;
            }

            int n = (int) Math.ceil(Math.abs(arc / (Math.PI / 2)));

            float step = arc / n;
            float k = (4 / 3) * (float) Math.tan(step / 4);

            float x = (float) Math.cos(sa);
            float y = (float) Math.sin(sa);

            for (int i = 0; i < n; i++){
                float cp1x = x - k * y;
                float cp1y = y + k * x;

                sa += step;
                x = (float) Math.cos(sa);
                y = (float) Math.sin(sa);

                float cp2x = x + k * y;
                float cp2y = y - k * x;

                mPath.cubicTo(
                        (cx + xx * cp1x + yx * cp1y) * mScale,
                        (cy + xy * cp1x + yy * cp1y) * mScale,
                        (cx + xx * cp2x + yx * cp2y) * mScale,
                        (cy + xy * cp2x + yy * cp2y) * mScale,
                        (cx + xx * x + yx * y) * mScale,
                        (cy + xy * x + yy * y) * mScale
                    );
            }
        }

        private void setPenDown() {
            if (!mPendDownSet) {
                mPenDownX = mPenX;
                mPenDownY = mPenY;
                mPendDownSet = true;
            }
        }
    }
}
