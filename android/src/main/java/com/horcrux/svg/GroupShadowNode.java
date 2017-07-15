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
import android.graphics.Point;
import android.graphics.PointF;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ReactShadowNode;
import com.facebook.react.uimanager.annotations.ReactProp;


import javax.annotation.Nullable;

/**
 * Shadow node for virtual Group view
 */
public class GroupShadowNode extends RenderableShadowNode {
    protected @Nullable ReadableMap mFont;

    private GlyphContext mGlyphContext;
    private GroupShadowNode mTextRoot;

    @ReactProp(name = "font")
    public void setFont(@Nullable ReadableMap font) {
        mFont = font;
        markUpdated();
    }

    protected GroupShadowNode getTextRoot() {
        GroupShadowNode shadowNode = getShadowNode(GroupShadowNode.class);
        if (shadowNode == null) {
            return getShadowNode(TextShadowNode.class);
        }
        return shadowNode;
    }

    @android.support.annotation.Nullable
    private GroupShadowNode getShadowNode(Class shadowNodeClass) {
        if (mTextRoot == null) {
            mTextRoot = this;

            while (mTextRoot != null) {
                if (mTextRoot.getClass() == shadowNodeClass) {
                    break;
                }

                ReactShadowNode parent = mTextRoot.getParent();

                if (!(parent instanceof GroupShadowNode)) {
                    //todo: throw exception here
                    mTextRoot = null;
                } else {
                    mTextRoot = (GroupShadowNode)parent;
                }
            }
        }

        return mTextRoot;
    }

    protected void setupGlyphContext() {
        mGlyphContext = new GlyphContext(mScale, getCanvasWidth(), getCanvasHeight());
    }

    protected GlyphContext getGlyphContext() {
        if (mGlyphContext == null) {
            setupGlyphContext();
        }
        return mGlyphContext;
    }

    protected void pushGlyphContext() {
        getTextRoot().getGlyphContext().pushContext(mFont);
    }

    protected void popGlyphContext() {
        getTextRoot().getGlyphContext().popContext();
    }

    protected ReadableMap getFontFromContext() {
        return  getTextRoot().getGlyphContext().getGlyphFont();
    }

    protected PointF getGlyphPointFromContext(float offset, float glyphWidth) {
        return  getTextRoot().getGlyphContext().getNextGlyphPoint(offset, glyphWidth);
    }

    protected PointF getGlyphDeltaFromContext() {
        return  getTextRoot().getGlyphContext().getNextGlyphDelta();
    }

    protected float getNextGlyphRotationFromContext() {
        return  getTextRoot().getGlyphContext().getNextGlyphRotation();
    }

    public void draw(final Canvas canvas, final Paint paint, final float opacity) {
        setupGlyphContext();
        if (opacity > MIN_OPACITY_FOR_DRAW) {
            clip(canvas, paint);
            drawGroup(canvas, paint, opacity);
        }
    }

    protected void drawGroup(final Canvas canvas, final Paint paint, final float opacity) {
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

    protected void drawPath(Canvas canvas, Paint paint, float opacity) {
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
