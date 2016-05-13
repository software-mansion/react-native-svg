/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.util.Log;

import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Shadow node for virtual RNSVGGroup view
 */
public class RNSVGGroupShadowNode extends RNSVGVirtualNode {

    private String mAsClipPath = null;

    @ReactProp(name = "asClipPath")
    public void setAsClipPath(String asClipPath) {
        mAsClipPath = asClipPath;
        markUpdated();
    }


    @Override
    public boolean isVirtual() {
        return true;
    }

    public void draw(Canvas canvas, Paint paint, float opacity) {
        opacity *= mOpacity;
        if (opacity > MIN_OPACITY_FOR_DRAW) {
            saveAndSetupCanvas(canvas);
            clip(canvas, paint);
            if (mAsClipPath == null) {
                for (int i = 0; i < getChildCount(); i++) {
                    RNSVGVirtualNode child = (RNSVGVirtualNode) getChildAt(i);
                    child.draw(canvas, paint, opacity);
                    child.markUpdateSeen();
                }
            } else {
                defineClipPath(getPath(canvas, paint), mAsClipPath);
            }
            restoreCanvas(canvas);
        }
    }

    @Override
    protected Path getPath(Canvas canvas, Paint paint) {
        Path path = new Path();
        for (int i = 0; i < getChildCount(); i++) {
            RNSVGVirtualNode child = (RNSVGVirtualNode) getChildAt(i);
            path.addPath(child.getPath(canvas, paint));
        }
        return path;
    }
}
