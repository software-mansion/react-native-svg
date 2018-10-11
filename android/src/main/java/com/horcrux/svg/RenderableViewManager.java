/*
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.util.SparseArray;
import android.view.View;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.DisplayMetricsHolder;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.MatrixMathHelper;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.TransformHelper;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

import static com.facebook.react.uimanager.MatrixMathHelper.determinant;
import static com.facebook.react.uimanager.MatrixMathHelper.inverse;
import static com.facebook.react.uimanager.MatrixMathHelper.multiplyVectorByMatrix;
import static com.facebook.react.uimanager.MatrixMathHelper.roundTo3Places;
import static com.facebook.react.uimanager.MatrixMathHelper.transpose;
import static com.facebook.react.uimanager.MatrixMathHelper.v3Combine;
import static com.facebook.react.uimanager.MatrixMathHelper.v3Cross;
import static com.facebook.react.uimanager.MatrixMathHelper.v3Dot;
import static com.facebook.react.uimanager.MatrixMathHelper.v3Length;
import static com.facebook.react.uimanager.MatrixMathHelper.v3Normalize;
import static com.horcrux.svg.RenderableShadowNode.CAP_ROUND;
import static com.horcrux.svg.RenderableShadowNode.FILL_RULE_NONZERO;
import static com.horcrux.svg.RenderableShadowNode.JOIN_ROUND;

/**
 * ViewManager for all shadowed RNSVG views: Group, Path and Text. Since these never get rendered
 * into native views and don't need any logic (all the logic is in {@link SvgView}), this
 * "stubbed" ViewManager is used for all of them.
 */
class RenderableViewManager<T extends VirtualNode> extends ViewGroupManager<RenderableView<T>> {

    /* package */ private static final String CLASS_GROUP = "RNSVGGroup";
    /* package */ private static final String CLASS_PATH = "RNSVGPath";
    /* package */ private static final String CLASS_TEXT = "RNSVGText";
    /* package */ private static final String CLASS_TSPAN = "RNSVGTSpan";
    /* package */ private static final String CLASS_TEXT_PATH = "RNSVGTextPath";
    /* package */ private static final String CLASS_IMAGE = "RNSVGImage";
    /* package */ private static final String CLASS_CIRCLE = "RNSVGCircle";
    /* package */ private static final String CLASS_ELLIPSE = "RNSVGEllipse";
    /* package */ private static final String CLASS_LINE = "RNSVGLine";
    /* package */ private static final String CLASS_RECT = "RNSVGRect";
    /* package */ private static final String CLASS_CLIP_PATH = "RNSVGClipPath";
    /* package */ private static final String CLASS_DEFS = "RNSVGDefs";
    /* package */ private static final String CLASS_USE = "RNSVGUse";
    /* package */ private static final String CLASS_SYMBOL = "RNSVGSymbol";
    /* package */ private static final String CLASS_LINEAR_GRADIENT = "RNSVGLinearGradient";
    /* package */ private static final String CLASS_RADIAL_GRADIENT = "RNSVGRadialGradient";
    /* package */ private static final String CLASS_PATTERN = "RNSVGPattern";
    /* package */ private static final String CLASS_MASK = "RNSVGMask";

    private final String mClassName;

    public static class MatrixDecompositionContext extends MatrixMathHelper.MatrixDecompositionContext {
        double[] perspective = new double[4];
        double[] scale = new double[3];
        double[] skew = new double[3];
        double[] translation = new double[3];
        double[] rotationDegrees = new double[3];
    }

    private static MatrixDecompositionContext sMatrixDecompositionContext =
            new MatrixDecompositionContext();
    private static double[] sTransformDecompositionArray = new double[16];

    private static final int PERSPECTIVE_ARRAY_INVERTED_CAMERA_DISTANCE_INDEX = 2;
    private static final float CAMERA_DISTANCE_NORMALIZATION_MULTIPLIER = 5;

    private static final double EPSILON = .00001d;

    private static boolean isZero(double d) {
        if (Double.isNaN(d)) {
            return false;
        }
        return Math.abs(d) < EPSILON;
    }

    /**
     * @param transformMatrix 16-element array of numbers representing 4x4 transform matrix
     */
    public static void decomposeMatrix(double[] transformMatrix, MatrixDecompositionContext ctx) {
        Assertions.assertCondition(transformMatrix.length == 16);

        // output values
        final double[] perspective = ctx.perspective;
        final double[] scale = ctx.scale;
        final double[] skew = ctx.skew;
        final double[] translation = ctx.translation;
        final double[] rotationDegrees = ctx.rotationDegrees;

        // create normalized, 2d array matrix
        // and normalized 1d array perspectiveMatrix with redefined 4th column
        if (isZero(transformMatrix[15])) {
            return;
        }
        double[][] matrix = new double[4][4];
        double[] perspectiveMatrix = new double[16];
        for (int i = 0; i < 4; i++) {
            for (int j = 0; j < 4; j++) {
                double value = transformMatrix[(i * 4) + j] / transformMatrix[15];
                matrix[i][j] = value;
                perspectiveMatrix[(i * 4) + j] = j == 3 ? 0 : value;
            }
        }
        perspectiveMatrix[15] = 1;

        // test for singularity of upper 3x3 part of the perspective matrix
        if (isZero(determinant(perspectiveMatrix))) {
            return;
        }

        // isolate perspective
        if (!isZero(matrix[0][3]) || !isZero(matrix[1][3]) || !isZero(matrix[2][3])) {
            // rightHandSide is the right hand side of the equation.
            // rightHandSide is a vector, or point in 3d space relative to the origin.
            double[] rightHandSide = { matrix[0][3], matrix[1][3], matrix[2][3], matrix[3][3] };

            // Solve the equation by inverting perspectiveMatrix and multiplying
            // rightHandSide by the inverse.
            double[] inversePerspectiveMatrix = inverse(
                    perspectiveMatrix
            );
            double[] transposedInversePerspectiveMatrix = transpose(
                    inversePerspectiveMatrix
            );
            multiplyVectorByMatrix(rightHandSide, transposedInversePerspectiveMatrix, perspective);
        } else {
            // no perspective
            perspective[0] = perspective[1] = perspective[2] = 0d;
            perspective[3] = 1d;
        }

        // translation is simple
        for (int i = 0; i < 3; i++) {
            translation[i] = matrix[3][i];
        }

        // Now get scale and shear.
        // 'row' is a 3 element array of 3 component vectors
        double[][] row = new double[3][3];
        for (int i = 0; i < 3; i++) {
            row[i][0] = matrix[i][0];
            row[i][1] = matrix[i][1];
            row[i][2] = matrix[i][2];
        }

        // Compute X scale factor and normalize first row.
        scale[0] = v3Length(row[0]);
        row[0] = v3Normalize(row[0], scale[0]);

        // Compute XY shear factor and make 2nd row orthogonal to 1st.
        skew[0] = v3Dot(row[0], row[1]);
        row[1] = v3Combine(row[1], row[0], 1.0, -skew[0]);

        // Compute XY shear factor and make 2nd row orthogonal to 1st.
        skew[0] = v3Dot(row[0], row[1]);
        row[1] = v3Combine(row[1], row[0], 1.0, -skew[0]);

        // Now, compute Y scale and normalize 2nd row.
        scale[1] = v3Length(row[1]);
        row[1] = v3Normalize(row[1], scale[1]);
        skew[0] /= scale[1];

        // Compute XZ and YZ shears, orthogonalize 3rd row
        skew[1] = v3Dot(row[0], row[2]);
        row[2] = v3Combine(row[2], row[0], 1.0, -skew[1]);
        skew[2] = v3Dot(row[1], row[2]);
        row[2] = v3Combine(row[2], row[1], 1.0, -skew[2]);

        // Next, get Z scale and normalize 3rd row.
        scale[2] = v3Length(row[2]);
        row[2] = v3Normalize(row[2], scale[2]);
        skew[1] /= scale[2];
        skew[2] /= scale[2];

        // At this point, the matrix (in rows) is orthonormal.
        // Check for a coordinate system flip.  If the determinant
        // is -1, then negate the matrix and the scaling factors.
        double[] pdum3 = v3Cross(row[1], row[2]);
        if (v3Dot(row[0], pdum3) < 0) {
            for (int i = 0; i < 3; i++) {
                scale[i] *= -1;
                row[i][0] *= -1;
                row[i][1] *= -1;
                row[i][2] *= -1;
            }
        }

        // Now, get the rotations out
        // Based on: http://nghiaho.com/?page_id=846
        double conv = 180 / Math.PI;
        rotationDegrees[0] = roundTo3Places(-Math.atan2(row[2][1], row[2][2]) * conv);
        rotationDegrees[1] = roundTo3Places(-Math.atan2(-row[2][0], Math.sqrt(row[2][1] * row[2][1] + row[2][2] * row[2][2])) * conv);
        rotationDegrees[2] = roundTo3Places(-Math.atan2(row[1][0], row[0][0]) * conv);
    }

    private static void setTransformProperty(View view, ReadableArray transforms) {
        TransformHelper.processTransform(transforms, sTransformDecompositionArray);
        decomposeMatrix(sTransformDecompositionArray, sMatrixDecompositionContext);
        view.setTranslationX(
                PixelUtil.toPixelFromDIP((float) sMatrixDecompositionContext.translation[0]));
        view.setTranslationY(
                PixelUtil.toPixelFromDIP((float) sMatrixDecompositionContext.translation[1]));
        view.setRotation((float) sMatrixDecompositionContext.rotationDegrees[2]);
        view.setRotationX((float) sMatrixDecompositionContext.rotationDegrees[0]);
        view.setRotationY((float) sMatrixDecompositionContext.rotationDegrees[1]);
        view.setScaleX((float) sMatrixDecompositionContext.scale[0]);
        view.setScaleY((float) sMatrixDecompositionContext.scale[1]);

        double[] perspectiveArray = sMatrixDecompositionContext.perspective;

        if (perspectiveArray.length > PERSPECTIVE_ARRAY_INVERTED_CAMERA_DISTANCE_INDEX) {
            float invertedCameraDistance = (float) perspectiveArray[PERSPECTIVE_ARRAY_INVERTED_CAMERA_DISTANCE_INDEX];
            if (invertedCameraDistance == 0) {
                // Default camera distance, before scale multiplier (1280)
                invertedCameraDistance = 0.00078125f;
            }
            float cameraDistance = -1 / invertedCameraDistance;
            float scale = DisplayMetricsHolder.getScreenDisplayMetrics().density;

            // The following converts the matrix's perspective to a camera distance
            // such that the camera perspective looks the same on Android and iOS
            float normalizedCameraDistance = scale * cameraDistance * CAMERA_DISTANCE_NORMALIZATION_MULTIPLIER;
            view.setCameraDistance(normalizedCameraDistance);

        }
    }

    private static void resetTransformProperty(View view) {
        view.setTranslationX(PixelUtil.toPixelFromDIP(0));
        view.setTranslationY(PixelUtil.toPixelFromDIP(0));
        view.setRotation(0);
        view.setRotationX(0);
        view.setRotationY(0);
        view.setScaleX(1);
        view.setScaleY(1);
        view.setCameraDistance(0);
    }

    static RenderableViewManager<GroupShadowNode> createGroupViewManager() {
        return new RenderableViewManager<>(CLASS_GROUP);
    }

    static RenderableViewManager<PathShadowNode> createPathViewManager() {
        return new RenderableViewManager<PathShadowNode>(CLASS_PATH) {

            @ReactProp(name = "d")
            public void setD(RenderableView<PathShadowNode> node, String d) {
                node.shadowNode.setD(d);
            }
        };
    }

    static RenderableViewManager<TextShadowNode> createTextViewManager() {
        return new RenderableViewManager<TextShadowNode>(CLASS_TEXT) {

            @ReactProp(name = "textLength")
            public void setTextLength(RenderableView<TextShadowNode> node, Dynamic length) {
                node.shadowNode.setTextLength(length);
            }

            @ReactProp(name = "lengthAdjust")
            public void setLengthAdjust(RenderableView<TextShadowNode> node, @Nullable String adjustment) {
                node.shadowNode.setLengthAdjust(adjustment);
            }

            @ReactProp(name = "alignmentBaseline")
            public void setMethod(RenderableView<TextShadowNode> node, @Nullable String alignment) {
                node.shadowNode.setMethod(alignment);
            }

            @ReactProp(name = "baselineShift")
            public void setBaselineShift(RenderableView<TextShadowNode> node, Dynamic baselineShift) {
                node.shadowNode.setBaselineShift(baselineShift);
            }

            @ReactProp(name = "verticalAlign")
            public void setVerticalAlign(RenderableView<TextShadowNode> node, @Nullable String verticalAlign) {
                node.shadowNode.setVerticalAlign(verticalAlign);
            }

            @ReactProp(name = "rotate")
            public void setRotate(RenderableView<TextShadowNode> node, Dynamic rotate) {
                node.shadowNode.setRotate(rotate);
            }

            @ReactProp(name = "dx")
            public void setDeltaX(RenderableView<TextShadowNode> node, Dynamic deltaX) {
                node.shadowNode.setDeltaX(deltaX);
            }

            @ReactProp(name = "dy")
            public void setDeltaY(RenderableView<TextShadowNode> node, Dynamic deltaY) {
                node.shadowNode.setDeltaY(deltaY);
            }

            @ReactProp(name = "positionX")
            public void setPositionX(RenderableView<TextShadowNode> node, Dynamic positionX) {
                node.shadowNode.setPositionX(positionX);
            }

            @ReactProp(name = "x")
            public void setX(RenderableView<TextShadowNode> node, Dynamic positionX) {
                node.shadowNode.setPositionX(positionX);
            }

            @ReactProp(name = "positionY")
            public void setPositionY(RenderableView<TextShadowNode> node, Dynamic positionY) {
                node.shadowNode.setPositionY(positionY);
            }

            @ReactProp(name = "y")
            public void setY(RenderableView<TextShadowNode> node, Dynamic positionY) {
                node.shadowNode.setPositionY(positionY);
            }

            @ReactProp(name = "font")
            public void setFont(RenderableView<TextShadowNode> node, @Nullable ReadableMap font) {
                node.shadowNode.setFont(font);
            }
        };
    }

    static RenderableViewManager<TSpanShadowNode> createTSpanViewManager() {
        return new RenderableViewManager<TSpanShadowNode>(CLASS_TSPAN) {

            @ReactProp(name = "content")
            public void setContent(RenderableView<TSpanShadowNode> node, @Nullable String content) {
                node.shadowNode.setContent(content);
            }

            @ReactProp(name = "rotate")
            public void setRotate(RenderableView<TextShadowNode> node, Dynamic rotate) {
                node.shadowNode.setRotate(rotate);
            }

            @ReactProp(name = "dx")
            public void setDeltaX(RenderableView<TextShadowNode> node, Dynamic deltaX) {
                node.shadowNode.setDeltaX(deltaX);
            }

            @ReactProp(name = "dy")
            public void setDeltaY(RenderableView<TextShadowNode> node, Dynamic deltaY) {
                node.shadowNode.setDeltaY(deltaY);
            }

            @ReactProp(name = "positionX")
            public void setPositionX(RenderableView<TextShadowNode> node, Dynamic positionX) {
                node.shadowNode.setPositionX(positionX);
            }

            @ReactProp(name = "x")
            public void setX(RenderableView<TextShadowNode> node, Dynamic positionX) {
                node.shadowNode.setPositionX(positionX);
            }

            @ReactProp(name = "positionY")
            public void setPositionY(RenderableView<TextShadowNode> node, Dynamic positionY) {
                node.shadowNode.setPositionY(positionY);
            }

            @ReactProp(name = "y")
            public void setY(RenderableView<TextShadowNode> node, Dynamic positionY) {
                node.shadowNode.setPositionY(positionY);
            }
        };
    }

    static RenderableViewManager<TextPathShadowNode> createTextPathViewManager() {
        return new RenderableViewManager<TextPathShadowNode>(CLASS_TEXT_PATH) {

            @ReactProp(name = "href")
            public void setHref(RenderableView<TextPathShadowNode> node, String href) {
                node.shadowNode.setHref(href);
            }

            @ReactProp(name = "startOffset")
            public void setStartOffset(RenderableView<TextPathShadowNode> node, Dynamic startOffset) {
                node.shadowNode.setStartOffset(startOffset);
            }

            @ReactProp(name = "method")
            public void setMethod(RenderableView<TextPathShadowNode> node, @Nullable String method) {
                node.shadowNode.setMethod(method);
            }

            @ReactProp(name = "spacing")
            public void setSpacing(RenderableView<TextPathShadowNode> node, @Nullable String spacing) {
                node.shadowNode.setSpacing(spacing);
            }

            @ReactProp(name = "side")
            public void setSide(RenderableView<TextPathShadowNode> node, @Nullable String side) {
                node.shadowNode.setSide(side);
            }

            @ReactProp(name = "midLine")
            public void setSharp(RenderableView<TextPathShadowNode> node, @Nullable String midLine) {
                node.shadowNode.setSharp(midLine);
            }
        };
    }

    static RenderableViewManager<ImageShadowNode> createImageViewManager() {
        return new RenderableViewManager<ImageShadowNode>(CLASS_IMAGE) {

            @ReactProp(name = "x")
            public void setX(RenderableView<ImageShadowNode> node, Dynamic x) {
                node.shadowNode.setX(x);
            }

            @ReactProp(name = "y")
            public void setY(RenderableView<ImageShadowNode> node, Dynamic y) {
                node.shadowNode.setY(y);
            }

            @ReactProp(name = "imagewidth")
            public void setImageWidth(RenderableView<ImageShadowNode> node, Dynamic width) {
                node.shadowNode.setWidth(width);
            }

            @ReactProp(name = "width")
            public void setWidth(RenderableView<ImageShadowNode> node, Dynamic width) {
                node.shadowNode.setWidth(width);
            }

            @ReactProp(name = "imageheight")
            public void setImageHeight(RenderableView<ImageShadowNode> node, Dynamic height) {
                node.shadowNode.seHeight(height);
            }

            @ReactProp(name = "height")
            public void setHeight(RenderableView<ImageShadowNode> node, Dynamic height) {
                node.shadowNode.seHeight(height);
            }

            @ReactProp(name = "src")
            public void setSrc(RenderableView<ImageShadowNode> node, @Nullable ReadableMap src) {
                node.shadowNode.setSrc(src);
            }


            @ReactProp(name = "align")
            public void setAlign(RenderableView<ImageShadowNode> node, String align) {
                node.shadowNode.setAlign(align);
            }

            @ReactProp(name = "meetOrSlice")
            public void setMeetOrSlice(RenderableView<ImageShadowNode> node, int meetOrSlice) {
                node.shadowNode.setMeetOrSlice(meetOrSlice);
            }
        };
    }

    static RenderableViewManager<CircleShadowNode> createCircleViewManager() {
        return new RenderableViewManager<CircleShadowNode>(CLASS_CIRCLE) {

            @ReactProp(name = "cx")
            public void setCx(RenderableView<CircleShadowNode> node, Dynamic cx) {
                node.shadowNode.setCx(cx);
            }

            @ReactProp(name = "cy")
            public void setCy(RenderableView<CircleShadowNode> node, Dynamic cy) {
                node.shadowNode.setCy(cy);
            }

            @ReactProp(name = "r")
            public void setR(RenderableView<CircleShadowNode> node, Dynamic r) {
                node.shadowNode.setR(r);
            }
        };
    }

    static RenderableViewManager<EllipseShadowNode> createEllipseViewManager() {
        return new RenderableViewManager<EllipseShadowNode>(CLASS_ELLIPSE) {

            @ReactProp(name = "cx")
            public void setCx(RenderableView<EllipseShadowNode> node, Dynamic cx) {
                node.shadowNode.setCx(cx);
            }

            @ReactProp(name = "cy")
            public void setCy(RenderableView<EllipseShadowNode> node, Dynamic cy) {
                node.shadowNode.setCy(cy);
            }

            @ReactProp(name = "rx")
            public void setRx(RenderableView<EllipseShadowNode> node, Dynamic rx) {
                node.shadowNode.setRx(rx);
            }

            @ReactProp(name = "ry")
            public void setRy(RenderableView<EllipseShadowNode> node, Dynamic ry) {
                node.shadowNode.setRy(ry);
            }
        };
    }

    static RenderableViewManager<LineShadowNode> createLineViewManager() {
        return new RenderableViewManager<LineShadowNode>(CLASS_LINE) {

            @ReactProp(name = "x1")
            public void setX1(RenderableView<LineShadowNode> node, Dynamic x1) {
                node.shadowNode.setX1(x1);
            }

            @ReactProp(name = "y1")
            public void setY1(RenderableView<LineShadowNode> node, Dynamic y1) {
                node.shadowNode.setY1(y1);
            }

            @ReactProp(name = "x2")
            public void setX2(RenderableView<LineShadowNode> node, Dynamic x2) {
                node.shadowNode.setX2(x2);
            }

            @ReactProp(name = "y2")
            public void setY2(RenderableView<LineShadowNode> node, Dynamic y2) {
                node.shadowNode.setY2(y2);
            }

        };
    }

    static RenderableViewManager<RectShadowNode> createRectViewManager() {
        return new RenderableViewManager<RectShadowNode>(CLASS_RECT) {

            @ReactProp(name = "x")
            public void setX(RenderableView<RectShadowNode> node, Dynamic x) {
                node.shadowNode.setX(x);
            }

            @ReactProp(name = "y")
            public void setY(RenderableView<RectShadowNode> node, Dynamic y) {
                node.shadowNode.setY(y);
            }

            @ReactProp(name = "rectwidth")
            public void setRectWidth(RenderableView<RectShadowNode> node, Dynamic width) {
                node.shadowNode.setWidth(width);
            }

            @ReactProp(name = "width")
            public void setWidth(RenderableView<RectShadowNode> node, Dynamic width) {
                node.shadowNode.setWidth(width);
            }

            @ReactProp(name = "rectheight")
            public void setRectHeight(RenderableView<RectShadowNode> node, Dynamic height) {
                node.shadowNode.setHeight(height);
            }

            @ReactProp(name = "height")
            public void setHeight(RenderableView<RectShadowNode> node, Dynamic height) {
                node.shadowNode.setHeight(height);
            }

            @ReactProp(name = "rx")
            public void setRx(RenderableView<RectShadowNode> node, Dynamic rx) {
                node.shadowNode.setRx(rx);
            }

            @ReactProp(name = "ry")
            public void setRy(RenderableView<RectShadowNode> node, Dynamic ry) {
                node.shadowNode.setRy(ry);
            }
        };
    }

    static RenderableViewManager createClipPathViewManager() {
        return new RenderableViewManager(CLASS_CLIP_PATH);
    }

    static RenderableViewManager createDefsViewManager() {
        return new RenderableViewManager(CLASS_DEFS);
    }

    static RenderableViewManager<UseShadowNode> createUseViewManager() {
        return new RenderableViewManager<UseShadowNode>(CLASS_USE) {

            @ReactProp(name = "href")
            public void setHref(RenderableView<UseShadowNode> node, String href) {
                node.shadowNode.setHref(href);
            }

            @ReactProp(name = "usewidth")
            public void setUseWidth(RenderableView<UseShadowNode> node, Dynamic width) {
                node.shadowNode.setWidth(width);
            }

            @ReactProp(name = "width")
            public void setWidth(RenderableView<UseShadowNode> node, Dynamic width) {
                node.shadowNode.setWidth(width);
            }

            @ReactProp(name = "useheight")
            public void setUseHeight(RenderableView<UseShadowNode> node, Dynamic height) {
                node.shadowNode.setHeight(height);
            }

            @ReactProp(name = "height")
            public void setHeight(RenderableView<UseShadowNode> node, Dynamic height) {
                node.shadowNode.setHeight(height);
            }
        };
    }

    static RenderableViewManager<SymbolShadowNode> createSymbolManager() {
        return new RenderableViewManager<SymbolShadowNode>(CLASS_SYMBOL) {

            @ReactProp(name = "minX")
            public void setMinX(RenderableView<SymbolShadowNode> node, float minX) {
                node.shadowNode.setMinX(minX);
            }

            @ReactProp(name = "minY")
            public void setMinY(RenderableView<SymbolShadowNode> node, float minY) {
                node.shadowNode.setMinY(minY);
            }

            @ReactProp(name = "vbWidth")
            public void setVbWidth(RenderableView<SymbolShadowNode> node, float vbWidth) {
                node.shadowNode.setVbWidth(vbWidth);
            }

            @ReactProp(name = "vbHeight")
            public void setVbHeight(RenderableView<SymbolShadowNode> node, float vbHeight) {
                node.shadowNode.setVbHeight(vbHeight);
            }

            @ReactProp(name = "align")
            public void setAlign(RenderableView<SymbolShadowNode> node, String align) {
                node.shadowNode.setAlign(align);
            }

            @ReactProp(name = "meetOrSlice")
            public void setMeetOrSlice(RenderableView<SymbolShadowNode> node, int meetOrSlice) {
                node.shadowNode.setMeetOrSlice(meetOrSlice);
            }
        };
    }

    static RenderableViewManager<PatternShadowNode> createPatternManager() {
        return new RenderableViewManager<PatternShadowNode>(CLASS_PATTERN) {

            @ReactProp(name = "x")
            public void setX(RenderableView<PatternShadowNode> node, Dynamic x) {
                node.shadowNode.setX(x);
            }

            @ReactProp(name = "y")
            public void setY(RenderableView<PatternShadowNode> node, Dynamic y) {
                node.shadowNode.setY(y);
            }

            @ReactProp(name = "patternwidth")
            public void setPatternWidth(RenderableView<PatternShadowNode> node, Dynamic width) {
                node.shadowNode.setWidth(width);
            }

            @ReactProp(name = "width")
            public void setWidth(RenderableView<PatternShadowNode> node, Dynamic width) {
                node.shadowNode.setWidth(width);
            }

            @ReactProp(name = "patternheight")
            public void setPatternHeight(RenderableView<PatternShadowNode> node, Dynamic height) {
                node.shadowNode.setHeight(height);
            }

            @ReactProp(name = "height")
            public void setHeight(RenderableView<PatternShadowNode> node, Dynamic height) {
                node.shadowNode.setHeight(height);
            }

            @ReactProp(name = "patternUnits")
            public void setPatternUnits(RenderableView<PatternShadowNode> node, int patternUnits) {
                node.shadowNode.setPatternUnits(patternUnits);
            }

            @ReactProp(name = "patternContentUnits")
            public void setPatternContentUnits(RenderableView<PatternShadowNode> node, int patternContentUnits) {
                node.shadowNode.setPatternContentUnits(patternContentUnits);
            }

            @ReactProp(name = "patternTransform")
            public void setPatternTransform(RenderableView<PatternShadowNode> node, @Nullable ReadableArray matrixArray) {
                node.shadowNode.setPatternTransform(matrixArray);
            }

            @ReactProp(name = "minX")
            public void setMinX(RenderableView<PatternShadowNode> node, float minX) {
                node.shadowNode.setMinX(minX);
            }

            @ReactProp(name = "minY")
            public void setMinY(RenderableView<PatternShadowNode> node, float minY) {
                node.shadowNode.setMinY(minY);
            }

            @ReactProp(name = "vbWidth")
            public void setVbWidth(RenderableView<PatternShadowNode> node, float vbWidth) {
                node.shadowNode.setVbWidth(vbWidth);
            }

            @ReactProp(name = "vbHeight")
            public void setVbHeight(RenderableView<PatternShadowNode> node, float vbHeight) {
                node.shadowNode.setVbHeight(vbHeight);
            }

            @ReactProp(name = "align")
            public void setAlign(RenderableView<PatternShadowNode> node, String align) {
                node.shadowNode.setAlign(align);
            }

            @ReactProp(name = "meetOrSlice")
            public void setMeetOrSlice(RenderableView<PatternShadowNode> node, int meetOrSlice) {
                node.shadowNode.setMeetOrSlice(meetOrSlice);
            }
        };
    }

    static RenderableViewManager<MaskShadowNode> createMaskManager() {
        return new RenderableViewManager<MaskShadowNode>(CLASS_MASK) {

            @ReactProp(name = "x")
            public void setX(RenderableView<MaskShadowNode> node, Dynamic x) {
                node.shadowNode.setX(x);
            }

            @ReactProp(name = "y")
            public void setY(RenderableView<MaskShadowNode> node, Dynamic y) {
                node.shadowNode.setY(y);
            }

            @ReactProp(name = "maskwidth")
            public void setMaskWidth(RenderableView<MaskShadowNode> node, Dynamic width) {
                node.shadowNode.setWidth(width);
            }

            @ReactProp(name = "width")
            public void setWidth(RenderableView<MaskShadowNode> node, Dynamic width) {
                node.shadowNode.setWidth(width);
            }

            @ReactProp(name = "maskheight")
            public void setMaskHeight(RenderableView<MaskShadowNode> node, Dynamic height) {
                node.shadowNode.setHeight(height);
            }

            @ReactProp(name = "height")
            public void setHeight(RenderableView<MaskShadowNode> node, Dynamic height) {
                node.shadowNode.setHeight(height);
            }

            @ReactProp(name = "maskUnits")
            public void setMaskUnits(RenderableView<MaskShadowNode> node, int maskUnits) {
                node.shadowNode.setMaskUnits(maskUnits);
            }

            @ReactProp(name = "maskContentUnits")
            public void setMaskContentUnits(RenderableView<MaskShadowNode> node, int maskContentUnits) {
                node.shadowNode.setMaskContentUnits(maskContentUnits);
            }

            @ReactProp(name = "maskTransform")
            public void setMaskTransform(RenderableView<MaskShadowNode> node, @Nullable ReadableArray matrixArray) {
                node.shadowNode.setMaskTransform(matrixArray);
            }
        };
    }

    static RenderableViewManager<LinearGradientShadowNode> createLinearGradientManager() {
        return new RenderableViewManager<LinearGradientShadowNode>(CLASS_LINEAR_GRADIENT) {

            @ReactProp(name = "x1")
            public void setX1(RenderableView<LinearGradientShadowNode> node, Dynamic x1) {
                node.shadowNode.setX1(x1);
            }

            @ReactProp(name = "y1")
            public void setY1(RenderableView<LinearGradientShadowNode> node, Dynamic y1) {
                node.shadowNode.setY1(y1);
            }

            @ReactProp(name = "x2")
            public void setX2(RenderableView<LinearGradientShadowNode> node, Dynamic x2) {
                node.shadowNode.setX2(x2);
            }

            @ReactProp(name = "y2")
            public void setY2(RenderableView<LinearGradientShadowNode> node, Dynamic y2) {
                node.shadowNode.setY2(y2);
            }

            @ReactProp(name = "gradient")
            public void setGradient(RenderableView<LinearGradientShadowNode> node, ReadableArray gradient) {
                node.shadowNode.setGradient(gradient);
            }

            @ReactProp(name = "gradientUnits")
            public void setGradientUnits(RenderableView<LinearGradientShadowNode> node, int gradientUnits) {
                node.shadowNode.setGradientUnits(gradientUnits);
            }

            @ReactProp(name = "gradientTransform")
            public void setGradientTransform(RenderableView<LinearGradientShadowNode> node, @Nullable ReadableArray matrixArray) {
                node.shadowNode.setGradientTransform(matrixArray);
            }
        };
    }

    static RenderableViewManager<RadialGradientShadowNode> createRadialGradientManager() {
        return new RenderableViewManager<RadialGradientShadowNode>(CLASS_RADIAL_GRADIENT) {

            @ReactProp(name = "fx")
            public void setFx(RenderableView<RadialGradientShadowNode> node, Dynamic fx) {
                node.shadowNode.setFx(fx);
            }

            @ReactProp(name = "fy")
            public void setFy(RenderableView<RadialGradientShadowNode> node, Dynamic fy) {
                node.shadowNode.setFy(fy);
            }

            @ReactProp(name = "rx")
            public void setRx(RenderableView<RadialGradientShadowNode> node, Dynamic rx) {
                node.shadowNode.setRx(rx);
            }

            @ReactProp(name = "ry")
            public void setRy(RenderableView<RadialGradientShadowNode> node, Dynamic ry) {
                node.shadowNode.setRy(ry);
            }

            @ReactProp(name = "cx")
            public void setCx(RenderableView<RadialGradientShadowNode> node, Dynamic cx) {
                node.shadowNode.setCx(cx);
            }

            @ReactProp(name = "cy")
            public void setCy(RenderableView<RadialGradientShadowNode> node, Dynamic cy) {
                node.shadowNode.setCy(cy);
            }

            @ReactProp(name = "gradient")
            public void setGradient(RenderableView<RadialGradientShadowNode> node, ReadableArray gradient) {
                node.shadowNode.setGradient(gradient);
            }

            @ReactProp(name = "gradientUnits")
            public void setGradientUnits(RenderableView<RadialGradientShadowNode> node, int gradientUnits) {
                node.shadowNode.setGradientUnits(gradientUnits);
            }

            @ReactProp(name = "gradientTransform")
            public void setGradientTransform(RenderableView<RadialGradientShadowNode> node, @Nullable ReadableArray matrixArray) {
                node.shadowNode.setGradientTransform(matrixArray);
            }
        };
    }

    private RenderableViewManager(String className) {
        mClassName = className;
    }

    @Override
    public String getName() {
        return mClassName;
    }

    @Override
    public LayoutShadowNode createShadowNodeInstance() {
        switch (mClassName) {
            case CLASS_GROUP:
                return new GroupShadowNode();
            case CLASS_PATH:
                return new PathShadowNode();
            case CLASS_CIRCLE:
                return new CircleShadowNode();
            case CLASS_ELLIPSE:
                return new EllipseShadowNode();
            case CLASS_LINE:
                return new LineShadowNode();
            case CLASS_RECT:
                return new RectShadowNode();
            case CLASS_TEXT:
                return new TextShadowNode();
            case CLASS_TSPAN:
                return new TSpanShadowNode();
            case CLASS_TEXT_PATH:
                return new TextPathShadowNode();
            case CLASS_IMAGE:
                return new ImageShadowNode();
            case CLASS_CLIP_PATH:
                return new ClipPathShadowNode();
            case CLASS_DEFS:
                return new DefsShadowNode();
            case CLASS_USE:
                return new UseShadowNode();
            case CLASS_SYMBOL:
                return new SymbolShadowNode();
            case CLASS_LINEAR_GRADIENT:
                return new LinearGradientShadowNode();
            case CLASS_RADIAL_GRADIENT:
                return new RadialGradientShadowNode();
            case CLASS_PATTERN:
                return new PatternShadowNode();
            case CLASS_MASK:
                return new MaskShadowNode();
            default:
                throw new IllegalStateException("Unexpected type " + mClassName);
        }
    }

    @Override
    public Class<? extends VirtualNode> getShadowNodeClass() {
        switch (mClassName) {
            case CLASS_GROUP:
                return GroupShadowNode.class;
            case CLASS_PATH:
                return PathShadowNode.class;
            case CLASS_CIRCLE:
                return CircleShadowNode.class;
            case CLASS_ELLIPSE:
                return EllipseShadowNode.class;
            case CLASS_LINE:
                return LineShadowNode.class;
            case CLASS_RECT:
                return RectShadowNode.class;
            case CLASS_TEXT:
                return TextShadowNode.class;
            case CLASS_TSPAN:
                return TSpanShadowNode.class;
            case CLASS_TEXT_PATH:
                return TextPathShadowNode.class;
            case CLASS_IMAGE:
                return ImageShadowNode.class;
            case CLASS_CLIP_PATH:
                return ClipPathShadowNode.class;
            case CLASS_DEFS:
                return DefsShadowNode.class;
            case CLASS_USE:
                return UseShadowNode.class;
            case CLASS_SYMBOL:
                return SymbolShadowNode.class;
            case CLASS_LINEAR_GRADIENT:
                return LinearGradientShadowNode.class;
            case CLASS_RADIAL_GRADIENT:
                return RadialGradientShadowNode.class;
            case CLASS_PATTERN:
                return PatternShadowNode.class;
            case CLASS_MASK:
                return MaskShadowNode.class;
            default:
                throw new IllegalStateException("Unexpected type " + mClassName);
        }
    }

    @ReactProp(name = "mask")
    public void setMask(RenderableView<RenderableShadowNode> node, String mask) {
        node.shadowNode.setMask(mask);
    }

    @ReactProp(name = "clipPath")
    public void setClipPath(RenderableView<RenderableShadowNode> node, String clipPath) {
        node.shadowNode.setClipPath(clipPath);
    }

    @ReactProp(name = "clipRule")
    public void setClipRule(RenderableView<RenderableShadowNode> node, int clipRule) {
        node.shadowNode.setClipRule(clipRule);
    }

    @ReactProp(name = "fill")
    public void setFill(RenderableView<RenderableShadowNode> node, @Nullable Dynamic fill) {
        node.shadowNode.setFill(fill);
    }

    @ReactProp(name = "fillOpacity", defaultFloat = 1f)
    public void setFillOpacity(RenderableView<RenderableShadowNode> node, float fillOpacity) {
        node.shadowNode.setFillOpacity(fillOpacity);
    }

    @ReactProp(name = "fillRule", defaultInt = FILL_RULE_NONZERO)
    public void setFillRule(RenderableView<RenderableShadowNode> node, int fillRule) {
        node.shadowNode.setFillRule(fillRule);
    }


    @ReactProp(name = "stroke")
    public void setStroke(RenderableView<RenderableShadowNode> node, @Nullable Dynamic strokeColors) {
        node.shadowNode.setStroke(strokeColors);
    }

    @ReactProp(name = "strokeOpacity", defaultFloat = 1f)
    public void setStrokeOpacity(RenderableView<RenderableShadowNode> node, float strokeOpacity) {
        node.shadowNode.setStrokeOpacity(strokeOpacity);
    }

    @ReactProp(name = "strokeDasharray")
    public void setStrokeDasharray(RenderableView<RenderableShadowNode> node, @Nullable ReadableArray strokeDasharray) {
        node.shadowNode.setStrokeDasharray(strokeDasharray);
    }

    @ReactProp(name = "strokeDashoffset")
    public void setStrokeDashoffset(RenderableView<RenderableShadowNode> node, float strokeDashoffset) {
        node.shadowNode.setStrokeDashoffset(strokeDashoffset);
    }

    @ReactProp(name = "strokeWidth")
    public void setStrokeWidth(RenderableView<RenderableShadowNode> node, Dynamic strokeWidth) {
        node.shadowNode.setStrokeWidth(strokeWidth);
    }

    @ReactProp(name = "strokeMiterlimit", defaultFloat = 4f)
    public void setStrokeMiterlimit(RenderableView<RenderableShadowNode> node, float strokeMiterlimit) {
        node.shadowNode.setStrokeMiterlimit(strokeMiterlimit);
    }

    @ReactProp(name = "strokeLinecap", defaultInt = CAP_ROUND)
    public void setStrokeLinecap(RenderableView<RenderableShadowNode> node, int strokeLinecap) {
        node.shadowNode.setStrokeLinecap(strokeLinecap);
    }

    @ReactProp(name = "strokeLinejoin", defaultInt = JOIN_ROUND)
    public void setStrokeLinejoin(RenderableView<RenderableShadowNode> node, int strokeLinejoin) {
        node.shadowNode.setStrokeLinejoin(strokeLinejoin);
    }

    @ReactProp(name = "matrix")
    public void setMatrix(RenderableView<RenderableShadowNode> node, Dynamic matrixArray) {
        node.shadowNode.setMatrix(matrixArray);
    }

    @ReactProp(name = "transform")
    public void setTransform(RenderableView<RenderableShadowNode> node, ReadableArray matrix) {
        if (matrix == null) {
            resetTransformProperty(node);
        } else {
            setTransformProperty(node, matrix);
            node.shadowNode.mTransform = node.getMatrix();
        }
    }

    @ReactProp(name = "propList")
    public void setPropList(RenderableView<RenderableShadowNode> node, @Nullable ReadableArray propList) {
        node.shadowNode.setPropList(propList);
    }

    /**
     * Callback that will be triggered after all properties are updated in current update transaction
     * (all @ReactProp handlers for properties updated in current transaction have been called). If
     * you want to override this method you should call super.onAfterUpdateTransaction from it as
     * the parent class of the ViewManager may rely on callback being executed.
     */
    protected void onAfterUpdateTransaction(RenderableView<T> node) {
        super.onAfterUpdateTransaction(node);
        VirtualNode shadow = node.shadowNode;
        SvgViewShadowNode view = shadow.getSvgShadowNode();
        if (view == null) {
            return;
        }
        SvgView root = SvgViewManager.getSvgViewByTag(view.getReactTag());
        if (root == null) {
            return;
        }
        root.invalidate();
    }

    @Override
    protected RenderableView<T> createViewInstance(ThemedReactContext reactContext) {
        return new RenderableView<T>(reactContext);
    }

    @Override
    public void updateExtraData(RenderableView<T> root, Object extraData) {
        throw new IllegalStateException("SVG elements does not map into a native view");
    }

    private static final SparseArray<VirtualNode> mTagToShadowNode = new SparseArray<>();

    @Override
    public void onDropViewInstance(RenderableView<T> view) {
        mTagToShadowNode.remove(view.getId());
        view.dropView();
    }

    static void setShadowNode(VirtualNode virtualNode) {
        mTagToShadowNode.put(virtualNode.getReactTag(), virtualNode);
    }

    static VirtualNode getShadowNodeByTag(int id) {
        return mTagToShadowNode.get(id);
    }
}
