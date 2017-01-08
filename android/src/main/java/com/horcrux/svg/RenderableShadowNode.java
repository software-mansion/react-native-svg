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
import com.facebook.react.bridge.Arguments;
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
abstract public class RenderableShadowNode extends VirtualNode {

    // strokeLinecap
    private static final int CAP_BUTT = 0;
    private static final int CAP_ROUND = 1;
    private static final int CAP_SQUARE = 2;

    // strokeLinejoin
    private static final int JOIN_BEVEL = 2;
    private static final int JOIN_MITER = 0;
    private static final int JOIN_ROUND = 1;

    // fillRule
    private static final int FILL_RULE_EVENODD = 0;
    private static final int FILL_RULE_NONZERO = 1;

    public @Nullable ReadableArray mStroke;
    public @Nullable float[] mStrokeDasharray;

    public float mStrokeWidth = 1;
    public float mStrokeOpacity = 1;
    public float mStrokeMiterlimit = 4;
    public float mStrokeDashoffset = 0;

    public Paint.Cap mStrokeLinecap = Paint.Cap.ROUND;
    public Paint.Join mStrokeLinejoin = Paint.Join.ROUND;

    public @Nullable ReadableArray mFill;
    public float mFillOpacity = 1;
    public Path.FillType mFillRule = Path.FillType.WINDING;

    protected Path mPath;

    private ReadableArray mLastMergedList;
    private ArrayList<Object> mOriginProperties;
    protected ReadableArray mPropList = new JavaOnlyArray();
    protected WritableArray mAttributeList = new JavaOnlyArray();

    @ReactProp(name = "fill")
    public void setFill(@Nullable ReadableArray fill) {
        mFill = fill;
        markUpdated();
    }

    @ReactProp(name = "fillOpacity", defaultFloat = 1f)
    public void setFillOpacity(float fillOpacity) {
        mFillOpacity = fillOpacity;
        markUpdated();
    }

    @ReactProp(name = "fillRule", defaultInt = FILL_RULE_NONZERO)
    public void setFillRule(int fillRule) {
        switch (fillRule) {
            case FILL_RULE_EVENODD:
                mFillRule = Path.FillType.EVEN_ODD;
                break;
            case FILL_RULE_NONZERO:
                break;
            default:
                throw new JSApplicationIllegalArgumentException(
                        "fillRule " + mFillRule + " unrecognized");
        }

        mPath = null;
        markUpdated();
    }

    @ReactProp(name = "stroke")
    public void setStroke(@Nullable ReadableArray strokeColors) {
        mStroke = strokeColors;
        markUpdated();
    }

    @ReactProp(name = "strokeOpacity", defaultFloat = 1f)
    public void setStrokeOpacity(float strokeOpacity) {
        mStrokeOpacity = strokeOpacity;
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

    @ReactProp(name = "strokeWidth", defaultFloat = 0f)
    public void setStrokeWidth(float strokeWidth) {
        mStrokeWidth = strokeWidth;
        markUpdated();
    }

    @ReactProp(name = "strokeMiterlimit", defaultFloat = 4f)
    public void setStrokeMiterlimit(float strokeMiterlimit) {
        mStrokeMiterlimit = strokeMiterlimit;
        markUpdated();
    }

    @ReactProp(name = "strokeLinecap", defaultInt = CAP_ROUND)
    public void setStrokeLinecap(int strokeLinecap) {
        switch (strokeLinecap) {
            case CAP_BUTT:
                mStrokeLinecap = Paint.Cap.BUTT;
                break;
            case CAP_SQUARE:
                mStrokeLinecap = Paint.Cap.SQUARE;
                break;
            case CAP_ROUND:
                mStrokeLinecap = Paint.Cap.ROUND;
                break;
            default:
                throw new JSApplicationIllegalArgumentException(
                        "strokeLinecap " + mStrokeLinecap + " unrecognized");
        }
        markUpdated();
    }

    @ReactProp(name = "strokeLinejoin", defaultInt = JOIN_ROUND)
    public void setStrokeLinejoin(int strokeLinejoin) {
        switch (strokeLinejoin) {
            case JOIN_MITER:
                mStrokeLinejoin = Paint.Join.MITER;
                break;
            case JOIN_BEVEL:
                mStrokeLinejoin = Paint.Join.BEVEL;
                break;
            case JOIN_ROUND:
                mStrokeLinejoin = Paint.Join.ROUND;
                break;
            default:
                throw new JSApplicationIllegalArgumentException(
                        "strokeLinejoin " + mStrokeLinejoin + " unrecognized");
        }
        markUpdated();
    }

    @ReactProp(name = "propList")
    public void setPropList(@Nullable ReadableArray propList) {
        if (propList != null) {
            WritableArray copy = Arguments.createArray();
            for (int i = 0; i < propList.size(); i++) {
                String fieldName = propertyNameToFieldName(propList.getString(i));
                copy.pushString(fieldName);
                mAttributeList.pushString(fieldName);
            }
            mPropList = copy;
        }

        markUpdated();
    }

    @Override
    public void draw(Canvas canvas, Paint paint, float opacity) {
        if (mPath == null) {
            mPath = getPath(canvas, paint);
            mPath.setFillType(mFillRule);
        }

        opacity *= mOpacity;

        if (opacity > MIN_OPACITY_FOR_DRAW) {
            int count = saveAndSetupCanvas(canvas);
            if (mPath == null) {
                throw new JSApplicationIllegalArgumentException(
                        "Paths should have a valid path (d) prop");
            }

            clip(canvas, paint);
            if (setupFillPaint(paint, opacity * mFillOpacity, null)) {
                canvas.drawPath(mPath, paint);
            }
            if (setupStrokePaint(paint, opacity * mStrokeOpacity, null)) {
                canvas.drawPath(mPath, paint);
            }

            restoreCanvas(canvas, count);
            markUpdateSeen();
        }
    }

    /**
     * Sets up paint according to the props set on a shadow view. Returns {@code true}
     * if the fill should be drawn, {@code false} if not.
     */
    protected boolean setupFillPaint(Paint paint, float opacity, @Nullable RectF box) {
        if (mFill != null && mFill.size() > 0) {
            paint.reset();
            paint.setFlags(Paint.ANTI_ALIAS_FLAG);
            paint.setStyle(Paint.Style.FILL);
            setupPaint(paint, opacity, mFill, box);
            return true;
        }
        return false;
    }

    /**
     * Sets up paint according to the props set on a shadow view. Returns {@code true}
     * if the stroke should be drawn, {@code false} if not.
     */
    protected boolean setupStrokePaint(Paint paint, float opacity, @Nullable  RectF box) {
        paint.reset();
        if (mStrokeWidth == 0 || mStroke == null || mStroke.size() == 0) {
            return false;
        }

        paint.setFlags(Paint.ANTI_ALIAS_FLAG);
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeCap(mStrokeLinecap);
        paint.setStrokeJoin(mStrokeLinejoin);
        paint.setStrokeMiter(mStrokeMiterlimit * mScale);
        paint.setStrokeWidth(mStrokeWidth * mScale);
        setupPaint(paint, opacity, mStroke, box);

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
        } else if (colorType == 1) {
            if (box == null) {
                box = new RectF();
                mPath.computeBounds(box, true);
            }
            PropHelper.RNSVGBrush brush = getSvgShadowNode().getDefinedBrush(colors.getString(1));
            if (brush != null) {
                brush.setupPaint(paint, box, mScale, opacity);
            }
        } else {
            // TODO: Support pattern.
            FLog.w(ReactConstants.TAG, "RNSVG: Color type " + colorType + " not supported!");
        }

    }


    abstract protected Path getPath(Canvas canvas, Paint paint);

    @Override
    public int hitTest(Point point, @Nullable Matrix matrix) {
        Bitmap bitmap = Bitmap.createBitmap(
                mCanvasWidth,
                mCanvasHeight,
                Bitmap.Config.ARGB_8888);

        Canvas canvas = new Canvas(bitmap);

        if (matrix != null) {
            canvas.concat(matrix);
        }

        canvas.concat(mMatrix);

        Paint paint = new Paint();
        clip(canvas, paint);
        setHitTestFill(paint);
        canvas.drawPath(mPath, paint);

        if (setHitTestStroke(paint)) {
            canvas.drawPath(mPath, paint);
        }

        canvas.setBitmap(bitmap);
        try {
            if (bitmap.getPixel(point.x, point.y) != 0) {
                return getReactTag();
            }
        } catch (Exception e) {

            return -1;
        } finally {
            bitmap.recycle();
        }
        return -1;
    }

    protected void setHitTestFill(Paint paint) {
        paint.reset();
        paint.setARGB(255, 0, 0, 0);
        paint.setFlags(Paint.ANTI_ALIAS_FLAG);
        paint.setStyle(Paint.Style.FILL);
    }

    protected boolean setHitTestStroke(Paint paint) {
        if (mStrokeWidth == 0) {
            return false;
        }

        paint.reset();
        paint.setARGB(255, 0, 0, 0);
        paint.setFlags(Paint.ANTI_ALIAS_FLAG);
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(mStrokeWidth * mScale);
        paint.setStrokeCap(mStrokeLinecap);
        paint.setStrokeJoin(mStrokeLinejoin);
        return true;
    }

    @Override
    public void mergeProperties(VirtualNode target, ReadableArray mergeList, boolean inherited) {
        mLastMergedList = mergeList;

        if (mergeList.size() == 0) {
            return;
        }

        mOriginProperties = new ArrayList<>();
        resetAttributeList();

        for (int i = 0, size = mergeList.size(); i < size; i++) {
            try {
                String fieldName = mergeList.getString(i);
                Field field = getClass().getField(fieldName);
                Object value = field.get(target);

                if (inherited) {
                    if (!hasOwnProperty(fieldName)) {
                        mAttributeList.pushString(fieldName);
                        mOriginProperties.add(field.get(this));
                        field.set(this, value);
                    }
                } else {
                    mOriginProperties.add(field.get(this));
                    field.set(this, value);
                }
            } catch (Exception e) {
                throw new IllegalStateException(e);
            }
        }
    }

    @Override
    public void mergeProperties(VirtualNode target, ReadableArray mergeList) {
        mergeProperties(target, mergeList, false);
    }

    @Override
    public void resetProperties() {
        if (mLastMergedList != null) {
            try {
                for (int i = mLastMergedList.size() - 1; i >= 0; i--) {
                    Field field = getClass().getField(mLastMergedList.getString(i));
                    field.set(this, mOriginProperties.get(i));
                }
            } catch (Exception e) {
                throw new IllegalStateException(e);
            }

            mLastMergedList = null;
            mOriginProperties = null;
        }
        resetAttributeList();
    }

    private void resetAttributeList() {
        mAttributeList = Arguments.createArray();
        for (int i = 0; i < mPropList.size(); i++) {
            mAttributeList.pushString(mPropList.getString(i));
        }
    }

    // convert propertyName something like fillOpacity to fieldName like mFillOpacity
    private String propertyNameToFieldName(String fieldName) {
        Pattern pattern = Pattern.compile("^(\\w)");
        Matcher matched = pattern.matcher(fieldName);
        StringBuffer sb = new StringBuffer("m");
        while (matched.find()) {
            matched.appendReplacement(sb, matched.group(1).toUpperCase());
        }
        matched.appendTail(sb);
        return sb.toString();
    }

    private boolean hasOwnProperty(String propName) {
        for (int i = mAttributeList.size() - 1; i >= 0; i--) {
            if (mAttributeList.getString(i).equals(propName)) {
                return true;
            }
        }
        return false;
    }
}
