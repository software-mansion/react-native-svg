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

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

class GlyphContext {
    static final float DEFAULT_FONT_SIZE = 12f;
    private static final float DEFAULT_KERNING = 0f;
    private static final float DEFAULT_LETTER_SPACING = 0f;

    // Unique input attribute lists (only added if node sets a value)
    private final ArrayList<String[]> mXPositionsContext = new ArrayList<>();
    private final ArrayList<String[]> mYPositionsContext = new ArrayList<>();
    private final ArrayList<float[]> mRotationsContext = new ArrayList<>();
    private final ArrayList<float[]> mDeltaXsContext = new ArrayList<>();
    private final ArrayList<float[]> mDeltaYsContext = new ArrayList<>();

    // Unique index into attribute list (one per unique list)
    private final ArrayList<Integer> mXPositionIndices = new ArrayList<>();
    private final ArrayList<Integer> mYPositionIndices = new ArrayList<>();
    private final ArrayList<Integer> mRotationIndices = new ArrayList<>();
    private final ArrayList<Integer> mDeltaXIndices = new ArrayList<>();
    private final ArrayList<Integer> mDeltaYIndices = new ArrayList<>();

    // Index of unique context used (one per node push/pop)
    private final ArrayList<Integer> mXPositionsIndices = new ArrayList<>();
    private final ArrayList<Integer> mYPositionsIndices = new ArrayList<>();
    private final ArrayList<Integer> mRotationsIndices = new ArrayList<>();
    private final ArrayList<Integer> mDeltaXsIndices = new ArrayList<>();
    private final ArrayList<Integer> mDeltaYsIndices = new ArrayList<>();

    // Current stack (one per node push/pop)
    private final ArrayList<ReadableMap> mFontContext = new ArrayList<>();
    private final ArrayList<GroupShadowNode> mNodes = new ArrayList<>();

    // Current accumulated values
    private @Nonnull final PointF mCurrentPosition = new PointF();
    private @Nonnull final PointF mCurrentDelta = new PointF();
    private double fontSize = DEFAULT_FONT_SIZE;

    // Current attribute list
    private float[] mRotations = new float[] {0};
    private float[] mDeltaXs = new float[] {};
    private float[] mDeltaYs = new float[] {};
    private String[] mXs = new String[] {};
    private String[] mYs = new String[] {};

    // Current attribute list index
    private int mXPositionsIndex;
    private int mYPositionsIndex;
    private int mRotationsIndex;
    private int mDeltaXsIndex;
    private int mDeltaYsIndex;

    // Current value index in current attribute list
    private int mXPositionIndex = -1;
    private int mYPositionIndex = -1;
    private int mRotationIndex = -1;
    private int mDeltaXIndex = -1;
    private int mDeltaYIndex = -1;

    private int mContextLength;
    private int top = -1;

    // Constructor parameters
    private final float mScale;
    private final float mWidth;
    private final float mHeight;

    GlyphContext(float scale, float width, float height) {
        mScale = scale;
        mWidth = width;
        mHeight = height;

        mXPositionsContext.add(mXs);
        mYPositionsContext.add(mYs);
        mDeltaXsContext.add(mDeltaXs);
        mDeltaYsContext.add(mDeltaYs);
        mRotationsContext.add(mRotations);

        mXPositionIndices.add(mXPositionIndex);
        mYPositionIndices.add(mYPositionIndex);
        mRotationIndices.add(mRotationIndex);
        mDeltaXIndices.add(mDeltaXIndex);
        mDeltaYIndices.add(mDeltaYIndex);

        pushIndices();
    }

    void pushContext(GroupShadowNode node, @Nullable ReadableMap font) {
        mFontContext.add(font);
        mNodes.add(node);
        mContextLength++;
        pushIndices();
        top++;

        fontSize = getFontSize();
    }

    void pushContext(TextShadowNode node, @Nullable ReadableMap font, @Nullable ReadableArray rotate, @Nullable ReadableArray deltaX, @Nullable ReadableArray deltaY, @Nullable String positionX, @Nullable String positionY, boolean resetPosition) {
        if (resetPosition) {
            reset();
        }

        if (positionX != null) {
            mXPositionsIndex++;
            mXPositionIndex = -1;
            mXs = positionX.trim().split("\\s+");
            mXPositionIndices.add(mXPositionIndex);
            mXPositionsContext.add(mXs);
        }

        if (positionY != null) {
            mYPositionsIndex++;
            mYPositionIndex = -1;
            mYs = positionY.trim().split("\\s+");
            mYPositionIndices.add(mYPositionIndex);
            mYPositionsContext.add(mYs);
        }

        float[] rotations = getFloatArrayFromReadableArray(rotate);
        if (rotations.length != 0) {
            mRotationsIndex++;
            mRotationIndex = -1;
            mRotations = rotations;
            mRotationsContext.add(mRotations);
            mRotationIndices.add(mRotationIndex);
        }

        float[] deltaXs = getFloatArrayFromReadableArray(deltaX);
        if (deltaXs.length != 0) {
            mDeltaXsIndex++;
            mDeltaXIndex = -1;
            mDeltaXs = deltaXs;
            mDeltaXsContext.add(mDeltaXs);
            mDeltaXIndices.add(mDeltaXIndex);
        }

        float[] deltaYs = getFloatArrayFromReadableArray(deltaY);
        if (deltaYs.length != 0) {
            mDeltaYsIndex++;
            mDeltaYIndex = -1;
            mDeltaYs = deltaYs;
            mDeltaYsContext.add(mDeltaYs);
            mDeltaYIndices.add(mDeltaYIndex);
        }

        mFontContext.add(font);
        mNodes.add(node);
        mContextLength++;
        pushIndices();
        top++;

        fontSize = getFontSize();
    }

    private void pushIndices() {
        mXPositionsIndices.add(mXPositionsIndex);
        mYPositionsIndices.add(mYPositionsIndex);
        mRotationsIndices.add(mRotationsIndex);
        mDeltaXsIndices.add(mDeltaXsIndex);
        mDeltaYsIndices.add(mDeltaYsIndex);
    }

    private void reset() {
        mXPositionsIndex = mYPositionsIndex = mRotationsIndex = mDeltaXsIndex = mDeltaYsIndex = 0;
        mXPositionIndex = mYPositionIndex = mRotationIndex = mDeltaXIndex = mDeltaYIndex = -1;
        mCurrentPosition.x = mCurrentPosition.y = mCurrentDelta.x = mCurrentDelta.y = 0;
    }

    void popContext() {
        mContextLength--;
        top--;

        mFontContext.remove(mContextLength);
        mNodes.remove(mContextLength);

        mXPositionsIndices.remove(mContextLength);
        mYPositionsIndices.remove(mContextLength);
        mRotationsIndices.remove(mContextLength);
        mDeltaXsIndices.remove(mContextLength);
        mDeltaYsIndices.remove(mContextLength);

        int x = mXPositionsIndex;
        int y = mYPositionsIndex;
        int r = mRotationsIndex;
        int dx = mDeltaXsIndex;
        int dy = mDeltaYsIndex;

        if (mContextLength == 0) {
            reset();
        }

        mXPositionsIndex = mXPositionsIndices.get(mContextLength);
        mYPositionsIndex = mYPositionsIndices.get(mContextLength);
        mRotationsIndex = mRotationsIndices.get(mContextLength);
        mDeltaXsIndex = mDeltaXsIndices.get(mContextLength);
        mDeltaYsIndex = mDeltaYsIndices.get(mContextLength);

        if (x != mXPositionsIndex) {
            mXPositionsContext.remove(x);
            mXs = mXPositionsContext.get(mXPositionsIndex);
            mXPositionIndex = mXPositionIndices.get(mXPositionsIndex);
        }
        if (y != mYPositionsIndex) {
            mYPositionsContext.remove(y);
            mYs = mYPositionsContext.get(mYPositionsIndex);
            mYPositionIndex = mYPositionIndices.get(mYPositionsIndex);
        }
        if (r != mRotationsIndex) {
            mRotationsContext.remove(r);
            mRotations = mRotationsContext.get(mRotationsIndex);
            mRotationIndex = mRotationIndices.get(mRotationsIndex);
        }
        if (dx != mDeltaXsIndex) {
            mDeltaXsContext.remove(dx);
            mDeltaXs = mDeltaXsContext.get(mDeltaXsIndex);
            mDeltaXIndex = mDeltaXIndices.get(mDeltaXsIndex);
        }
        if (dy != mDeltaYsIndex) {
            mDeltaYsContext.remove(dy);
            mDeltaYs = mDeltaYsContext.get(mDeltaYsIndex);
            mDeltaYIndex = mDeltaYIndices.get(mDeltaYsIndex);
        }
    }

    PointF getNextGlyphPoint(float glyphWidth) {
        mCurrentPosition.x = getGlyphPosition(true);
        mCurrentPosition.y = getGlyphPosition(false);
        mCurrentPosition.x += glyphWidth;
        return mCurrentPosition;
    }

    PointF getNextGlyphDelta() {
        mCurrentDelta.x = getNextDelta(true);
        mCurrentDelta.y = getNextDelta(false);
        return mCurrentDelta;
    }

    float getNextGlyphRotation() {
        float[] context = mRotations;

        for (int index = mRotationsIndex; index >= 0; index--) {
            int rotationIndex = mRotationIndices.get(index);
            mRotationIndices.set(index, rotationIndex + 1);
        }

        mRotationIndex = Math.min(mRotationIndex + 1, context.length - 1);

        return context[mRotationIndex];
    }

    private float getNextDelta(boolean isX) {
        ArrayList<Integer> deltaIndices = isX ? mDeltaXIndices : mDeltaYIndices;
        int deltasIndex = isX ? mDeltaXsIndex : mDeltaYsIndex;
        float delta = isX ? mCurrentDelta.x : mCurrentDelta.y;
        int currentIndex = isX ? mDeltaXIndex : mDeltaYIndex;
        float[] context = isX ? mDeltaXs : mDeltaYs;

        for (int index = deltasIndex; index >= 0; index--) {
            int deltaIndex = deltaIndices.get(index);
            deltaIndices.set(index, deltaIndex + 1);
        }

        int nextIndex = currentIndex + 1;
        if (nextIndex < context.length) {
            if (isX) {
                mDeltaXIndex = nextIndex;
            } else {
                mDeltaYIndex = nextIndex;
            }
            float val  = context[nextIndex];
            delta += val * mScale;
        }

        return delta;
    }

    private float getGlyphPosition(boolean isX) {
        ArrayList<Integer> positionIndices = isX ? mXPositionIndices : mYPositionIndices;
        int positionsIndex = isX ? mXPositionsIndex : mYPositionsIndex;
        float value = isX ? mCurrentPosition.x : mCurrentPosition.y;
        int currentIndex = isX ? mXPositionIndex : mYPositionIndex;
        String[] context = isX ? mXs : mYs;

        for (int index = positionsIndex; index >= 0; index--) {
            int positionIndex = positionIndices.get(index);
            positionIndices.set(index, positionIndex + 1);
        }

        int nextIndex = currentIndex + 1;
        if (nextIndex < context.length) {
            if (isX) {
                mCurrentDelta.x = 0;
                mXPositionIndex = nextIndex;
            } else {
                mCurrentDelta.y = 0;
                mYPositionIndex = nextIndex;
            }
            String val  = context[nextIndex];
            float relative = isX ? mWidth : mHeight;
            value = PropHelper.fromRelativeToFloat(val, relative, 0, mScale, fontSize);
        }

        return value;
    }

    float getWidth() {
        return mWidth;
    }

    float getHeight() {
        return mHeight;
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
        float kerning = DEFAULT_KERNING;

        boolean letterSpacingSet = false;
        boolean kerningSet = false;

        String fontFamily = null;
        String fontWeight = null;
        String fontStyle = null;

        for (int index = top; index >= 0; index--) {
            ReadableMap font = mFontContext.get(index);

            if (fontFamily == null && font.hasKey("fontFamily")) {
                fontFamily = font.getString("fontFamily");
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

            if (fontFamily != null && kerningSet && letterSpacingSet && fontWeight != null && fontStyle != null) {
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

    private float[] getFloatArrayFromReadableArray(ReadableArray readableArray) {
        if (readableArray != null) {
            int size = readableArray.size();
            float[] floats = new float[size];
            for (int i = 0; i < size; i++) {
                switch (readableArray.getType(i)) {
                    case String:
                        String val = readableArray.getString(i);
                        floats[i] = (float) (Float.valueOf(val.substring(0, val.length() - 2)) * fontSize);
                        break;

                    case Number:
                        floats[i] = (float) readableArray.getDouble(i);
                        break;
                }
            }
            return floats;
        }

        return new float[0];
    }
}
