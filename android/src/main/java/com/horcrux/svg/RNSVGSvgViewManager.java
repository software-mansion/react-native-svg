/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.horcrux.svg;

import android.graphics.Bitmap;

import com.facebook.csslayout.CSSNode;
import com.facebook.csslayout.MeasureOutput;
import com.facebook.react.uimanager.BaseViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

/**
 * ViewManager for RNSVGSvgView React views. Renders as a {@link RNSVGSvgView} and handles
 * invalidating the native view on shadow view updates happening in the underlying tree.
 */
public class RNSVGSvgViewManager extends
    BaseViewManager<RNSVGSvgView, RNSVGSvgViewShadowNode> {

    private static final String REACT_CLASS = "RNSVGSvgView";

    private static final CSSNode.MeasureFunction MEASURE_FUNCTION = new CSSNode.MeasureFunction() {
        @Override
        public void measure(CSSNode node, float width, float height, MeasureOutput measureOutput) {
            throw new IllegalStateException("SvgView should have explicit width and height set");
        }
    };

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public RNSVGSvgViewShadowNode createShadowNodeInstance() {
        RNSVGSvgViewShadowNode node = new RNSVGSvgViewShadowNode();
        node.setMeasureFunction(MEASURE_FUNCTION);
        return node;
    }

    @Override
    public Class<RNSVGSvgViewShadowNode> getShadowNodeClass() {
        return RNSVGSvgViewShadowNode.class;
    }

    @Override
    protected RNSVGSvgView createViewInstance(ThemedReactContext reactContext) {
        return new RNSVGSvgView(reactContext);
    }

    @Override
    public void updateExtraData(RNSVGSvgView root, Object extraData) {
        root.setBitmap((Bitmap) extraData);
    }
}
