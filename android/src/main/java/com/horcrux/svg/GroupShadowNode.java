/*
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.Region;
import android.os.Build;

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

    void setupGlyphContext(Canvas canvas) {
        RectF clipBounds = new RectF(canvas.getClipBounds());
        mMatrix.mapRect(clipBounds);
        mTransform.mapRect(clipBounds);
        mGlyphContext = new GlyphContext(mScale, clipBounds.width(), clipBounds.height());
    }

    GlyphContext getGlyphContext() {
        return mGlyphContext;
    }

    @SuppressWarnings("ConstantConditions")
    GlyphContext getTextRootGlyphContext() {
        return getTextRoot().getGlyphContext();
    }

    void pushGlyphContext() {
        getTextRootGlyphContext().pushContext(this, mFont);
    }

    void popGlyphContext() {
        getTextRootGlyphContext().popContext();
    }

    public void draw(final Canvas canvas, final Paint paint, final float opacity) {
        setupGlyphContext(canvas);
        if (opacity > MIN_OPACITY_FOR_DRAW) {
            clip(canvas, paint);
            drawGroup(canvas, paint, opacity);
        }
    }

    void drawGroup(final Canvas canvas, final Paint paint, final float opacity) {
        pushGlyphContext();
        final SvgViewShadowNode svg = getSvgShadowNode();
        final GroupShadowNode self = this;
        final RectF groupRect = new RectF();
        traverseChildren(new NodeRunnable() {
            public void run(ReactShadowNode lNode) {
                if (lNode instanceof VirtualNode) {
                    VirtualNode node = ((VirtualNode)lNode);
                    if (node instanceof RenderableShadowNode) {
                        ((RenderableShadowNode)node).mergeProperties(self);
                    }

                    int count = node.saveAndSetupCanvas(canvas);
                    node.render(canvas, paint, opacity * mOpacity);
                    RectF r = node.getClientRect();
                    if (r != null) {
                        groupRect.union(r);
                    }

                    node.restoreCanvas(canvas, count);

                    if (node instanceof RenderableShadowNode) {
                        ((RenderableShadowNode)node).resetProperties();
                    }

                    node.markUpdateSeen();

                    if (node.isResponsible()) {
                        svg.enableTouchEvents();
                    }
                } else if (lNode instanceof SvgViewShadowNode) {
                    SvgViewShadowNode svgView = (SvgViewShadowNode)lNode;
                    svgView.drawChildren(canvas);
                } else {
                    lNode.calculateLayout();
                }
            }
        });
        this.setClientRect(groupRect);
        popGlyphContext();
    }

    void drawPath(Canvas canvas, Paint paint, float opacity) {
        super.draw(canvas, paint, opacity);
    }

    @Override
    protected Path getPath(final Canvas canvas, final Paint paint) {
        final Path path = new Path();

        traverseChildren(new NodeRunnable() {
            public void run(ReactShadowNode node) {
                if (node instanceof VirtualNode) {
                    VirtualNode n = (VirtualNode)node;
                    Matrix transform = n.mMatrix;
                    path.addPath(n.getPath(canvas, paint), transform);
                }
            }
        });

        return path;
    }

    protected Path getPath(final Canvas canvas, final Paint paint, final Region.Op op) {
        final Path path = new Path();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            final Path.Op pop = Path.Op.valueOf(op.name());
            traverseChildren(new NodeRunnable() {
                @SuppressLint("NewApi")
                public void run(ReactShadowNode node) {
                    if (node instanceof VirtualNode) {
                        VirtualNode n = (VirtualNode)node;
                        Matrix transform = n.mMatrix;
                        Path p2;
                        if (n instanceof GroupShadowNode) {
                            p2 = ((GroupShadowNode)n).getPath(canvas, paint, op);
                        } else {
                            p2 = n.getPath(canvas, paint);
                        }
                        p2.transform(transform);
                        path.op(p2, pop);
                    }
                }
            });
        } else {
            Rect clipBounds = canvas.getClipBounds();
            final Region bounds = new Region(clipBounds);
            final Region r = new Region();
            traverseChildren(new NodeRunnable() {
                public void run(ReactShadowNode node) {
                    if (node instanceof VirtualNode) {
                        VirtualNode n = (VirtualNode)node;
                        Matrix transform = n.mMatrix;
                        Path p2;
                        if (n instanceof GroupShadowNode) {
                            p2 = ((GroupShadowNode)n).getPath(canvas, paint, op);
                        } else {
                            p2 = n.getPath(canvas, paint);
                        }
                        p2.transform(transform);
                        Region r2 = new Region();
                        r2.setPath(p2, bounds);
                        r.op(r2, op);
                    }
                }
            });
            path.addPath(r.getBoundaryPath());
        }

        return path;
    }

    @Override
    public int hitTest(final float[] src) {
        if (!mInvertible) {
            return -1;
        }

        float[] dst = new float[2];
        mInvMatrix.mapPoints(dst, src);

        int x = Math.round(dst[0]);
        int y = Math.round(dst[1]);

        Path clipPath = getClipPath();
        if (clipPath != null) {
            if (mClipRegionPath != clipPath) {
                mClipRegionPath = clipPath;
                mClipRegion = getRegion(clipPath);
            }
            if (!mClipRegion.contains(x, y)) {
                return -1;
            }
        }

        for (int i = getChildCount() - 1; i >= 0; i--) {
            ReactShadowNode child = getChildAt(i);
            if (!(child instanceof VirtualNode)) {
                continue;
            }

            VirtualNode node = (VirtualNode) child;

            int hitChild = node.hitTest(dst);
            if (hitChild != -1) {
                return (node.isResponsible() || hitChild != child.getReactTag()) ? hitChild : getReactTag();
            }
        }

        return -1;
    }

    void saveDefinition() {
        if (mName != null) {
            getSvgShadowNode().defineTemplate(this, mName);
        }

        traverseChildren(new NodeRunnable() {
            public void run(ReactShadowNode node) {
                if (node instanceof VirtualNode) {
                    ((VirtualNode)node).saveDefinition();
                }
            }
        });
    }

    @Override
    public void resetProperties() {
        traverseChildren(new NodeRunnable() {
            public void run(ReactShadowNode node) {
                if (node instanceof RenderableShadowNode) {
                    ((RenderableShadowNode)node).resetProperties();
                }
            }
        });
    }
}
