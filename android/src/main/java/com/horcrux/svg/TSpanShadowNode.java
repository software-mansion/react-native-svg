/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;


import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PointF;
import android.graphics.RectF;
import android.graphics.Typeface;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ReactShadowNode;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

/**
 * Shadow node for virtual TSpan view
 */
public class TSpanShadowNode extends TextShadowNode {

    private BezierTransformer mBezierTransformer;
    private Path mCache;
    private @Nullable String mContent;
    private boolean debug = false;

    private static final String PROP_FONT_FAMILY = "fontFamily";
    private static final String PROP_FONT_SIZE = "fontSize";
    private static final String PROP_FONT_STYLE = "fontStyle";
    private static final String PROP_FONT_WEIGHT = "fontWeight";
    private static final String PROP_KERNING = "kerning";
    private static final String PROP_IS_KERNING_VALUE_SET = "isKerningValueSet";
    private static final String PROP_LETTER_SPACING = "letterSpacing";

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
        Path path = mCache = getLinePath(canvas, mContent, paint);
        popGlyphContext();

        path.computeBounds(new RectF(), true);

        return path;
    }

    private Path getLinePath(Canvas canvas, String line, Paint paint) {
        int length = line.length();
        Path path = new Path();

        if (length == 0) {
            return path;
        }

        PointF glyphPoint = getGlyphPointFromContext(0, 0);
        PointF glyphDelta = getGlyphDeltaFromContext();
        float textMeasure = 0;
        float distance = 0;
        float offset = 0;
        PathShadowNode p;
        Path bezierPath;

        if (mBezierTransformer != null) {
            offset = mBezierTransformer.getStartOffset();
            if (debug) {
                distance = mBezierTransformer.getTotalDistance();
                textMeasure = paint.measureText(line);
                p = mBezierTransformer.getPath();
                bezierPath = p.getPath();
                canvas.drawTextOnPath(
                    line,
                    bezierPath,
                    offset + glyphPoint.x + glyphDelta.x,
                    glyphDelta.y,
                    paint
                );
            }
        }

        Path glyph;
        float width;
        Matrix matrix;
        String current;
        String previous = "";
        float glyphPosition = 0;
        char[] chars = line.toCharArray();
        float[] widths = new float[length];

        ReadableMap font = applyTextPropertiesToPaint(paint);
        double kerningValue = font.getDouble(PROP_KERNING) * mScale;
        boolean isKerningValueSet = font.getBoolean(PROP_IS_KERNING_VALUE_SET);

        paint.getTextWidths(line, widths);

        for (int index = 0; index < length; index++) {
            current = String.valueOf(chars[index]);
            width = widths[index];
            glyph = new Path();

            if (isKerningValueSet) {
                glyphPosition += kerningValue;
            } else {
                float bothWidth = paint.measureText(previous + current);
                float previousWidth = paint.measureText(previous);
                float currentWidth = paint.measureText(current);
                float kernedWidth = bothWidth - previousWidth;
                float kerning = kernedWidth - currentWidth;
                glyphPosition += kerning;
                previous = current;
            }

            glyphPoint = getGlyphPointFromContext(glyphPosition, width);

            if (mBezierTransformer != null) {
                float halfway = width / 2;

                matrix = mBezierTransformer.getTransformAtDistance(
                    offset + glyphPoint.x + glyphDelta.x + halfway
                );

                if (textPathHasReachedEnd()) {
                    break;
                } else if (!textPathHasReachedStart()) {
                    continue;
                }

                matrix.preTranslate(-halfway, glyphDelta.y);
                matrix.postTranslate(0, glyphPoint.y);
            } else {
                matrix = new Matrix();
                matrix.setTranslate(glyphPoint.x + glyphDelta.x, glyphPoint.y + glyphDelta.y);
            }

            paint.getTextPath(current, 0, 1, 0, 0, glyph);
            glyphDelta = getGlyphDeltaFromContext();
            glyph.transform(matrix);
            glyphPosition += width;
            path.addPath(glyph);
        }

        return path;
    }

    private ReadableMap applyTextPropertiesToPaint(Paint paint) {
        ReadableMap font = getFontFromContext();

        paint.setTextAlign(Paint.Align.LEFT);

        float fontSize = (float)font.getDouble(PROP_FONT_SIZE) * mScale;
        float letterSpacing = (float)font.getDouble(PROP_LETTER_SPACING) * mScale;

        paint.setTextSize(fontSize);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            paint.setLetterSpacing(letterSpacing / fontSize);  // setLetterSpacing is only available from LOLLIPOP and on
        }

        boolean isBold = font.hasKey(PROP_FONT_WEIGHT) && "bold".equals(font.getString(PROP_FONT_WEIGHT));
        boolean isItalic = font.hasKey(PROP_FONT_STYLE) && "italic".equals(font.getString(PROP_FONT_STYLE));

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
        // NB: if the font family is null / unsupported, the default one will be used
        paint.setTypeface(Typeface.create(font.getString(PROP_FONT_FAMILY), fontStyle));

        return font;
    }

    private void setupTextPath() {
        ReactShadowNode parent = getParent();

        while (parent != null) {
            if (parent.getClass() == TextPathShadowNode.class) {
                TextPathShadowNode textPath = (TextPathShadowNode)parent;
                mBezierTransformer = textPath.getBezierTransformer();
                break;
            } else if (!(parent instanceof TextShadowNode)) {
                break;
            }

            parent = parent.getParent();
        }
    }

    private boolean textPathHasReachedEnd() {
        return mBezierTransformer.hasReachedEnd();
    }

    private boolean textPathHasReachedStart() {
        return mBezierTransformer.hasReachedStart();
    }
}
