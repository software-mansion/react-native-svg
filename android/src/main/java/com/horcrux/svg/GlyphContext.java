/*
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.util.ArrayList;

import javax.annotation.Nullable;

class GlyphContext {
    static final float DEFAULT_FONT_SIZE = 12f;

    private static final String KERNING = "kerning";
    private static final String FONT_SIZE = "fontSize";
    private static final String FONT_STYLE = "fontStyle";
    private static final String FONT_WEIGHT = "fontWeight";
    private static final String FONT_FAMILY = "fontFamily";
    private static final String LETTER_SPACING = "letterSpacing";
    private static final String IS_KERNING_VALUE_SET = "isKerningValueSet";

    // Unique input attribute lists (only added if node sets a value)
    private final ArrayList<String[]> mXsContext = new ArrayList<>();
    private final ArrayList<String[]> mYsContext = new ArrayList<>();
    private final ArrayList<float[]> mRsContext = new ArrayList<>();
    private final ArrayList<float[]> mdXsContext = new ArrayList<>();
    private final ArrayList<float[]> mdYsContext = new ArrayList<>();

    // Unique index into attribute list (one per unique list)
    private final ArrayList<Integer> mXIndices = new ArrayList<>();
    private final ArrayList<Integer> mYIndices = new ArrayList<>();
    private final ArrayList<Integer> mRIndices = new ArrayList<>();
    private final ArrayList<Integer> mdXIndices = new ArrayList<>();
    private final ArrayList<Integer> mdYIndices = new ArrayList<>();

    // Index of unique context used (one per node push/pop)
    private final ArrayList<Integer> mXsIndices = new ArrayList<>();
    private final ArrayList<Integer> mYsIndices = new ArrayList<>();
    private final ArrayList<Integer> mRsIndices = new ArrayList<>();
    private final ArrayList<Integer> mdXsIndices = new ArrayList<>();
    private final ArrayList<Integer> mdYsIndices = new ArrayList<>();

    // Current stack (one per node push/pop)
    private final ArrayList<ReadableMap> mFontContext = new ArrayList<>();
    private final ArrayList<GroupShadowNode> mNodes = new ArrayList<>();

    // Cached per push context
    private double fontSize = DEFAULT_FONT_SIZE;

    // Current values
    private float mr;

    // Current accumulated values
    private float mx;
    private float my;
    private float mdx;
    private float mdy;

    // Current attribute list
    private String[] mXs = new String[]{};
    private String[] mYs = new String[]{};
    private float[] mRs = new float[]{0};
    private float[] mdXs = new float[]{};
    private float[] mdYs = new float[]{};

    // Current attribute list index
    private int mXsIndex;
    private int mYsIndex;
    private int mRsIndex;
    private int mdXsIndex;
    private int mdYsIndex;

    // Current value index in current attribute list
    private int mXIndex = -1;
    private int mYIndex = -1;
    private int mRIndex = -1;
    private int mdXIndex = -1;
    private int mdYIndex = -1;

    // Stack length and last index
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

        mXsContext.add(mXs);
        mYsContext.add(mYs);
        mdXsContext.add(mdXs);
        mdYsContext.add(mdYs);
        mRsContext.add(mRs);

        mXIndices.add(mXIndex);
        mYIndices.add(mYIndex);
        mRIndices.add(mRIndex);
        mdXIndices.add(mdXIndex);
        mdYIndices.add(mdYIndex);

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

    void pushContext(
        boolean reset,
        TextShadowNode node,
        @Nullable ReadableMap font,
        @Nullable String x,
        @Nullable String y,
        @Nullable ReadableArray rotate,
        @Nullable ReadableArray deltaX,
        @Nullable ReadableArray deltaY
    ) {
        if (reset) {
            this.reset();
        }

        mFontContext.add(font);
        mNodes.add(node);
        mContextLength++;
        top++;

        fontSize = getFontSize();

        if (x != null) {
            mXsIndex++;
            mXIndex = -1;
            mXIndices.add(mXIndex);
            mXs = x.trim().split("\\s+");
            mXsContext.add(mXs);
        }

        if (y != null) {
            mYsIndex++;
            mYIndex = -1;
            mYIndices.add(mYIndex);
            mYs = y.trim().split("\\s+");
            mYsContext.add(mYs);
        }

        if (rotate != null && rotate.size() != 0) {
            mRsIndex++;
            mRIndex = -1;
            mRIndices.add(mRIndex);
            mRs = getFloatArrayFromReadableArray(rotate);
            mRsContext.add(mRs);
        }

        if (deltaX != null && deltaX.size() != 0) {
            mdXsIndex++;
            mdXIndex = -1;
            mdXIndices.add(mdXIndex);
            mdXs = getFloatArrayFromReadableArray(deltaX);
            mdXsContext.add(mdXs);
        }

        if (deltaY != null && deltaY.size() != 0) {
            mdYsIndex++;
            mdYIndex = -1;
            mdYIndices.add(mdYIndex);
            mdYs = getFloatArrayFromReadableArray(deltaY);
            mdYsContext.add(mdYs);
        }

        pushIndices();
    }

    private void pushIndices() {
        mXsIndices.add(mXsIndex);
        mYsIndices.add(mYsIndex);
        mRsIndices.add(mRsIndex);
        mdXsIndices.add(mdXsIndex);
        mdYsIndices.add(mdYsIndex);
    }

    private void reset() {
        mXsIndex = mYsIndex = mRsIndex = mdXsIndex = mdYsIndex = 0;
        mXIndex = mYIndex = mRIndex = mdXIndex = mdYIndex = -1;
        mx = my = mr = mdx = mdy = 0;
    }

    void popContext() {
        mXsIndices.remove(mContextLength);
        mYsIndices.remove(mContextLength);
        mRsIndices.remove(mContextLength);
        mdXsIndices.remove(mContextLength);
        mdYsIndices.remove(mContextLength);

        mContextLength--;
        top--;

        mNodes.remove(mContextLength);
        mFontContext.remove(mContextLength);

        int x = mXsIndex;
        int y = mYsIndex;
        int r = mRsIndex;
        int dx = mdXsIndex;
        int dy = mdYsIndex;

        mXsIndex = mXsIndices.get(mContextLength);
        mYsIndex = mYsIndices.get(mContextLength);
        mRsIndex = mRsIndices.get(mContextLength);
        mdXsIndex = mdXsIndices.get(mContextLength);
        mdYsIndex = mdYsIndices.get(mContextLength);

        if (x != mXsIndex) {
            mXsContext.remove(x);
            mXs = mXsContext.get(mXsIndex);
            mXIndex = mXIndices.get(mXsIndex);
        }
        if (y != mYsIndex) {
            mYsContext.remove(y);
            mYs = mYsContext.get(mYsIndex);
            mYIndex = mYIndices.get(mYsIndex);
        }
        if (r != mRsIndex) {
            mRsContext.remove(r);
            mRs = mRsContext.get(mRsIndex);
            mRIndex = mRIndices.get(mRsIndex);
        }
        if (dx != mdXsIndex) {
            mdXsContext.remove(dx);
            mdXs = mdXsContext.get(mdXsIndex);
            mdXIndex = mdXIndices.get(mdXsIndex);
        }
        if (dy != mdYsIndex) {
            mdYsContext.remove(dy);
            mdYs = mdYsContext.get(mdYsIndex);
            mdYIndex = mdYIndices.get(mdYsIndex);
        }
    }

    float nextX(float glyphWidth) {
        for (int index = mXsIndex; index >= 0; index--) {
            int xIndex = mXIndices.get(index);
            mXIndices.set(index, xIndex + 1);
        }

        int nextIndex = mXIndex + 1;
        if (nextIndex < mXs.length) {
            mdx = 0;
            mXIndex = nextIndex;
            String val = mXs[nextIndex];
            mx = PropHelper.fromRelativeToFloat(val, mWidth, 0, mScale, fontSize);
        }

        mx += glyphWidth;

        return mx;
    }

    float nextY() {
        for (int index = mYsIndex; index >= 0; index--) {
            int yIndex = mYIndices.get(index);
            mYIndices.set(index, yIndex + 1);
        }

        int nextIndex = mYIndex + 1;
        if (nextIndex < mYs.length) {
            mdy = 0;
            mYIndex = nextIndex;
            String val = mYs[nextIndex];
            my = PropHelper.fromRelativeToFloat(val, mHeight, 0, mScale, fontSize);
        }

        return my;
    }

    float nextRotation() {
        for (int index = mRsIndex; index >= 0; index--) {
            int rotationIndex = mRIndices.get(index);
            mRIndices.set(index, rotationIndex + 1);
        }

        int nextIndex = mRIndex + 1;
        if (nextIndex < mRs.length) {
            mRIndex = nextIndex;
            mr = mRs[nextIndex];
        }

        return mr;
    }

    float nextDeltaX() {
        for (int index = mdXsIndex; index >= 0; index--) {
            int deltaIndex = mdXIndices.get(index);
            mdXIndices.set(index, deltaIndex + 1);
        }

        int nextIndex = mdXIndex + 1;
        if (nextIndex < mdXs.length) {
            mdXIndex = nextIndex;
            float val = mdXs[nextIndex];
            mdx += val * mScale;
        }

        return mdx;
    }

    float nextDeltaY() {
        for (int index = mdYsIndex; index >= 0; index--) {
            int deltaIndex = mdYIndices.get(index);
            mdYIndices.set(index, deltaIndex + 1);
        }

        int nextIndex = mdYIndex + 1;
        if (nextIndex < mdYs.length) {
            mdYIndex = nextIndex;
            float val = mdYs[nextIndex];
            mdy += val * mScale;
        }

        return mdy;
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

            if (mFontContext.get(index).hasKey(FONT_SIZE)) {
                return font.getDouble(FONT_SIZE);
            }
        }

        if (top > -1) {
            return mNodes.get(0).getFontSizeFromParentContext();
        }

        return DEFAULT_FONT_SIZE;
    }

    ReadableMap getFont() {
        WritableMap map = Arguments.createMap();
        map.putBoolean(IS_KERNING_VALUE_SET, false);
        map.putDouble(FONT_SIZE, fontSize);

        boolean letterSpacingSet = false;
        boolean fontFamilySet = false;
        boolean fontWeightSet = false;
        boolean fontStyleSet = false;
        boolean kerningSet = false;

        for (int index = top; index >= 0; index--) {
            ReadableMap font = mFontContext.get(index);

            if (!letterSpacingSet && font.hasKey(LETTER_SPACING)) {
                String letterSpacingString = font.getString(LETTER_SPACING);
                float letterSpacing = Float.valueOf(letterSpacingString);
                map.putDouble(LETTER_SPACING, letterSpacing);
                letterSpacingSet = true;
            }

            if (!fontFamilySet && font.hasKey(FONT_FAMILY)) {
                String fontFamily = font.getString(FONT_FAMILY);
                map.putString(FONT_FAMILY, fontFamily);
                fontFamilySet = true;
            }

            if (!fontWeightSet && font.hasKey(FONT_WEIGHT)) {
                String fontWeight = font.getString(FONT_WEIGHT);
                map.putString(FONT_WEIGHT, fontWeight);
                fontWeightSet = true;
            }

            if (!fontStyleSet && font.hasKey(FONT_STYLE)) {
                String fontStyle = font.getString(FONT_STYLE);
                map.putString(FONT_STYLE, fontStyle);
                fontStyleSet = true;
            }

            if (!kerningSet && font.hasKey(KERNING)) {
                String kerningString = font.getString(KERNING);
                float kerning = Float.valueOf(kerningString);
                map.putBoolean(IS_KERNING_VALUE_SET, true);
                map.putDouble(KERNING, kerning);
                kerningSet = true;
            }

            if (letterSpacingSet && fontFamilySet && fontWeightSet && fontStyleSet && kerningSet) {
                break;
            }
        }

        return map;
    }

    private float[] getFloatArrayFromReadableArray(ReadableArray readableArray) {
        int size = readableArray.size();
        float[] floats = new float[size];
        for (int i = 0; i < size; i++) {
            switch (readableArray.getType(i)) {
                case String:
                    // em units
                    String val = readableArray.getString(i);
                    String substring = val.substring(0, val.length() - 2);
                    floats[i] = (float) (Float.valueOf(substring) * fontSize);
                    break;

                case Number:
                    floats[i] = (float) readableArray.getDouble(i);
                    break;
            }
        }
        return floats;
    }
}
