/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;


import android.annotation.TargetApi;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PointF;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.os.Build;

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

        String text = mContent;

        if (text == null) {
            return getGroupPath(canvas, paint);
        }

        setupTextPath();
        Path path = new Path();

        pushGlyphContext();
        applyTextPropertiesToPaint(paint);
        getLinePath(canvas, mContent + "", paint, path);

        mCache = path;
        popGlyphContext();

        RectF box = new RectF();
        path.computeBounds(box, true);

        return path;
    }

    private Path getLinePath(Canvas canvas, String line, Paint paint, Path path) {
        PointF glyphPoint = getGlyphPointFromContext(0, 0);
        PointF glyphDelta = getGlyphDeltaFromContext();
        PathShadowNode p = null;
        Path bezierPath = null;
        Path glyph = null;
        float width = 0;
        float offset = 0;
        float distance = 0;
        float textMeasure = 0;

        int chars = line.length();
        final float[] widths = new float[chars];
        paint.getTextWidths(line, widths);
        float glyphPosition = 0f;

        if (mBezierTransformer != null) {
            distance = mBezierTransformer.getTotalDistance();
            p = mBezierTransformer.getPath();
            offset = mBezierTransformer.getmStartOffset();
            bezierPath = p.getPath();
            textMeasure = paint.measureText(line);
            if (debug) {
                canvas.drawTextOnPath(line, bezierPath, offset + glyphPoint.x + glyphDelta.x, glyphDelta.y, paint);
            }
        }

        for (int index = 0; index < line.length(); index++) {
            String letter = line.substring(index, index + 1);
            glyph = new Path();
            width = widths[index];
            float uptoChar = paint.measureText(line, Math.max(0, index - 1), index);
            float untilChar = paint.measureText(line, Math.max(0, index - 1), index + 1);
            float onlyChar = paint.measureText(line, index, index + 1);
            float kerned = untilChar - uptoChar;
            float kerning = kerned - onlyChar;
            glyphPosition += kerning;

            paint.getTextPath(letter, 0, 1, 0, 0, glyph);
            glyphPoint = getGlyphPointFromContext(glyphPosition, width);
            Matrix matrix = new Matrix();

            if (mBezierTransformer != null) {
                matrix = mBezierTransformer.getTransformAtDistance(offset + glyphPoint.x + glyphDelta.x + width / 2);

                if (textPathHasReachedEnd()) {
                    break;
                } else if (!textPathHasReachedStart()) {
                    continue;
                }

                matrix.preTranslate(-width / 2, glyphDelta.y);
                matrix.postTranslate(0, glyphPoint.y);
            } else {
                matrix.setTranslate(glyphPoint.x + glyphDelta.x, glyphPoint.y + glyphDelta.y);
            }

            glyphPosition += width;
            glyph.transform(matrix);
            path.addPath(glyph);
            glyphDelta = getGlyphDeltaFromContext();
        }

        return path;
    }

    private void applyTextPropertiesToPaint(Paint paint) {
        ReadableMap font = getFontFromContext();

        paint.setTextAlign(Paint.Align.LEFT);

        float fontSize = (float)font.getDouble(PROP_FONT_SIZE) * mScale;
        float kerning = (float)font.getDouble(PROP_KERNING) * mScale;
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
