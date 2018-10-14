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
import android.graphics.Paint;
import android.view.View;

import com.facebook.react.bridge.ReactContext;

/**
 * Shadow node for virtual Defs view
 */
@SuppressLint("ViewConstructor")
class DefsView extends DefinitionView {

    public DefsView(ReactContext reactContext) {
        super(reactContext);
    }

    @Override
    void draw(Canvas canvas, Paint paint, float opacity) {
        NodeRunnable markUpdateSeenRecursive = new NodeRunnable() {
            public void run(View node) {
                if (node instanceof VirtualView) {
                    ((VirtualView) node).traverseChildren(this);
                } else if (node instanceof SvgView) {
                    ((SvgView) node).traverseChildren(this);
                }
            }
        };
        traverseChildren(markUpdateSeenRecursive);
    }

    void saveDefinition() {
        traverseChildren(new NodeRunnable() {
            public void run(View node) {
                if (node instanceof VirtualView) {
                    ((VirtualView)node).saveDefinition();
                }
            }
        });
    }
}
