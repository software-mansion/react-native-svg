/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.graphics.PointF;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class GlyphContext {

    private ArrayList<ReadableMap> mFontContext;
    private ArrayList<PointF> mLocationContext;
    private ArrayList<PointF> mDeltaContext;
    private ArrayList<ArrayList<String>> mXPositionsContext;
    private ArrayList<ArrayList<String>> mYPositionsContext;
    private ArrayList<ArrayList<Float>> mDeltaXContext;
    private ArrayList<ArrayList<Float>> mDeltaYContext;
    private ArrayList<ArrayList<Float>> mRotationContext;
    private ArrayList<Integer> mRotationIndexContext;
    private ArrayList<Float> mGlyphRotationContext;
    private ArrayList<Float> mXContext;
    private ArrayList<Float> mYContext;
    private @Nonnull PointF mCurrentLocation;
    private @Nonnull PointF mCurrentDelta;
    private float mRotation = 0;
    private float mScale;
    private float mWidth;
    private float mHeight;
    private int mContextLength = 0;
    private int mRotationIndex = -1;
    private static final float DEFAULT_FONT_SIZE = 12f;
    private static final float DEFAULT_KERNING = 0f;
    private static final float DEFAULT_LETTER_SPACING = 0f;

    GlyphContext(float scale, float width, float height) {
        mScale = scale;
        mWidth = width;
        mHeight = height;
        mCurrentLocation = new PointF();
        mCurrentDelta = new PointF();
        mFontContext = new ArrayList<>();
        mLocationContext = new ArrayList<>();
        mDeltaContext = new ArrayList<>();
        mXPositionsContext = new ArrayList<>();
        mYPositionsContext = new ArrayList<>();
        mDeltaXContext = new ArrayList<>();
        mDeltaYContext = new ArrayList<>();
        mRotationContext = new ArrayList<>();
        mRotationIndexContext = new ArrayList<>();
        mGlyphRotationContext = new ArrayList<>();
        mXContext = new ArrayList<>();
        mYContext = new ArrayList<>();
    }

    public void pushContext(@Nullable ReadableMap font) {
        PointF location = mCurrentLocation;

        mDeltaContext.add(mCurrentDelta);

        mCurrentDelta = clonePointF(mCurrentDelta);

        mLocationContext.add(location);
        mFontContext.add(font);
        mXPositionsContext.add(new ArrayList<String>());
        mYPositionsContext.add(new ArrayList<String>());
        mDeltaXContext.add(new ArrayList<Float>());
        mDeltaYContext.add(new ArrayList<Float>());
        mRotationIndexContext.add(mRotationIndex);
        mXContext.add(location.x);
        mYContext.add(location.y);

        mCurrentLocation = clonePointF(location);
        mContextLength++;
    }

    public void pushContext(@Nullable ReadableMap font, @Nullable ReadableArray rotate, @Nullable ReadableArray deltaX, @Nullable ReadableArray deltaY, @Nullable String positionX, @Nullable String positionY) {
        PointF location = mCurrentLocation;

        mDeltaContext.add(mCurrentDelta);

        if (positionX != null) {
            ArrayList<String> list = new ArrayList<>(Arrays.asList(positionX.trim().split("\\s+")));
            mXPositionsContext.add(list);
            location.x = PropHelper.fromPercentageToFloat(list.get(0), mWidth, 0, mScale);
            mCurrentDelta.x = 0;
        } else {
            mXPositionsContext.add(new ArrayList<String>());
        }

        if (positionY != null) {
            ArrayList<String> list = new ArrayList<>(Arrays.asList(positionY.trim().split("\\s+")));
            mYPositionsContext.add(list);
            location.y = PropHelper.fromPercentageToFloat(list.get(0), mHeight, 0, mScale);
            mCurrentDelta.y = 0;
        } else {
            mYPositionsContext.add(new ArrayList<String>());
        }

        mCurrentDelta = clonePointF(mCurrentDelta);

        mLocationContext.add(location);
        mFontContext.add(font);
        mDeltaXContext.add(getFloatArrayListFromReadableArray(deltaX));
        mDeltaYContext.add(getFloatArrayListFromReadableArray(deltaY));
        mXContext.add(location.x);
        mYContext.add(location.y);

        ArrayList<Float> rotations = getFloatArrayListFromReadableArray(rotate);
        if (rotations.size() != 0) {
            mRotationIndex = mRotationContext.size();
            mRotationContext.add(rotations);
            mRotation = rotations.get(0);
            mGlyphRotationContext.add(mRotation);
        }

        mRotationIndexContext.add(mRotationIndex);

        mCurrentLocation = clonePointF(location);
        mContextLength++;
    }

    public void popContext() {
        float x = mXContext.get(mContextLength - 1);
        float y = mYContext.get(mContextLength - 1);
        mFontContext.remove(mContextLength - 1);
        mLocationContext.remove(mContextLength - 1);
        mXPositionsContext.remove(mContextLength - 1);
        mYPositionsContext.remove(mContextLength - 1);
        mDeltaContext.remove(mContextLength - 1);
        mDeltaXContext.remove(mContextLength - 1);
        mDeltaYContext.remove(mContextLength - 1);
        mRotationIndexContext.remove(mContextLength - 1);
        mXContext.remove(mContextLength - 1);
        mYContext.remove(mContextLength - 1);

        mContextLength--;

        if (mRotationIndex == mContextLength) {
            mRotationContext.remove(mRotationIndex);
            mGlyphRotationContext.remove(mRotationIndex);
        }

        if (mContextLength != 0) {
            mXContext.set(mContextLength - 1, x);
            mYContext.set(mContextLength - 1, y);
            PointF lastLocation = mLocationContext.get(mContextLength - 1);
            PointF lastDelta = mDeltaContext.get(mContextLength - 1);
            mCurrentLocation = clonePointF(lastLocation);
            mCurrentDelta = clonePointF(lastDelta);
            mCurrentLocation.x = lastLocation.x = x;
            mCurrentLocation.y = lastLocation.y = y;
            mRotationIndex = mRotationIndexContext.get(mContextLength - 1);
            mRotation = mRotationIndex > -1 ? mGlyphRotationContext.get(mRotationIndex) : 0f;
        }
    }

    public PointF getNextGlyphPoint(float offset, float glyphWidth) {
        if (hasNext(mXPositionsContext)) {
            mCurrentLocation.x = PropHelper.fromPercentageToFloat(getNextString(mXPositionsContext), mWidth, 0, mScale);
            mCurrentDelta.x = 0;
        }
        if (hasNext(mYPositionsContext)) {
            mCurrentLocation.y = PropHelper.fromPercentageToFloat(getNextString(mYPositionsContext), mHeight, 0, mScale);
            mCurrentDelta.y = 0;
        }

        mXContext.set(mXContext.size() - 1, mCurrentLocation.x + offset + glyphWidth);
        mYContext.set(mYContext.size() - 1, mCurrentLocation.y);

        return new PointF(mCurrentLocation.x + offset, mCurrentLocation.y);
    }

    public PointF getNextGlyphDelta() {
        float dx = 0f;
        float dy = 0f;

        if (hasNext(mDeltaXContext) || hasNext(mDeltaYContext)) {
            dx = mScale * getNextFloat(mDeltaXContext);
            dy = mScale * getNextFloat(mDeltaYContext);

            if (mContextLength > 0) {
                for (PointF point : mDeltaContext) {
                    point.x += dx;
                    point.y += dy;
                }
            }
        }

        if (mContextLength > 0) {
            return mDeltaContext.get(mContextLength - 1);
        } else {
            return new PointF(dx, dy);
        }
    }

    public float getNextGlyphRotation() {
        if (mRotationIndex > -1 && hasNext(mRotationContext, mRotationIndex)) {
            mRotation = getNextFloat(mRotationContext, mRotationIndex);
            mGlyphRotationContext.set(mRotationIndex, mRotation);
        }

        return mRotation;
    }

    private boolean hasNext(List<? extends Collection<?>> context) {
        int index = mContextLength - 1;

        for (; index >= 0; index--) {
            if (hasNext(context, index)) {
                return true;
            }
        }

        return false;
    }

    private boolean hasNext(List<? extends Collection<?>> context, int index) {
        return context.get(index).size() != 0;
    }

    private float getNextFloat(ArrayList<ArrayList<Float>> context) {
        return getNext(context, 0f);
    }

    private float getNextFloat(ArrayList<ArrayList<Float>> context, int index) {
        return getNext(context, index, 0f);
    }

    private String getNextString(ArrayList<ArrayList<String>> context) {
        return getNext(context, "");
    }

    private <T> T getNext(List<? extends List<T>> context, T lacuna) {
        int index = mContextLength - 1;

        for (; index >= 0; index--) {
            List<T> list = context.get(index);

            if (list.size() != 0) {
                return list.remove(0);
            }
        }

        return lacuna;
    }

    private <T> T getNext(List<? extends List<T>> context, int index, T lacuna) {
        List<T> list = context.get(index);

        if (list.size() != 0) {
            return list.remove(0);
        }

        return lacuna;
    }

    public ReadableMap getGlyphFont() {
        String fontFamily = null;
        float fontSize = DEFAULT_FONT_SIZE;
        float kerning = DEFAULT_KERNING;
        float letterSpacing = DEFAULT_LETTER_SPACING;
        boolean fontSizeSet = false;
        boolean kerningSet = false;
        boolean letterSpacingSet = false;
        String fontWeight = null;
        String fontStyle = null;

        int index = mContextLength - 1;

        for (; index >= 0; index--) {
            ReadableMap font = mFontContext.get(index);

            if (fontFamily == null && font.hasKey("fontFamily")) {
                fontFamily = font.getString("fontFamily");
            }

            if (!fontSizeSet && font.hasKey("fontSize")) {
                fontSize = (float)font.getDouble("fontSize");
                fontSizeSet = true;
            }

            // TODO: add support for other length units
            if (!kerningSet && font.hasKey("kerning")) {
                kerning = Float.valueOf(font.getString("kerning"));
                kerningSet = true;
            }

            // TODO: add support for other length units
            if (!letterSpacingSet && font.hasKey("letterSpacing")) {
                letterSpacing = Float.valueOf(font.getString("letterSpacing"));
                letterSpacingSet = true;
            }

            if (fontWeight == null && font.hasKey("fontWeight")) {
                fontWeight = font.getString("fontWeight");
            }
            if (fontStyle == null && font.hasKey("fontStyle")) {
                fontStyle = font.getString("fontStyle");
            }

            if (fontFamily != null && fontSizeSet && kerningSet && letterSpacingSet && fontWeight != null && fontStyle != null) {
                break;
            }
        }

        WritableMap map = Arguments.createMap();
        map.putString("fontFamily", fontFamily);
        map.putDouble("fontSize", fontSize);
        map.putString("fontWeight", fontWeight);
        map.putString("fontStyle", fontStyle);
        map.putDouble("kerning", kerning);
        map.putDouble("letterSpacing", letterSpacing);
        map.putBoolean("isKerningValueSet", kerningSet);

        return map;
    }

    private ArrayList<Float> getFloatArrayListFromReadableArray(ReadableArray readableArray) {
        ArrayList<Float> arrayList = new ArrayList<>();
        ReadableMap font = getGlyphFont();
        float fontSize = (float)font.getDouble("fontSize");

        if (readableArray != null) {
            for (int i = 0; i < readableArray.size(); i++) {
                switch (readableArray.getType(i)) {
                    case String:
                        String val = readableArray.getString(i);
                        arrayList.add(Float.valueOf(val.substring(0, val.length() - 2)) * fontSize);
                        break;

                    case Number:
                        arrayList.add((float)readableArray.getDouble(i));
                        break;
                }
            }
        }

        return arrayList;
    }

    private PointF clonePointF(PointF point) {
        return new PointF(point.x, point.y);
    }
}
