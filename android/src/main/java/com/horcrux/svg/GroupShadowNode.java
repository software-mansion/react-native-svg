/*
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
import android.graphics.Point;
import android.graphics.PointF;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ReactShadowNode;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

/**
 * Shadow node for virtual Group view
 */
class GroupShadowNode extends RenderableShadowNode {
    @Nullable ReadableMap mFont;

    private GlyphContext mGlyphContext;

    @ReactProp(name = "font")
    public void setFont(@Nullable ReadableMap font) {
        mFont = font;
        markUpdated();
    }

    void setupGlyphContext() {
        mGlyphContext = new GlyphContext(mScale, getCanvasWidth(), getCanvasHeight());
    }

    GlyphContext getGlyphContext() {
        if (mGlyphContext == null) {
            setupGlyphContext();
        }
        return mGlyphContext;
    }

    protected void pushGlyphContext() {
        getTextRoot().getGlyphContext().pushContext(this, mFont);
    }

    protected void popGlyphContext() {
        getTextRoot().getGlyphContext().popContext();
    }

    ReadableMap getFontFromContext() {
        return  getTextRoot().getGlyphContext().getGlyphFont();
    }

    PointF getGlyphPointFromContext(float glyphWidth) {
        return  getTextRoot().getGlyphContext().getNextGlyphPoint(glyphWidth);
    }

    PointF getGlyphDeltaFromContext() {
        return  getTextRoot().getGlyphContext().getNextGlyphDelta();
    }

    float getNextGlyphRotationFromContext() {
        return  getTextRoot().getGlyphContext().getNextGlyphRotation();
    }

    public void draw(final Canvas canvas, final Paint paint, final float opacity) {
        setupGlyphContext();
        if (opacity > MIN_OPACITY_FOR_DRAW) {
            clip(canvas, paint);
            drawGroup(canvas, paint, opacity);
        }
    }

    void drawGroup(final Canvas canvas, final Paint paint, final float opacity) {
        pushGlyphContext();
        final SvgViewShadowNode svg = getSvgShadowNode();
        final GroupShadowNode self = this;
        traverseChildren(new NodeRunnable() {
            public boolean run(VirtualNode node) {
                if (node instanceof RenderableShadowNode) {
                    ((RenderableShadowNode)node).mergeProperties(self);
                }

                int count = node.saveAndSetupCanvas(canvas);
                node.draw(canvas, paint, opacity * mOpacity);
                node.restoreCanvas(canvas, count);

                if (node instanceof RenderableShadowNode) {
                    ((RenderableShadowNode)node).resetProperties();
                }

                node.markUpdateSeen();

                if (node.isResponsible()) {
                    svg.enableTouchEvents();
                }
                return true;
            }
        });
        popGlyphContext();
    }

    void drawPath(Canvas canvas, Paint paint, float opacity) {
        super.draw(canvas, paint, opacity);
    }

    @Override
    protected Path getPath(final Canvas canvas, final Paint paint) {
        final Path path = new Path();

        traverseChildren(new NodeRunnable() {
            public boolean run(VirtualNode node) {
                path.addPath(node.getPath(canvas, paint));
                return true;
            }
        });

        return path;
    }

    @Override
    public int hitTest(final Point point, final @Nullable Matrix matrix) {
        int hitSelf = super.hitTest(point, matrix);
        if (hitSelf != -1) {
            return hitSelf;
        }

        Matrix groupMatrix = new Matrix(mMatrix);

        if (matrix != null) {
            groupMatrix.postConcat(matrix);
        }

        Path clipPath = getClipPath();

        if (clipPath != null && !pathContainsPoint(clipPath, groupMatrix, point)) {
            return -1;
        }

        for (int i = getChildCount() - 1; i >= 0; i--) {
            ReactShadowNode child = getChildAt(i);
            if (!(child instanceof VirtualNode)) {
                continue;
            }

            VirtualNode node = (VirtualNode) child;

            int hitChild = node.hitTest(point, groupMatrix);
            if (hitChild != -1) {
                return (node.isResponsible() || hitChild != child.getReactTag()) ? hitChild : getReactTag();
            }
        }

        return -1;
    }

    protected void saveDefinition() {
        if (mName != null) {
            getSvgShadowNode().defineTemplate(this, mName);
        }

        traverseChildren(new NodeRunnable() {
            public boolean run(VirtualNode node) {
                node.saveDefinition();
                return true;
            }
        });
    }

    @Override
    public void resetProperties() {
        traverseChildren(new NodeRunnable() {
            public boolean run(VirtualNode node) {
                if (node instanceof RenderableShadowNode) {
                    ((RenderableShadowNode)node).resetProperties();
                }
                return true;
            }
        });
    }
}
