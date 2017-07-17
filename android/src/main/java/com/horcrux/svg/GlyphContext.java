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

    private ArrayList<ArrayList<String>> mXPositionsContext;
    private ArrayList<ArrayList<String>> mYPositionsContext;
    private ArrayList<ArrayList<Float>> mRotationsContext;
    private ArrayList<ArrayList<Float>> mDeltaXsContext;
    private ArrayList<ArrayList<Float>> mDeltaYsContext;
    private ArrayList<Integer> mRotationIndexContext;
    private ArrayList<Integer> mDeltaXIndexContext;
    private ArrayList<Integer> mDeltaYIndexContext;
    private ArrayList<ReadableMap> mFontContext;
    private ArrayList<PointF> mLocationContext;
    private ArrayList<Float> mRotationContext;
    private ArrayList<Float> mDeltaXContext;
    private ArrayList<Float> mDeltaYContext;
    private ArrayList<Float> mXContext;
    private ArrayList<Float> mYContext;

    private @Nonnull PointF mCurrentLocation;
    private @Nonnull PointF mCurrentDelta;

    private float mScale;
    private float mWidth;
    private float mHeight;
    private float mRotation;

    private int mContextLength;
    private int mDeltaXIndex = -1;
    private int mDeltaYIndex = -1;
    private int mRotationIndex = -1;

    private static final float DEFAULT_KERNING = 0f;
    private static final float DEFAULT_FONT_SIZE = 12f;
    private static final float DEFAULT_LETTER_SPACING = 0f;

    GlyphContext(float scale, float width, float height) {
        mRotationIndexContext = new ArrayList<>();
        mDeltaXIndexContext = new ArrayList<>();
        mDeltaYIndexContext = new ArrayList<>();
        mXPositionsContext = new ArrayList<>();
        mYPositionsContext = new ArrayList<>();
        mRotationsContext = new ArrayList<>();
        mRotationContext = new ArrayList<>();
        mLocationContext = new ArrayList<>();
        mDeltaXsContext = new ArrayList<>();
        mDeltaYsContext = new ArrayList<>();
        mDeltaXContext = new ArrayList<>();
        mDeltaYContext = new ArrayList<>();
        mFontContext = new ArrayList<>();
        mXContext = new ArrayList<>();
        mYContext = new ArrayList<>();

        mCurrentLocation = new PointF();
        mCurrentDelta = new PointF();

        mHeight = height;
        mWidth = width;
        mScale = scale;
    }

    public void pushContext(@Nullable ReadableMap font) {
        mCurrentLocation = clonePointF(mCurrentLocation);

        mXPositionsContext.add(new ArrayList<String>());
        mYPositionsContext.add(new ArrayList<String>());
        mRotationIndexContext.add(mRotationIndex);
        mLocationContext.add(mCurrentLocation);
        mDeltaXIndexContext.add(mDeltaXIndex);
        mDeltaYIndexContext.add(mDeltaYIndex);
        mXContext.add(mCurrentLocation.x);
        mYContext.add(mCurrentLocation.y);
        mFontContext.add(font);

        mContextLength++;
    }

    public void pushContext(@Nullable ReadableMap font, @Nullable ReadableArray rotate, @Nullable ReadableArray deltaX, @Nullable ReadableArray deltaY, @Nullable String positionX, @Nullable String positionY) {
        mCurrentLocation = clonePointF(mCurrentLocation);

        if (positionX != null) {
            ArrayList<String> list = new ArrayList<>(Arrays.asList(positionX.trim().split("\\s+")));
            mCurrentLocation.x = PropHelper.fromPercentageToFloat(list.get(0), mWidth, 0, mScale);
            mXPositionsContext.add(list);
        } else {
            mXPositionsContext.add(new ArrayList<String>());
        }

        if (positionY != null) {
            ArrayList<String> list = new ArrayList<>(Arrays.asList(positionY.trim().split("\\s+")));
            mCurrentLocation.y = PropHelper.fromPercentageToFloat(list.get(0), mHeight, 0, mScale);
            mYPositionsContext.add(list);
        } else {
            mYPositionsContext.add(new ArrayList<String>());
        }

        ArrayList<Float> rotations = getFloatArrayListFromReadableArray(rotate);
        if (rotations.size() != 0) {
            mRotation = rotations.get(0);
            mRotationContext.add(mRotation);
            mRotationsContext.add(rotations);
            mRotationIndex = mRotationsContext.size();
        }

        ArrayList<Float> deltaXs = getFloatArrayListFromReadableArray(deltaX);
        if (deltaXs.size() != 0) {
            mDeltaXIndex = mDeltaXsContext.size();
            mDeltaXContext.add(mCurrentDelta.x);
            mDeltaXsContext.add(deltaXs);
        }

        ArrayList<Float> deltaYs = getFloatArrayListFromReadableArray(deltaY);
        if (deltaYs.size() != 0) {
            mDeltaYIndex = mDeltaYsContext.size();
            mDeltaYContext.add(mCurrentDelta.y);
            mDeltaYsContext.add(deltaYs);
        }

        mRotationIndexContext.add(mRotationIndex);
        mLocationContext.add(mCurrentLocation);
        mDeltaXIndexContext.add(mDeltaXIndex);
        mDeltaYIndexContext.add(mDeltaYIndex);
        mXContext.add(mCurrentLocation.x);
        mYContext.add(mCurrentLocation.y);
        mFontContext.add(font);

        mContextLength++;
    }

    public void popContext() {
        float dx = mDeltaXIndex > -1 ? mDeltaXContext.get(mDeltaXIndex) : 0f;
        float dy = mDeltaYIndex > -1 ? mDeltaYContext.get(mDeltaYIndex) : 0f;

        float x = mXContext.get(mContextLength - 1);
        float y = mYContext.get(mContextLength - 1);

        mRotationIndexContext.remove(mContextLength - 1);
        mDeltaXIndexContext.remove(mContextLength - 1);
        mDeltaYIndexContext.remove(mContextLength - 1);
        mXPositionsContext.remove(mContextLength - 1);
        mYPositionsContext.remove(mContextLength - 1);
        mLocationContext.remove(mContextLength - 1);
        mFontContext.remove(mContextLength - 1);
        mXContext.remove(mContextLength - 1);
        mYContext.remove(mContextLength - 1);

        mContextLength--;

        if (mRotationIndex == mContextLength) {
            mRotationsContext.remove(mRotationIndex);
            mRotationContext.remove(mRotationIndex);
        }

        if (mDeltaXIndex == mContextLength) {
            mDeltaXsContext.remove(mDeltaXIndex);
            mDeltaXContext.remove(mDeltaXIndex);
        }

        if (mDeltaYIndex == mContextLength) {
            mDeltaYsContext.remove(mDeltaYIndex);
            mDeltaYContext.remove(mDeltaYIndex);
        }

        if (mContextLength != 0) {
            mRotationIndex = mRotationIndexContext.get(mContextLength - 1);
            mCurrentLocation = mLocationContext.get(mContextLength - 1);
            mDeltaXIndex = mDeltaXIndexContext.get(mContextLength - 1);
            mDeltaYIndex = mDeltaYIndexContext.get(mContextLength - 1);

            mXContext.set(mContextLength - 1, x);
            mYContext.set(mContextLength - 1, y);

            if (mDeltaXIndex > -1) {
                mDeltaXContext.set(mDeltaXIndex, dx);
            }
            if (mDeltaYIndex > -1) {
                mDeltaYContext.set(mDeltaYIndex, dy);
            }

            mCurrentLocation.x = x;
            mCurrentLocation.y = y;
            mCurrentDelta.x = dx;
            mCurrentDelta.y = dy;

            mRotation = mRotationIndex > -1 ? mRotationContext.get(mRotationIndex) : 0f;
        } else {
            mCurrentDelta.x = mCurrentDelta.y = mRotation = 0;
            mDeltaXIndex = mDeltaYIndex = mRotationIndex = -1;
        }
    }

    public PointF getNextGlyphPoint(float offset, float glyphWidth) {
        if (hasNext(mXPositionsContext)) {
            mCurrentLocation.x = PropHelper.fromPercentageToFloat(getNextString(mXPositionsContext), mWidth, 0, mScale);
            resetDelta(mDeltaXContext);
            mCurrentDelta.x = 0;
        }
        if (hasNext(mYPositionsContext)) {
            mCurrentLocation.y = PropHelper.fromPercentageToFloat(getNextString(mYPositionsContext), mHeight, 0, mScale);
            resetDelta(mDeltaYContext);
            mCurrentDelta.y = 0;
        }

        mXContext.set(mXContext.size() - 1, mCurrentLocation.x + offset + glyphWidth);
        mYContext.set(mYContext.size() - 1, mCurrentLocation.y);

        return new PointF(mCurrentLocation.x + offset, mCurrentLocation.y);
    }

    private static void resetDelta(ArrayList<Float> context) {
        for (int i = context.size() - 1; i >= 0; i--) {
            context.set(i, 0f);
        }
    }

    public PointF getNextGlyphDelta() {
        if (mDeltaXIndex > -1) {
            mCurrentDelta.x = getNextDelta(mDeltaXsContext, mDeltaXContext);
        }
        if (mDeltaYIndex > -1) {
            mCurrentDelta.y = getNextDelta(mDeltaYsContext, mDeltaYContext);
        }

        return mCurrentDelta;
    }

    public float getNextGlyphRotation() {
        if (mRotationIndex > -1) {
            int index = mRotationsContext.size() - 1;
            int top = index;

            for (; index >= 0; index--) {
                List<Float> rotations = mRotationsContext.get(index);

                if (rotations.size() != 0) {
                    float val = rotations.remove(0);
                    mRotationContext.set(index, val);

                    if (index == top) {
                        mRotation = val;
                    }
                }
            }
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

    private float getNextDelta(List<? extends List<Float>> lists, List<Float> contexts) {
        int index = lists.size() - 1;
        int top = index;

        float delta = index > -1 ? contexts.get(index) : 0;

        for (; index >= 0; index--) {
            List<Float> deltas = lists.get(index);

            if (deltas.size() != 0) {
                float val = deltas.remove(0);

                if (top == index) {
                    float current = contexts.get(index);
                    float acc = current + val * mScale;
                    contexts.set(index, acc);
                    delta = acc;
                }
            }
        }

        return delta;
    }

    public String getNextString(ArrayList<ArrayList<String>> lists) {
        int index = lists.size() - 1;
        boolean valueSet = false;
        String value = "";

        for (; index >= 0; index--) {
            List<String> list = lists.get(index);

            if (list.size() != 0) {
                String val = list.remove(0);

                if (!valueSet) {
                    valueSet = true;
                    value = val;
                }
            }
        }

        return value;
    }

    public ReadableMap getGlyphFont() {
        float letterSpacing = DEFAULT_LETTER_SPACING;
        float fontSize = DEFAULT_FONT_SIZE;
        float kerning = DEFAULT_KERNING;

        boolean letterSpacingSet = false;
        boolean fontSizeSet = false;
        boolean kerningSet = false;

        String fontFamily = null;
        String fontWeight = null;
        String fontStyle = null;

        int index = mContextLength - 1;

        for (; index >= 0; index--) {
            ReadableMap font = mFontContext.get(index);

            if (fontFamily == null && font.hasKey("fontFamily")) {
                fontFamily = font.getString("fontFamily");
            }

            if (!fontSizeSet && font.hasKey("fontSize")) {
                fontSize = (float) font.getDouble("fontSize");
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

        map.putBoolean("isKerningValueSet", kerningSet);
        map.putDouble("letterSpacing", letterSpacing);
        map.putString("fontFamily", fontFamily);
        map.putString("fontWeight", fontWeight);
        map.putString("fontStyle", fontStyle);
        map.putDouble("fontSize", fontSize);
        map.putDouble("kerning", kerning);

        return map;
    }

    private ArrayList<Float> getFloatArrayListFromReadableArray(ReadableArray readableArray) {
        float fontSize = (float) getGlyphFont().getDouble("fontSize");
        ArrayList<Float> arrayList = new ArrayList<>();

        if (readableArray != null) {
            for (int i = 0; i < readableArray.size(); i++) {
                switch (readableArray.getType(i)) {
                    case String:
                        String val = readableArray.getString(i);
                        arrayList.add(Float.valueOf(val.substring(0, val.length() - 2)) * fontSize);
                        break;

                    case Number:
                        arrayList.add((float) readableArray.getDouble(i));
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
