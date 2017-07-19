/*
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

class GlyphContext {

    private ArrayList<ArrayList<String>> mXPositionsContext;
    private ArrayList<ArrayList<String>> mYPositionsContext;
    private ArrayList<ArrayList<Float>> mRotationsContext;
    private ArrayList<ArrayList<Float>> mDeltaXsContext;
    private ArrayList<ArrayList<Float>> mDeltaYsContext;
    private ArrayList<ReadableMap> mFontContext;
    private ArrayList<Float> mRotationContext;
    private ArrayList<Float> mRotations;
    private ArrayList<Float> mDeltaXs;
    private ArrayList<Float> mDeltaYs;

    private @Nonnull PointF mCurrentLocation;
    private @Nonnull PointF mCurrentDelta;

    private int top = -1;
    private float mScale;
    private float mWidth;
    private float mHeight;
    private float mRotation;
    private int mContextLength;

    private static final float DEFAULT_KERNING = 0f;
    private static final float DEFAULT_FONT_SIZE = 12f;
    private static final float DEFAULT_LETTER_SPACING = 0f;

    GlyphContext(float scale, float width, float height) {
        mXPositionsContext = new ArrayList<>();
        mYPositionsContext = new ArrayList<>();
        mRotationsContext = new ArrayList<>();
        mRotationContext = new ArrayList<>();
        mDeltaXsContext = new ArrayList<>();
        mDeltaYsContext = new ArrayList<>();
        mFontContext = new ArrayList<>();
        mRotations = new ArrayList<>();
        mDeltaXs = new ArrayList<>();
        mDeltaYs = new ArrayList<>();

        mCurrentLocation = new PointF();
        mCurrentDelta = new PointF();

        mHeight = height;
        mWidth = width;
        mScale = scale;
    }

    void pushContext(@Nullable ReadableMap font) {
        mXPositionsContext.add(new ArrayList<String>());
        mYPositionsContext.add(new ArrayList<String>());
        mRotationsContext.add(mRotations);
        mRotationContext.add(mRotation);
        mDeltaXsContext.add(mDeltaXs);
        mDeltaYsContext.add(mDeltaYs);
        mFontContext.add(font);
        mContextLength++;
        top++;
    }

    void pushContext(@Nullable ReadableMap font, @Nullable ReadableArray rotate, @Nullable ReadableArray deltaX, @Nullable ReadableArray deltaY, @Nullable String positionX, @Nullable String positionY) {
        if (positionX != null) {
            ArrayList<String> list = new ArrayList<>(Arrays.asList(positionX.trim().split("\\s+")));
            mXPositionsContext.add(list);
        } else {
            mXPositionsContext.add(new ArrayList<String>());
        }

        if (positionY != null) {
            ArrayList<String> list = new ArrayList<>(Arrays.asList(positionY.trim().split("\\s+")));
            mYPositionsContext.add(list);
        } else {
            mYPositionsContext.add(new ArrayList<String>());
        }

        ArrayList<Float> rotations = getFloatArrayListFromReadableArray(rotate);
        if (rotations.size() != 0) {
            mRotation = rotations.get(0);
            mRotations = rotations;
        }

        ArrayList<Float> deltaXs = getFloatArrayListFromReadableArray(deltaX);
        if (deltaXs.size() != 0) {
            mDeltaXs = deltaXs;
        }

        ArrayList<Float> deltaYs = getFloatArrayListFromReadableArray(deltaY);
        if (deltaYs.size() != 0) {
            mDeltaYs = deltaYs;
        }

        mRotationsContext.add(mRotations);
        mRotationContext.add(mRotation);
        mDeltaXsContext.add(mDeltaXs);
        mDeltaYsContext.add(mDeltaYs);
        mFontContext.add(font);
        mContextLength++;
        top++;
    }

    void popContext() {
        mContextLength--;
        top--;

        mXPositionsContext.remove(mContextLength);
        mYPositionsContext.remove(mContextLength);

        mRotationsContext.remove(mContextLength);
        mRotationContext.remove(mContextLength);

        mDeltaXsContext.remove(mContextLength);
        mDeltaYsContext.remove(mContextLength);

        mFontContext.remove(mContextLength);

        if (mContextLength != 0) {
            mRotations = mRotationsContext.get(top);
            mRotation = mRotationContext.get(top);
            mDeltaXs = mDeltaXsContext.get(top);
            mDeltaYs = mDeltaYsContext.get(top);
        } else {
            mCurrentDelta.x = mCurrentDelta.y = mRotation = 0;
            mCurrentLocation.x = mCurrentLocation.y = 0;
        }
    }

    PointF getNextGlyphPoint(float glyphWidth) {
        if (hasNext(mXPositionsContext)) {
            String nextString = getNextString(mXPositionsContext);
            mCurrentLocation.x = PropHelper.fromPercentageToFloat(nextString, mWidth, 0, mScale);
            mCurrentDelta.x = 0;
        }
        if (hasNext(mYPositionsContext)) {
            String nextString = getNextString(mYPositionsContext);
            mCurrentLocation.y = PropHelper.fromPercentageToFloat(nextString, mHeight, 0, mScale);
            mCurrentDelta.y = 0;
        }

        mCurrentLocation.x += glyphWidth;

        return mCurrentLocation;
    }

    PointF getNextGlyphDelta() {
        mCurrentDelta.x = getNextDelta(mDeltaXsContext, mCurrentDelta.x);
        mCurrentDelta.y = getNextDelta(mDeltaYsContext, mCurrentDelta.y);
        return mCurrentDelta;
    }

    float getNextGlyphRotation() {
        List<Float> prev = null;
        int index = top;

        for (; index >= 0; index--) {
            List<Float> rotations = mRotationsContext.get(index);

            if (prev != rotations && rotations.size() != 0) {
                float val = rotations.remove(0);
                mRotationContext.set(index, val);

                if (index == top) {
                    mRotation = val;
                }
            }

            prev = rotations;
        }

        return mRotation;
    }

    private boolean hasNext(List<? extends Collection<?>> context) {
        int index = top;

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

    private float getNextDelta(List<? extends List<Float>> lists, float current) {
        List<Float> prev = null;
        int index = top;

        float delta = current;

        for (; index >= 0; index--) {
            List<Float> deltas = lists.get(index);

            if (prev != deltas && deltas.size() != 0) {
                float val = deltas.remove(0);

                if (top == index) {
                    delta += val * mScale;
                }
            }

            prev = deltas;
        }

        return delta;
    }

    private String getNextString(ArrayList<ArrayList<String>> lists) {
        boolean valueSet = false;
        String value = "";
        int index = top;

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

    ReadableMap getGlyphFont() {
        float letterSpacing = DEFAULT_LETTER_SPACING;
        float fontSize = DEFAULT_FONT_SIZE;
        float kerning = DEFAULT_KERNING;

        boolean letterSpacingSet = false;
        boolean fontSizeSet = false;
        boolean kerningSet = false;

        String fontFamily = null;
        String fontWeight = null;
        String fontStyle = null;

        // TODO: add support for other length units
        for (int index = mContextLength - 1; index >= 0; index--) {
            ReadableMap font = mFontContext.get(index);

            if (fontFamily == null && font.hasKey("fontFamily")) {
                fontFamily = font.getString("fontFamily");
            }

            if (!fontSizeSet && font.hasKey("fontSize")) {
                fontSize = (float) font.getDouble("fontSize");
                fontSizeSet = true;
            }

            if (!kerningSet && font.hasKey("kerning")) {
                kerning = Float.valueOf(font.getString("kerning"));
                kerningSet = true;
            }

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
}
