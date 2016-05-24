/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.graphics.Bitmap;
import android.util.Log;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

import java.util.ArrayList;

/**
 * ViewManager for RNSVGSvgView React views. Renders as a {@link RNSVGSvgView} and handles
 * invalidating the native view on shadow view updates happening in the underlying tree.
 */
public class RNSVGSvgViewManager extends ViewGroupManager<RNSVGSvgView> {

    private static final String REACT_CLASS = "RNSVGSvgView";

    // TODO: use an ArrayList to connect RNSVGSvgViewShadowNode with RNSVGSvgView, not sure if there will be a race condition.
    // TODO: find a better way to replace this
    private ArrayList<RNSVGSvgViewShadowNode> SvgShadowNodes = new ArrayList<>();

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public RNSVGSvgViewShadowNode createShadowNodeInstance() {
        RNSVGSvgViewShadowNode node = new RNSVGSvgViewShadowNode();
        SvgShadowNodes.add(node);
        return node;
    }

    @Override
    public Class<RNSVGSvgViewShadowNode> getShadowNodeClass() {
        return RNSVGSvgViewShadowNode.class;
    }

    @Override
    protected RNSVGSvgView createViewInstance(ThemedReactContext reactContext) {
        RNSVGSvgViewShadowNode shadowNode = SvgShadowNodes.get(0);
        SvgShadowNodes.remove(0);
        return new RNSVGSvgView(reactContext, shadowNode);
    }

    @Override
    public void updateExtraData(RNSVGSvgView root, Object extraData) {
        root.setBitmap((Bitmap) extraData);
    }
}
