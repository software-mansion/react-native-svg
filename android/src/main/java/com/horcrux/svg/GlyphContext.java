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

// https://www.w3.org/TR/SVG/text.html#TSpanElement
class GlyphContext {
    static final float DEFAULT_FONT_SIZE = 12f;

    private static final String KERNING = "kerning";
    private static final String FONT_SIZE = "fontSize";
    private static final String FONT_STYLE = "fontStyle";
    private static final String FONT_WEIGHT = "fontWeight";
    private static final String FONT_FAMILY = "fontFamily";
    private static final String LETTER_SPACING = "letterSpacing";

    // Unique input attribute lists (only added if node sets a value)
    private final ArrayList<String[]> mXsContext = new ArrayList<>();
    private final ArrayList<String[]> mYsContext = new ArrayList<>();
    private final ArrayList<String[]> mdXsContext = new ArrayList<>();
    private final ArrayList<String[]> mdYsContext = new ArrayList<>();
    private final ArrayList<float[]> mRsContext = new ArrayList<>();

    // Unique index into attribute list (one per unique list)
    private final ArrayList<Integer> mXIndices = new ArrayList<>();
    private final ArrayList<Integer> mYIndices = new ArrayList<>();
    private final ArrayList<Integer> mdXIndices = new ArrayList<>();
    private final ArrayList<Integer> mdYIndices = new ArrayList<>();
    private final ArrayList<Integer> mRIndices = new ArrayList<>();

    // Index of unique context used (one per node push/pop)
    private final ArrayList<Integer> mXsIndices = new ArrayList<>();
    private final ArrayList<Integer> mYsIndices = new ArrayList<>();
    private final ArrayList<Integer> mdXsIndices = new ArrayList<>();
    private final ArrayList<Integer> mdYsIndices = new ArrayList<>();
    private final ArrayList<Integer> mRsIndices = new ArrayList<>();

    // Current stack (one per node push/pop)
    private final ArrayList<ReadableMap> mFontContext = new ArrayList<>();
    private final ArrayList<GroupShadowNode> mNodes = new ArrayList<>();

    // Cached per push context
    private double fontSize = DEFAULT_FONT_SIZE;

    // Current accumulated values
    // https://www.w3.org/TR/SVG/types.html#DataTypeCoordinate
    // <coordinate> syntax is the same as that for <length>
    private float mx;
    private float my;

    // https://www.w3.org/TR/SVG/types.html#Length
    private float mdx;
    private float mdy;

    // Current <list-of-coordinates> SVGLengthList
    // https://www.w3.org/TR/SVG/types.html#InterfaceSVGLengthList
    // https://www.w3.org/TR/SVG/types.html#DataTypeCoordinates

    // https://www.w3.org/TR/SVG/text.html#TSpanElementXAttribute
    private String[] mXs = new String[]{};

    // https://www.w3.org/TR/SVG/text.html#TSpanElementYAttribute
    private String[] mYs = new String[]{};

    // Current <list-of-lengths> SVGLengthList
    // https://www.w3.org/TR/SVG/types.html#DataTypeLengths

    // https://www.w3.org/TR/SVG/text.html#TSpanElementDXAttribute
    private String[] mdXs = new String[]{};

    // https://www.w3.org/TR/SVG/text.html#TSpanElementDYAttribute
    private String[] mdYs = new String[]{};

    // Current <list-of-numbers> SVGLengthList
    // https://www.w3.org/TR/SVG/types.html#DataTypeNumbers

    // https://www.w3.org/TR/SVG/text.html#TSpanElementRotateAttribute
    private float[] mRs = new float[]{0};

    // Current attribute list index
    private int mXsIndex;
    private int mYsIndex;
    private int mdXsIndex;
    private int mdYsIndex;
    private int mRsIndex;

    // Current value index in current attribute list
    private int mXIndex = -1;
    private int mYIndex = -1;
    private int mdXIndex = -1;
    private int mdYIndex = -1;
    private int mRIndex = -1;

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
        mdXIndices.add(mdXIndex);
        mdYIndices.add(mdYIndex);
        mRIndices.add(mRIndex);

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
        @Nullable ReadableArray x,
        @Nullable ReadableArray y,
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

        if (x != null && x.size() != 0) {
            mXsIndex++;
            mXIndex = -1;
            mXIndices.add(mXIndex);
            mXs = getStringArrayFromReadableArray(x);
            mXsContext.add(mXs);
        }

        if (y != null && y.size() != 0) {
            mYsIndex++;
            mYIndex = -1;
            mYIndices.add(mYIndex);
            mYs = getStringArrayFromReadableArray(y);
            mYsContext.add(mYs);
        }

        if (deltaX != null && deltaX.size() != 0) {
            mdXsIndex++;
            mdXIndex = -1;
            mdXIndices.add(mdXIndex);
            mdXs = getStringArrayFromReadableArray(deltaX);
            mdXsContext.add(mdXs);
        }

        if (deltaY != null && deltaY.size() != 0) {
            mdYsIndex++;
            mdYIndex = -1;
            mdYIndices.add(mdYIndex);
            mdYs = getStringArrayFromReadableArray(deltaY);
            mdYsContext.add(mdYs);
        }

        if (rotate != null && rotate.size() != 0) {
            mRsIndex++;
            mRIndex = -1;
            mRIndices.add(mRIndex);
            mRs = getFloatArrayFromReadableArray(rotate);
            mRsContext.add(mRs);
        }

        pushIndices();
    }

    private void pushIndices() {
        mXsIndices.add(mXsIndex);
        mYsIndices.add(mYsIndex);
        mdXsIndices.add(mdXsIndex);
        mdYsIndices.add(mdYsIndex);
        mRsIndices.add(mRsIndex);
    }

    private void reset() {
        mXsIndex = mYsIndex = mdXsIndex = mdYsIndex = mRsIndex = 0;
        mXIndex = mYIndex = mdXIndex = mdYIndex = mRIndex = -1;
        mx = my = mdx = mdy = 0;
    }

    void popContext() {
        mXsIndices.remove(mContextLength);
        mYsIndices.remove(mContextLength);
        mdXsIndices.remove(mContextLength);
        mdYsIndices.remove(mContextLength);
        mRsIndices.remove(mContextLength);

        mContextLength--;
        top--;

        mNodes.remove(mContextLength);
        mFontContext.remove(mContextLength);

        int x = mXsIndex;
        int y = mYsIndex;
        int dx = mdXsIndex;
        int dy = mdYsIndex;
        int r = mRsIndex;

        mXsIndex = mXsIndices.get(mContextLength);
        mYsIndex = mYsIndices.get(mContextLength);
        mdXsIndex = mdXsIndices.get(mContextLength);
        mdYsIndex = mdYsIndices.get(mContextLength);
        mRsIndex = mRsIndices.get(mContextLength);

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
        if (r != mRsIndex) {
            mRsContext.remove(r);
            mRs = mRsContext.get(mRsIndex);
            mRIndex = mRIndices.get(mRsIndex);
        }
    }

    private static void incrementIndices(ArrayList<Integer> indices, int topIndex) {
        for (int index = topIndex; index >= 0; index--) {
            int xIndex = indices.get(index);
            indices.set(index, xIndex + 1);
        }
    }

    float nextX(float glyphWidth) {
        incrementIndices(mXIndices, mXsIndex);

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
        incrementIndices(mYIndices, mYsIndex);

        int nextIndex = mYIndex + 1;
        if (nextIndex < mYs.length) {
            mdy = 0;
            mYIndex = nextIndex;
            String val = mYs[nextIndex];
            my = PropHelper.fromRelativeToFloat(val, mHeight, 0, mScale, fontSize);
        }

        return my;
    }

    float nextDeltaX() {
        incrementIndices(mdXIndices, mdXsIndex);

        int nextIndex = mdXIndex + 1;
        if (nextIndex < mdXs.length) {
            mdXIndex = nextIndex;
            String string = mdXs[nextIndex];
            float val = PropHelper.fromRelativeToFloat(string, mWidth, 0, 1, fontSize);
            mdx += val * mScale;
        }

        return mdx;
    }

    float nextDeltaY() {
        incrementIndices(mdYIndices, mdYsIndex);

        int nextIndex = mdYIndex + 1;
        if (nextIndex < mdYs.length) {
            mdYIndex = nextIndex;
            String string = mdYs[nextIndex];
            float val = PropHelper.fromRelativeToFloat(string, mHeight, 0, 1, fontSize);
            mdy += val * mScale;
        }

        return mdy;
    }

    float nextRotation() {
        incrementIndices(mRIndices, mRsIndex);

        mRIndex = Math.min(mRIndex + 1, mRs.length - 1);

        return mRs[mRIndex];
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
                map.putDouble(KERNING, kerning);
                kerningSet = true;
            }

            if (letterSpacingSet && fontFamilySet && fontWeightSet && fontStyleSet && kerningSet) {
                break;
            }
        }

        return map;
    }

    private String[] getStringArrayFromReadableArray(ReadableArray readableArray) {
        int size = readableArray.size();
        String[] strings = new String[size];
        for (int i = 0; i < size; i++) {
            strings[i] = readableArray.getString(i);
        }
        return strings;
    }

    private float[] getFloatArrayFromReadableArray(ReadableArray readableArray) {
        int size = readableArray.size();
        float[] floats = new float[size];
        for (int i = 0; i < size; i++) {
            String string = readableArray.getString(i);
            floats[i] = Float.valueOf(string);
        }
        return floats;
    }
}
