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

import com.facebook.react.uimanager.ReactShadowNode;


import javax.annotation.Nullable;

/**
 * Shadow node for virtual RNSVGGroup view
 */
public class GroupShadowNode extends RenderableShadowNode {

    public void draw(final Canvas canvas, final Paint paint, final float opacity) {
        if (opacity > MIN_OPACITY_FOR_DRAW) {
            clip(canvas, paint);
            drawGroup(canvas, paint, opacity);
        }
    }

    protected void drawGroup(final Canvas canvas, final Paint paint, final float opacity) {
        final SvgViewShadowNode svg = getSvgShadowNode();
        final VirtualNode self = this;
        traverseChildren(new NodeRunnable() {
            public boolean run(VirtualNode node) {
                node.mergeProperties(self, mAttributeList, true);
                int count = node.saveAndSetupCanvas(canvas);
                node.draw(canvas, paint, opacity * mOpacity);
                node.restoreCanvas(canvas, count);
                node.markUpdateSeen();

                if (node.isResponsible()) {
                    svg.enableTouchEvents();
                }
                return true;
            }
        });
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
                node.resetProperties();
                return true;
            }
        });
    }
}
