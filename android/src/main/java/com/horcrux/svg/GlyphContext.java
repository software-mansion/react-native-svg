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
        mRotationContext.add(new ArrayList<Float>());
        mGlyphRotationContext.add(mRotation);
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
        mRotationContext.add(getFloatArrayListFromReadableArray(rotate));
        mGlyphRotationContext.add(mRotation);
        mXContext.add(location.x);
        mYContext.add(location.y);

        mCurrentLocation = clonePointF(location);
        mContextLength++;
    }

    public void popContext() {
        float x = mXContext.get(mContextLength - 1);
        float y = mYContext.get(mContextLength - 1);
        float r = mGlyphRotationContext.get(mContextLength - 1);
        mFontContext.remove(mContextLength - 1);
        mLocationContext.remove(mContextLength - 1);
        mXPositionsContext.remove(mContextLength - 1);
        mYPositionsContext.remove(mContextLength - 1);
        mDeltaContext.remove(mContextLength - 1);
        mDeltaXContext.remove(mContextLength - 1);
        mDeltaYContext.remove(mContextLength - 1);
        mRotationContext.remove(mContextLength - 1);
        mGlyphRotationContext.remove(mContextLength - 1);
        mXContext.remove(mContextLength - 1);
        mYContext.remove(mContextLength - 1);

        mContextLength--;

        if (mContextLength != 0) {
            mXContext.set(mContextLength - 1, x);
            mYContext.set(mContextLength - 1, y);
            mGlyphRotationContext.set(mContextLength - 1, r);
            PointF lastLocation = mLocationContext.get(mContextLength - 1);
            PointF lastDelta = mDeltaContext.get(mContextLength - 1);
            mCurrentLocation = clonePointF(lastLocation);
            mCurrentDelta = clonePointF(lastDelta);
            mCurrentLocation.x = lastLocation.x = x;
            mCurrentLocation.y = lastLocation.y = y;
            mRotation = r;
        }
    }

    public PointF getNextGlyphPoint(float offset, float glyphWidth) {
        if (hasNextString(mXPositionsContext)) {
            mCurrentLocation.x = PropHelper.fromPercentageToFloat(getNextString(mXPositionsContext), mWidth, 0, mScale);
            mCurrentDelta.x = 0;
        }
        if (hasNextString(mYPositionsContext)) {
            mCurrentLocation.y = PropHelper.fromPercentageToFloat(getNextString(mYPositionsContext), mHeight, 0, mScale);
            mCurrentDelta.y = 0;
        }

        mXContext.set(mXContext.size() - 1, mCurrentLocation.x + offset + glyphWidth);
        mYContext.set(mYContext.size() - 1, mCurrentLocation.y);

        return new PointF(mCurrentLocation.x + offset, mCurrentLocation.y);
    }

    public PointF getNextGlyphDelta() {
        float dx = mScale * getNextFloat(mDeltaXContext);
        float dy = mScale * getNextFloat(mDeltaYContext);

        if (mContextLength > 0) {
            for (PointF point: mDeltaContext) {
                point.x += dx;
                point.y += dy;
            }

            return mDeltaContext.get(mContextLength - 1);
        }

        return new PointF(dx, dy);
    }

    public float getNextGlyphRotation() {
        if (hasNextFloat(mRotationContext)) {
            float r = getNextFloat(mRotationContext);

            if (mContextLength > 0) {
                for (int i = 0; i < mContextLength; i++) {
                    mGlyphRotationContext.set(i, r);
                }

                return mGlyphRotationContext.get(mContextLength - 1);
            }

            return r;
        } else if (mContextLength > 0) {
            return mGlyphRotationContext.get(mContextLength - 1);
        }

        return 0;
    }

    private float getNextFloat(ArrayList<ArrayList<Float>> context) {
        return getNextFloat(context, 0);
    }

    private boolean hasNextString(ArrayList<ArrayList<String>> context) {
        int index = mContextLength - 1;

        for (; index >= 0; index--) {
            ArrayList delta = context.get(index);

            if (delta.size() != 0) {
                return true;
            }
        }

        return false;
    }

    private boolean hasNextFloat(ArrayList<ArrayList<Float>> context) {
        int index = mContextLength - 1;

        for (; index >= 0; index--) {
            ArrayList<Float> delta = context.get(index);

            if (delta.size() != 0) {
                return true;
            }
        }

        return false;
    }

    private float getNextFloat(ArrayList<ArrayList<Float>> context, float value) {
        boolean valueSet = false;
        int index = mContextLength - 1;

        for (; index >= 0; index--) {
            ArrayList<Float> delta = context.get(index);

            if (delta.size() != 0) {
                if (!valueSet) {
                    value = delta.get(0);
                    valueSet = true;
                }

                delta.remove(0);
            }
        }

        return value;
    }

    private String getNextString(ArrayList<ArrayList<String>> context) {
        String value = "";
        boolean valueSet = false;
        int index = mContextLength - 1;

        for (; index >= 0; index--) {
            ArrayList<String> delta = context.get(index);

            if (delta.size() != 0) {
                if (!valueSet) {
                    value = delta.get(0);
                    valueSet = true;
                }

                delta.remove(0);
            }
        }

        return value;
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
