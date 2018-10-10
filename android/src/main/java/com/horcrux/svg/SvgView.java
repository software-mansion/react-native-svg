/*
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Point;
import android.view.View;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.ReactCompoundView;
import com.facebook.react.uimanager.ReactCompoundViewGroup;
import com.facebook.react.uimanager.ReactShadowNodeImpl;
import com.facebook.react.views.view.ReactViewGroup;

import javax.annotation.Nullable;

/**
 * Custom {@link View} implementation that draws an RNSVGSvg React view and its children.
 */
@SuppressLint("ViewConstructor")
public class SvgView extends ReactViewGroup implements ReactCompoundView, ReactCompoundViewGroup {

    @Override
    public boolean interceptsTouchEvent(float touchX, float touchY) {
        return true;
    }

    @SuppressWarnings("unused")
    public enum Events {
        @SuppressWarnings("unused")
        EVENT_DATA_URL("onDataURL");

        private final String mName;

        @SuppressWarnings({"unused", "SameParameterValue"})
        Events(final String name) {
            mName = name;
        }

        @Override
        public String toString() {
            return mName;
        }
    }

    private @Nullable Bitmap mBitmap;

    public SvgView(ReactContext reactContext) {
        super(reactContext);
    }

    @Override
    public void setId(int id) {
        super.setId(id);
        SvgViewManager.setSvgView(this);
    }

    @Override
    public void invalidate() {
        super.invalidate();
        if (mBitmap != null) {
            mBitmap.recycle();
        }
        mBitmap = null;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        if (mBitmap == null) {
            SvgViewShadowNode node = getShadowNode();
            if (node == null) {
                return;
            }
            mBitmap = node.drawOutput();
        }
        canvas.drawBitmap(mBitmap, 0, 0, null);
    }

    private SvgViewShadowNode getShadowNode() {
        return SvgViewManager.getShadowNodeByTag(getId());
    }

    @Override
    public int reactTagForTouch(float touchX, float touchY) {
        SvgViewShadowNode node = getShadowNode();
        if (node != null) {
            return node.hitTest(new Point((int) touchX, (int) touchY));
        }
        return getId();
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
        ReactShadowNodeImpl node = getShadowNode();
        for (int i = 0; i < this.getChildCount(); i++) {
            View child = this.getChildAt(i);
            if (child instanceof ReactViewGroup) {
                int id = child.getId();
                for (int j = 0; j < node.getChildCount(); j++) {
                    ReactShadowNodeImpl nodeChild = node.getChildAt(j);
                    if (nodeChild.getReactTag() != id) {
                        continue;
                    }

                    float x = nodeChild.getLayoutX();
                    float y = nodeChild.getLayoutY();
                    float nr = x + nodeChild.getLayoutWidth();
                    float nb = y + nodeChild.getLayoutHeight();

                    child.layout(Math.round(x), Math.round(y), Math.round(nr), Math.round(nb));
                    break;
                }
            } else {
                child.layout(l, t, r , b);
            }
        }
    }
}
