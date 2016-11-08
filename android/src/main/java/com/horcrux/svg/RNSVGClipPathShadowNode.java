/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

/**
 * Shadow node for virtual RNSVGClipPath view
 */
public class RNSVGClipPathShadowNode extends RNSVGGroupShadowNode {

    @Override
    protected void saveDefinition() {
        getSvgShadowNode().defineClipPath(this, mName);
    }
}
