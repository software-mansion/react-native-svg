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

    private double getTextAnchorShift(double width, String textAnchor) {
        double x = 0;

        switch (textAnchor) {
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
        final int length = line.length();
        final Path path = new Path();

        if (length == 0) {
            return path;
        }

        GlyphContext gc = getTextRootGlyphContext();
        FontData font = gc.getFont();
        applyTextPropertiesToPaint(paint, font);

        double distance = 0;
        double renderMethodScaling = 1;
        final double textMeasure = paint.measureText(line);
        double offset = getTextAnchorShift(textMeasure, font.textAnchor);

        PathMeasure pm = null;
        if (textPath != null) {
            pm = new PathMeasure(textPath.getPath(), false);
            distance = pm.getLength();
            final double size = gc.getFontSize();
            final String startOffset = textPath.getStartOffset();
            offset += PropHelper.fromRelative(startOffset, distance, 0, mScale, size);
            // String spacing = textPath.getSpacing(); // spacing = "auto | exact"
            final String method = textPath.getMethod(); // method = "align | stretch"
            if (STRETCH.equals(method)) {
                renderMethodScaling = distance / textMeasure;
            }
        }

        double x;
        double y;
        double r;
        double dx;
        double dy;

        Path glyph;
        Matrix matrix;
        String current;
        double glyphWidth;
        String previous = "";
        double previousGlyphWidth = 0;
        final char[] chars = line.toCharArray();

        /*
        *
        * Three properties affect the space between characters and words:
        *
        * ‘kerning’ indicates whether the user agent should adjust inter-glyph spacing
        * based on kerning tables that are included in the relevant font
        * (i.e., enable auto-kerning) or instead disable auto-kerning
        * and instead set inter-character spacing to a specific length (typically, zero).
        *
        * ‘letter-spacing’ indicates an amount of space that is to be added between text
        * characters supplemental to any spacing due to the ‘kerning’ property.
        *
        * ‘word-spacing’ indicates the spacing behavior between words.
        *
        *  Letter-spacing is applied after bidi reordering and is in addition to any word-spacing.
        *  Depending on the justification rules in effect, user agents may further increase
        *  or decrease the space between typographic character units in order to justify text.
        *
        * */

        final boolean autoKerning = !font.manualKerning;
        double kerning = font.kerning;

        final double wordSpacing = font.wordSpacing;

        final double letterSpacing = font.letterSpacing;

        for (int index = 0; index < length; index++) {
            glyph = new Path();
            final char currentChar = chars[index];
            current = String.valueOf(currentChar);
            paint.getTextPath(current, 0, 1, 0, 0, glyph);
            glyphWidth = paint.measureText(current) * renderMethodScaling;

            if (autoKerning) {
                double bothGlyphWidth = paint.measureText(previous + current) * renderMethodScaling;
                kerning = bothGlyphWidth - previousGlyphWidth - glyphWidth;
                previousGlyphWidth = glyphWidth;
                previous = current;
            }

            final boolean isWordSeparator = currentChar == ' ';
            final double wordSpace = isWordSeparator ? wordSpacing : 0;
            final double advance = glyphWidth + kerning + wordSpace + letterSpacing;

            x = gc.nextX(advance);
            y = gc.nextY();
            dx = gc.nextDeltaX();
            dy = gc.nextDeltaY();
            r = gc.nextRotation();

            matrix = new Matrix();

            final double glyphStart = offset + x + dx - glyphWidth;

            if (textPath != null) {
                double halfGlyphWidth = glyphWidth / 2;
                double midpoint = glyphStart + halfGlyphWidth;

                if (midpoint > distance) {
                    break;
                } else if (midpoint < 0) {
                    continue;
                }

                assert pm != null;
                pm.getMatrix((float) midpoint, matrix, POSITION_MATRIX_FLAG | TANGENT_MATRIX_FLAG);
                // TODO In the calculation above, if either the startpoint-on-the-path
                // or the endpoint-on-the-path is off the end of the path,
                // then extend the path beyond its end points with a straight line
                // that is parallel to the tangent at the path at its end point
                // so that the midpoint-on-the-path can still be calculated.

                matrix.preTranslate((float) -halfGlyphWidth, (float) dy);
                matrix.preScale((float) renderMethodScaling, (float) renderMethodScaling);
                matrix.postTranslate(0, (float) y);
            } else {
                matrix.setTranslate((float) glyphStart, (float) (y + dy));
            }

            matrix.preRotate((float) r);
            glyph.transform(matrix);
            path.addPath(glyph);
        }

        return path;
    }

    private void applyTextPropertiesToPaint(Paint paint, FontData font) {
        AssetManager assetManager = getThemedContext().getResources().getAssets();

        double fontSize = font.fontSize * mScale;

        boolean isBold = BOLD.equals(font.fontWeight);

        boolean isItalic = ITALIC.equals(font.fontStyle);

        boolean underlineText = false;
        boolean strikeThruText = false;

        String decoration = font.textDecoration;
        switch (decoration) {
            case TEXT_DECORATION_UNDERLINE:
                underlineText = true;
                break;

            case TEXT_DECORATION_LINE_THROUGH:
                strikeThruText = true;
                break;
        }

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
        final String fontFamily = font.fontFamily;
        try {
            String path = FONTS + fontFamily + OTF;
            typeface = Typeface.createFromAsset(assetManager, path);
        } catch (Exception ignored) {
            try {
                String path = FONTS + fontFamily + TTF;
                typeface = Typeface.createFromAsset(assetManager, path);
            } catch (Exception ignored2) {
                try {
                    typeface = Typeface.create(fontFamily, fontStyle);
                } catch (Exception ignored3) {
                }
            }
        }

        // NB: if the font family is null / unsupported, the default one will be used
        paint.setTypeface(typeface);
        paint.setTextSize((float) fontSize);
        paint.setTextAlign(Paint.Align.LEFT);
        paint.setUnderlineText(underlineText);
        paint.setStrikeThruText(strikeThruText);
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
