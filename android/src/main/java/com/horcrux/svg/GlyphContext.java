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
import java.util.List;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

class GlyphContext {
    static final float DEFAULT_FONT_SIZE = 12f;
    private static final float DEFAULT_KERNING = 0f;
    private static final float DEFAULT_LETTER_SPACING = 0f;

    private ArrayList<ArrayList<String>> mXPositionsContext = new ArrayList<>();
    private ArrayList<ArrayList<String>> mYPositionsContext = new ArrayList<>();
    private ArrayList<ArrayList<Float>> mRotationsContext = new ArrayList<>();
    private ArrayList<ArrayList<Float>> mDeltaXsContext = new ArrayList<>();
    private ArrayList<ArrayList<Float>> mDeltaYsContext = new ArrayList<>();
    private ArrayList<ReadableMap> mFontContext = new ArrayList<>();
    private ArrayList<Float> mRotationContext = new ArrayList<>();
    private ArrayList<GroupShadowNode> mNodes = new ArrayList<>();
    private ArrayList<Float> mRotations = new ArrayList<>();
    private @Nonnull PointF mCurrentLocation = new PointF();
    private ArrayList<Float> mDeltaXs = new ArrayList<>();
    private ArrayList<Float> mDeltaYs = new ArrayList<>();
    private @Nonnull PointF mCurrentDelta = new PointF();
    private ArrayList<String> mXs = new ArrayList<>();
    private ArrayList<String> mYs = new ArrayList<>();
    private int mContextLength;
    private float mRotation;
    private float mHeight;
    private float mWidth;
    private float mScale;
    private int top = -1;

    GlyphContext(float scale, float width, float height) {
        mHeight = height;
        mWidth = width;
        mScale = scale;
    }

    void pushContext(GroupShadowNode node, @Nullable ReadableMap font) {
        mRotationsContext.add(mRotations);
        mRotationContext.add(mRotation);
        mDeltaXsContext.add(mDeltaXs);
        mDeltaYsContext.add(mDeltaYs);
        mXPositionsContext.add(mXs);
        mYPositionsContext.add(mYs);
        mFontContext.add(font);
        mNodes.add(node);
        mContextLength++;
        top++;
    }

    void pushContext(TextShadowNode node, @Nullable ReadableMap font, @Nullable ReadableArray rotate, @Nullable ReadableArray deltaX, @Nullable ReadableArray deltaY, @Nullable String positionX, @Nullable String positionY) {
        if (positionX != null) {
            mXs = new ArrayList<>(Arrays.asList(positionX.trim().split("\\s+")));
        }

        if (positionY != null) {
            mYs = new ArrayList<>(Arrays.asList(positionY.trim().split("\\s+")));
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
        mXPositionsContext.add(mXs);
        mYPositionsContext.add(mYs);
        mFontContext.add(font);
        mNodes.add(node);
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
        mNodes.remove(mContextLength);

        if (mContextLength != 0) {
            mRotations = mRotationsContext.get(top);
            mRotation = mRotationContext.get(top);
            mDeltaXs = mDeltaXsContext.get(top);
            mDeltaYs = mDeltaYsContext.get(top);
            mXs = mXPositionsContext.get(top);
            mYs = mYPositionsContext.get(top);
        } else {
            mCurrentDelta.x = mCurrentDelta.y = mRotation = 0;
            mCurrentLocation.x = mCurrentLocation.y = 0;
        }
    }

    PointF getNextGlyphPoint(float glyphWidth) {
        mCurrentLocation.x = getGlyphPosition(true);
        mCurrentLocation.y = getGlyphPosition(false);
        mCurrentLocation.x += glyphWidth;
        return mCurrentLocation;
    }

    PointF getNextGlyphDelta() {
        mCurrentDelta.x = getNextDelta(true);
        mCurrentDelta.y = getNextDelta(false);
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

    private float getNextDelta(boolean isX) {
        ArrayList<ArrayList<Float>> lists = isX ? mDeltaXsContext : mDeltaYsContext;
        float delta = isX ? mCurrentDelta.x : mCurrentDelta.y;
        List<Float> prev = null;

        for (int index = top; index >= 0; index--) {
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

    private float getGlyphPosition(boolean isX) {
        ArrayList<ArrayList<String>> lists = isX ? mXPositionsContext : mYPositionsContext;
        float value = isX ? mCurrentLocation.x : mCurrentLocation.y;
        List<String> prev = null;

        for (int index = top; index >= 0; index--) {
            List<String> list = lists.get(index);

            if (prev != list && list.size() != 0) {
                String val = list.remove(0);

                if (top == index) {
                    float relative = isX ? mWidth : mHeight;
                    value = PropHelper.fromRelativeToFloat(val, relative, 0, mScale, getFontSize());
                    if (isX) {
                        mCurrentDelta.x = 0;
                    } else {
                        mCurrentDelta.y = 0;
                    }
                }
            }

            prev = list;
        }

        return value;
    }

    double getFontSize() {
        for (int index = top; index >= 0; index--) {
            ReadableMap font = mFontContext.get(index);

            if (mFontContext.get(index).hasKey("fontSize")) {
                return font.getDouble("fontSize");
            }
        }

        if (top > -1) {
            return mNodes.get(0).getFontSizeFromParentContext();
        }

        return DEFAULT_FONT_SIZE;
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
        for (int index = top; index >= 0; index--) {
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
        ArrayList<Float> arrayList = new ArrayList<>();

        if (readableArray != null) {
            for (int i = 0; i < readableArray.size(); i++) {
                switch (readableArray.getType(i)) {
                    case String:
                        String val = readableArray.getString(i);
                        arrayList.add((float) (Float.valueOf(val.substring(0, val.length() - 2)) * getFontSize()));
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
