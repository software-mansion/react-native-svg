/*
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;


import android.content.res.AssetManager;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PathMeasure;
import android.graphics.RectF;
import android.graphics.Typeface;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ReactShadowNode;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

import static android.graphics.PathMeasure.POSITION_MATRIX_FLAG;
import static android.graphics.PathMeasure.TANGENT_MATRIX_FLAG;

/**
 * Shadow node for virtual TSpan view
 */
class TSpanShadowNode extends TextShadowNode {

    private static final String STRETCH = "stretch";
    private static final String ITALIC = "italic";
    private static final String FONTS = "fonts/";
    private static final String BOLD = "bold";
    private static final String OTF = ".otf";
    private static final String TTF = ".ttf";

    private static final float DEFAULT_KERNING = 0f;
    private static final float DEFAULT_LETTER_SPACING = 0f;

    private static final String PROP_KERNING = "kerning";
    private static final String PROP_FONT_SIZE = "fontSize";
    private static final String PROP_FONT_STYLE = "fontStyle";
    private static final String PROP_FONT_WEIGHT = "fontWeight";
    private static final String PROP_FONT_FAMILY = "fontFamily";
    private static final String PROP_LETTER_SPACING = "letterSpacing";

    private Path mCache;
    private @Nullable String mContent;
    private TextPathShadowNode textPath;

    @ReactProp(name = "content")
    public void setContent(@Nullable String content) {
        mContent = content;
        markUpdated();
    }

    @Override
    public void draw(Canvas canvas, Paint paint, float opacity) {
        if (mContent != null) {
            drawPath(canvas, paint, opacity);
        } else {
            clip(canvas, paint);
            drawGroup(canvas, paint, opacity);
        }
    }

    @Override
    protected void releaseCachedPath() {
        mCache = null;
    }

    @Override
    protected Path getPath(Canvas canvas, Paint paint) {
        if (mCache != null) {
            return mCache;
        }

        if (mContent == null) {
            return getGroupPath(canvas, paint);
        }

        setupTextPath();

        pushGlyphContext();
        mCache = getLinePath(mContent, paint);
        popGlyphContext();

        mCache.computeBounds(new RectF(), true);

        return mCache;
    }

    private float getTextAnchorShift(float width) {
        float x = 0;

        switch (getComputedTextAnchor()) {
            case TEXT_ANCHOR_MIDDLE:
                x = -width / 2;
                break;
            case TEXT_ANCHOR_END:
                x = -width;
                break;
        }

        return x;
    }

    private Path getLinePath(String line, Paint paint) {
        int length = line.length();
        Path path = new Path();

        if (length == 0) {
            return path;
        }

        GlyphContext gc = getTextRootGlyphContext();
        ReadableMap font = gc.getFont();
        applyTextPropertiesToPaint(paint, font);

        float offset = 0;
        float distance = 0;
        float renderMethodScaling = 1;
        float textMeasure = paint.measureText(line);

        PathMeasure pm = null;
        if (textPath != null) {
            pm = new PathMeasure(textPath.getPath(), false);
            distance = pm.getLength();
            double size = getFontSizeFromContext();
            String startOffset = textPath.getStartOffset();
            offset = PropHelper.fromRelativeToFloat(startOffset, distance, 0, mScale, size);
            // String spacing = textPath.getSpacing(); // spacing = "auto | exact"
            String method = textPath.getMethod(); // method = "align | stretch"
            if (STRETCH.equals(method)) {
                renderMethodScaling = distance / textMeasure;
            }
        }

        offset += getTextAnchorShift(textMeasure);

        float x;
        float y;
        float r;
        float dx;
        float dy;

        Path glyph;
        float width;
        Matrix matrix;
        String current;
        String previous = "";
        float previousWidth = 0;
        char[] chars = line.toCharArray();

        boolean autoKerning = true;
        float kerning = DEFAULT_KERNING;
        if (font.hasKey(PROP_KERNING)) {
            kerning = (float) (font.getDouble(PROP_KERNING) * mScale);
            autoKerning = false;
        }

        for (int index = 0; index < length; index++) {
            glyph = new Path();
            current = String.valueOf(chars[index]);
            paint.getTextPath(current, 0, 1, 0, 0, glyph);
            width = paint.measureText(current) * renderMethodScaling;

            if (autoKerning) {
                float both = paint.measureText(previous + current) * renderMethodScaling;
                kerning = both - previousWidth - width;
                previousWidth = width;
                previous = current;
            }

            x = gc.nextX(width + kerning);
            y = gc.nextY();
            dx = gc.nextDeltaX();
            dy = gc.nextDeltaY();
            r = gc.nextRotation();

            matrix = new Matrix();

            float xSum = offset + x + dx - width;

            if (textPath != null) {
                float halfway = width / 2;
                float midpoint = xSum + halfway;

                if (midpoint > distance) {
                    break;
                } else if (midpoint < 0) {
                    continue;
                }

                assert pm != null;
                pm.getMatrix(midpoint, matrix, POSITION_MATRIX_FLAG | TANGENT_MATRIX_FLAG);

                matrix.preTranslate(-halfway, dy);
                matrix.preScale(renderMethodScaling, renderMethodScaling);
                matrix.postTranslate(0, y);
            } else {
                matrix.setTranslate(xSum, y + dy);
            }

            matrix.preRotate(r);
            glyph.transform(matrix);
            path.addPath(glyph);
        }

        return path;
    }

    private void applyTextPropertiesToPaint(Paint paint, ReadableMap font) {
        AssetManager assetManager = getThemedContext().getResources().getAssets();

        float fontSize = (float) font.getDouble(PROP_FONT_SIZE) * mScale;

        float letterSpacing = font.hasKey(PROP_LETTER_SPACING) ?
            (float) font.getDouble(PROP_LETTER_SPACING) * mScale
            : DEFAULT_LETTER_SPACING;

        boolean isBold = font.hasKey(PROP_FONT_WEIGHT) &&
            BOLD.equals(font.getString(PROP_FONT_WEIGHT));

        boolean isItalic = font.hasKey(PROP_FONT_STYLE) &&
            ITALIC.equals(font.getString(PROP_FONT_STYLE));

        int decoration = getTextDecoration();

        boolean underlineText = decoration == TEXT_DECORATION_UNDERLINE;

        boolean strikeThruText = decoration == TEXT_DECORATION_LINE_THROUGH;

        int fontStyle;
        if (isBold && isItalic) {
            fontStyle = Typeface.BOLD_ITALIC;
        } else if (isBold) {
            fontStyle = Typeface.BOLD;
        } else if (isItalic) {
            fontStyle = Typeface.ITALIC;
        } else {
            fontStyle = Typeface.NORMAL;
        }

        Typeface typeface = null;
        try {
            String path = FONTS + font.getString(PROP_FONT_FAMILY) + OTF;
            typeface = Typeface.createFromAsset(assetManager, path);
        } catch (Exception ignored) {
            try {
                String path = FONTS + font.getString(PROP_FONT_FAMILY) + TTF;
                typeface = Typeface.createFromAsset(assetManager, path);
            } catch (Exception ignored2) {
                try {
                    typeface = Typeface.create(font.getString(PROP_FONT_FAMILY), fontStyle);
                } catch (Exception ignored3) {
                }
            }
        }

        // NB: if the font family is null / unsupported, the default one will be used
        paint.setTypeface(typeface);
        paint.setTextSize(fontSize);
        paint.setTextAlign(Paint.Align.LEFT);
        paint.setUnderlineText(underlineText);
        paint.setStrikeThruText(strikeThruText);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            paint.setLetterSpacing(letterSpacing / fontSize);
        }
    }

    private void setupTextPath() {
        ReactShadowNode parent = getParent();

        while (parent != null) {
            if (parent.getClass() == TextPathShadowNode.class) {
                textPath = (TextPathShadowNode) parent;
                break;
            } else if (!(parent instanceof TextShadowNode)) {
                break;
            }

            parent = parent.getParent();
        }
    }
}
