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
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.Typeface;

import com.facebook.react.uimanager.ReactShadowNode;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

import static android.graphics.Matrix.MTRANS_X;
import static android.graphics.Matrix.MTRANS_Y;
import static android.graphics.PathMeasure.POSITION_MATRIX_FLAG;
import static android.graphics.PathMeasure.TANGENT_MATRIX_FLAG;

/**
 * Shadow node for virtual TSpan view
 */
class TSpanShadowNode extends TextShadowNode {
    private static final double tau = 2 * Math.PI;
    private static final double radToDeg = 360 / tau;

    private static final String FONTS = "fonts/";
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

    private Path getLinePath(String line, Paint paint) {
        final int length = line.length();
        final Path path = new Path();

        if (length == 0) {
            return path;
        }

        GlyphContext gc = getTextRootGlyphContext();
        FontData font = gc.getFont();
        applyTextPropertiesToPaint(paint, font);
        GlyphPathBag bag = new GlyphPathBag(paint);

        /*
            Determine the startpoint-on-the-path for the first glyph using attribute ‘startOffset’
            and property text-anchor.

            For text-anchor:start, startpoint-on-the-path is the point
            on the path which represents the point on the path which is ‘startOffset’ distance
            along the path from the start of the path, calculated using the user agent's distance
            along the path algorithm.

            For text-anchor:middle, startpoint-on-the-path is the point
            on the path which represents the point on the path which is [ ‘startOffset’ minus half
            of the total advance values for all of the glyphs in the ‘textPath’ element ] distance
            along the path from the start of the path, calculated using the user agent's distance
            along the path algorithm.

            For text-anchor:end, startpoint-on-the-path is the point on
            the path which represents the point on the path which is [ ‘startOffset’ minus the
            total advance values for all of the glyphs in the ‘textPath’ element ].

            Before rendering the first glyph, the horizontal component of the startpoint-on-the-path
            is adjusted to take into account various horizontal alignment text properties and
            attributes, such as a ‘dx’ attribute value on a ‘tspan’ element.
         */
        final double textMeasure = paint.measureText(line);
        double offset = getTextAnchorOffset(font.textAnchor, textMeasure);

        double distance = 0;
        PathMeasure pm = null;
        if (textPath != null) {
            pm = new PathMeasure(textPath.getPath(), false);
            distance = pm.getLength();
            if (distance == 0) {
                return path;
            }
            offset += getAbsoluteStartOffset(distance, gc.getFontSize(), textPath.getStartOffset());
            /*
            TextPathSpacing spacing = textPath.getSpacing();
            if (spacing == TextPathSpacing.auto) {
                // Hmm, what to do here?
                // https://svgwg.org/svg2-draft/text.html#TextPathElementSpacingAttribute
            }
            */
        }

        double renderMethodScaling = getRenderMethodScaling(textMeasure, distance);

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
        String previous = "";
        double previousCharWidth = 0;
        double kerning = font.kerning;
        final double wordSpacing = font.wordSpacing;
        final double letterSpacing = font.letterSpacing;
        final boolean autoKerning = !font.manualKerning;

        /*
            https://developer.mozilla.org/en/docs/Web/CSS/vertical-align
            https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6bsln.html
            https://www.microsoft.com/typography/otspec/base.htm
            http://apike.ca/prog_svg_text_style.html
            https://www.w3schools.com/tags/canvas_textbaseline.asp
            http://vanseodesign.com/web-design/svg-text-baseline-alignment/
            https://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align
            https://tympanus.net/codrops/css_reference/vertical-align/

            https://svgwg.org/svg2-draft/text.html#AlignmentBaselineProperty
            11.10.2.6. The ‘alignment-baseline’ property

            This property is defined in the CSS Line Layout Module 3 specification. See 'alignment-baseline'. [css-inline-3]
            https://drafts.csswg.org/css-inline/#propdef-alignment-baseline

            The vertical-align property shorthand should be preferred in new content.

            SVG 2 introduces some changes to the definition of this property.
            In particular: the values 'auto', 'before-edge', and 'after-edge' have been removed.
            For backwards compatibility, 'text-before-edge' should be mapped to 'text-top' and
            'text-after-edge' should be mapped to 'text-bottom'.

            Neither 'text-before-edge' nor 'text-after-edge' should be used with the vertical-align property.
        */
        Paint.FontMetrics fm = paint.getFontMetrics();
        double top = -fm.top;
        double bottom = fm.bottom;
        double ascenderHeight = -fm.ascent;
        double descenderDepth = fm.descent;
        double totalHeight = top + bottom;
        double baselineShift = 0;
        if (mAlignmentBaseline != null) {
            // TODO alignment-baseline, test / verify behavior
            switch (mAlignmentBaseline) {
                // https://wiki.apache.org/xmlgraphics-fop/LineLayout/AlignmentHandling
                default:
                case baseline:
                    // Use the dominant baseline choice of the parent.
                    // Match the box’s corresponding baseline to that of its parent.
                    baselineShift = 0;
                    break;

                case textBottom:
                case afterEdge:
                case textAfterEdge:
                    // Match the bottom of the box to the bottom of the parent’s content area.
                    // text-after-edge = text-bottom
                    // text-after-edge = descender depth
                    baselineShift = descenderDepth;
                    break;

                case alphabetic:
                    // Match the box’s alphabetic baseline to that of its parent.
                    // alphabetic = 0
                    baselineShift = 0;
                    break;

                case ideographic:
                    // Match the box’s ideographic character face under-side baseline to that of its parent.
                    // ideographic = descender depth
                    baselineShift = descenderDepth;
                    break;

                case middle:
                    // Align the vertical midpoint of the box with the baseline of the parent box plus half the x-height of the parent.
                    // middle = x height / 2
                    Rect bounds = new Rect();
                    // this will just retrieve the bounding rect for 'x'
                    paint.getTextBounds("x", 0, 1, bounds);
                    int xHeight = bounds.height();
                    baselineShift = xHeight / 2;
                    break;

                case central:
                    // Match the box’s central baseline to the central baseline of its parent.
                    // central = (ascender height - descender depth) / 2
                    baselineShift = (ascenderHeight - descenderDepth) / 2;
                    break;

                case mathematical:
                    // Match the box’s mathematical baseline to that of its parent.
                    // Hanging and mathematical baselines
                    // There are no obvious formulas to calculate the position of these baselines.
                    // At the time of writing FOP puts the hanging baseline at 80% of the ascender
                    // height and the mathematical baseline at 50%.
                    baselineShift = ascenderHeight / 2;
                    break;

                case hanging:
                    baselineShift = 0.8 * ascenderHeight;
                    break;

                case textTop:
                case beforeEdge:
                case textBeforeEdge:
                    // Match the top of the box to the top of the parent’s content area.
                    // text-before-edge = text-top
                    // text-before-edge = ascender height
                    baselineShift = ascenderHeight;
                    break;

                case bottom:
                    // Align the top of the aligned subtree with the top of the line box.
                    baselineShift = bottom;
                    break;

                case center:
                    // Align the center of the aligned subtree with the center of the line box.
                    baselineShift = totalHeight / 2;
                    break;

                case top:
                    // Align the bottom of the aligned subtree with the bottom of the line box.
                    baselineShift = top;
                    break;
            }
        }

        Matrix start = new Matrix();
        Matrix mid = new Matrix();
        Matrix end = new Matrix();

        float[] startPointMatrixData = new float[9];
        float[] endPointMatrixData = new float[9];

        final char[] chars = line.toCharArray();
        for (int index = 0; index < length; index++) {
            char currentChar = chars[index];
            String current = String.valueOf(currentChar);

            /*
                Determine the glyph's charwidth (i.e., the amount which the current text position
                advances horizontally when the glyph is drawn using horizontal text layout).
            */
            double charWidth = paint.measureText(current) * renderMethodScaling;

            /*
                For each subsequent glyph, set a new startpoint-on-the-path as the previous
                endpoint-on-the-path, but with appropriate adjustments taking into account
                horizontal kerning tables in the font and current values of various attributes
                and properties, including spacing properties (e.g. letter-spacing and word-spacing)
                and ‘tspan’ elements with values provided for attributes ‘dx’ and ‘dy’. All
                adjustments are calculated as distance adjustments along the path, calculated
                using the user agent's distance along the path algorithm.
            */
            if (autoKerning) {
                double bothCharsWidth = paint.measureText(previous + current) * renderMethodScaling;
                kerning = bothCharsWidth - previousCharWidth - charWidth;
                previousCharWidth = charWidth;
                previous = current;
            }

            boolean isWordSeparator = currentChar == ' ';
            double wordSpace = isWordSeparator ? wordSpacing : 0;
            double advance = charWidth + kerning + wordSpace + letterSpacing;

            double x = gc.nextX(advance);
            double y = gc.nextY();
            double dx = gc.nextDeltaX();
            double dy = gc.nextDeltaY();
            double r = gc.nextRotation();

            double startpoint = offset + x + dx - charWidth;

            if (textPath != null) {
                /*
                    Determine the point on the curve which is charwidth distance along the path from
                    the startpoint-on-the-path for this glyph, calculated using the user agent's
                    distance along the path algorithm. This point is the endpoint-on-the-path for
                    the glyph.
                 */
                double endpoint = startpoint + charWidth;

                /*
                    Determine the midpoint-on-the-path, which is the point on the path which is
                    "halfway" (user agents can choose either a distance calculation or a parametric
                    calculation) between the startpoint-on-the-path and the endpoint-on-the-path.
                */
                double halfway = charWidth / 2;
                double midpoint = startpoint + halfway;

                //  Glyphs whose midpoint-on-the-path are off the path are not rendered.
                if (midpoint > distance) {
                    break;
                } else if (midpoint < 0) {
                    continue;
                }

                /*
                    Determine the glyph-midline, which is the vertical line in the glyph's
                    coordinate system that goes through the glyph's x-axis midpoint.

                    Position the glyph such that the glyph-midline passes through
                    the midpoint-on-the-path and is perpendicular to the line
                    through the startpoint-on-the-path and the endpoint-on-the-path.
                */
                assert pm != null;
                if (startpoint < 0 || endpoint > distance) {
                /*
                    In the calculation above, if either the startpoint-on-the-path
                    or the endpoint-on-the-path is off the end of the path,
                    TODO then extend the path beyond its end points with a straight line
                    that is parallel to the tangent at the path at its end point
                    so that the midpoint-on-the-path can still be calculated.

                    TODO suggest change in wording of svg spec:
                    so that the midpoint-on-the-path can still be calculated.
                    to
                    so that the angle of the glyph-midline to the x-axis can still be calculated.
                    or
                    so that the line through the startpoint-on-the-path and the
                    endpoint-on-the-path can still be calculated.
                */
                    final int flags = POSITION_MATRIX_FLAG | TANGENT_MATRIX_FLAG;
                    pm.getMatrix((float) midpoint, mid, flags);
                } else {
                    pm.getMatrix((float) startpoint, start, POSITION_MATRIX_FLAG);
                    pm.getMatrix((float) midpoint, mid, POSITION_MATRIX_FLAG);
                    pm.getMatrix((float) endpoint, end, POSITION_MATRIX_FLAG);

                    start.getValues(startPointMatrixData);
                    end.getValues(endPointMatrixData);

                    double startX = startPointMatrixData[MTRANS_X];
                    double startY = startPointMatrixData[MTRANS_Y];
                    double endX = endPointMatrixData[MTRANS_X];
                    double endY = endPointMatrixData[MTRANS_Y];

                    /*
                    line through the startpoint-on-the-path and the endpoint-on-the-path
                    */
                    double lineX = endX - startX;
                    double lineY = endY - startY;

                    double glyphMidlineAngle = Math.atan2(lineY, lineX);

                    mid.preRotate((float) (glyphMidlineAngle * radToDeg));
                }

            /*
                Align the glyph vertically relative to the midpoint-on-the-path based on property
                alignment-baseline and any specified values for attribute ‘dy’ on a ‘tspan’ element.
            */
                mid.preTranslate((float) -halfway, (float) (dy - baselineShift));
                mid.preScale((float) renderMethodScaling, (float) renderMethodScaling);
                mid.postTranslate(0, (float) y);
            } else {
                mid.setTranslate((float) startpoint, (float) (y + dy));
            }

            mid.preRotate((float) r);

            Path glyph = bag.getOrCreateAndCache(currentChar, current);
            glyph.transform(mid);
            path.addPath(glyph);
        }

        return path;
    }

    private double getRenderMethodScaling(double textMeasure, double distance) {
        if (textPath != null && textPath.getMethod() == TextPathMethod.stretch) {
            return distance / textMeasure;
        }
        return 1;
    }

    private double getAbsoluteStartOffset(double distance, double size, String startOffset) {
        return PropHelper.fromRelative(startOffset, distance, 0, mScale, size);
    }

    private double getTextAnchorOffset(TextAnchor textAnchor, double textMeasure) {
        switch (textAnchor) {
            default:
            case start:
                return 0;

            case middle:
                return -textMeasure / 2;

            case end:
                return -textMeasure;
        }
    }

    private void applyTextPropertiesToPaint(Paint paint, FontData font) {
        AssetManager assetManager = getThemedContext().getResources().getAssets();

        double fontSize = font.fontSize * mScale;

        boolean isBold = font.fontWeight == FontWeight.Bold;
        boolean isItalic = font.fontStyle == FontStyle.italic;

        boolean underlineText = false;
        boolean strikeThruText = false;

        TextDecoration decoration = font.textDecoration;
        if (decoration == TextDecoration.Underline) {
            underlineText = true;
        } else if (decoration == TextDecoration.LineThrough) {
            strikeThruText = true;
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

        // Do these have any effect for anyone? Not for me (@msand) at least.
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
