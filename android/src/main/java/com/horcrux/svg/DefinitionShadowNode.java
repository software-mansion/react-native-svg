/*
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

/**
 * Shadow node for virtual Definition type views
 */
class DefinitionShadowNode extends VirtualNode {

    void draw(Canvas canvas, Paint paint, float opacity) {}

    @Override
    boolean isResponsible() {
        return false;
    }

    @Override
    Path getPath(Canvas canvas, Paint paint) {
        return null;
    }

    @Override
    int hitTest(float[] src) {
        return -1;
    }
}
