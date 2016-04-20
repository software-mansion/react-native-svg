/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.horcrux.svg;

import android.content.Context;
import android.view.View;

//import com.facebook.react.uimanager.ReactStylesDiffMap;
import com.facebook.react.uimanager.ReactShadowNode;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewManager;

/**
 * ViewManager for all shadowed RNSVG views: Group, Path and Text. Since these never get rendered
 * into native views and don't need any logic (all the logic is in {@link RNSVGSvgView}), this
 * "stubbed" ViewManager is used for all of them.
 */
public class RNSVGRenderableViewManager extends ViewManager<View, ReactShadowNode> {

    /* package */ static final String CLASS_GROUP = "RNSVGGroup";
    /* package */ static final String CLASS_SVG = "RNSVGPath";
    /* package */ static final String CLASS_TEXT = "RNSVGText";

    private final String mClassName;

    public static RNSVGRenderableViewManager createRNSVGGroupViewManager() {
        return new RNSVGRenderableViewManager(CLASS_GROUP);
    }

    public static RNSVGRenderableViewManager createRNSVGPathViewManager() {
        return new RNSVGRenderableViewManager(CLASS_SVG);
    }

    public static RNSVGRenderableViewManager createRNSVGTextViewManager() {
        return new RNSVGRenderableViewManager(CLASS_TEXT);
    }

    private RNSVGRenderableViewManager(String className) {
        mClassName = className;
    }

    @Override
    public String getName() {
        return mClassName;
    }

    @Override
    public ReactShadowNode createShadowNodeInstance() {
        if (mClassName == CLASS_GROUP) {
            return new RNSVGGroupShadowNode();
        } else if (mClassName == CLASS_SVG) {
            return new RNSVGPathShadowNode();
        } else if (mClassName == CLASS_TEXT) {
            return new RNSVGTextShadowNode();
        } else {
            throw new IllegalStateException("Unexpected type " + mClassName);
        }
    }

    @Override
    public Class<? extends ReactShadowNode> getShadowNodeClass() {
        if (mClassName == CLASS_GROUP) {
            return RNSVGGroupShadowNode.class;
        } else if (mClassName == CLASS_SVG) {
            return RNSVGPathShadowNode.class;
        } else if (mClassName == CLASS_TEXT) {
            return RNSVGTextShadowNode.class;
        } else {
            throw new IllegalStateException("Unexpected type " + mClassName);
        }
    }

    @Override
    protected View createViewInstance(ThemedReactContext reactContext) {
        throw new IllegalStateException("RNSVGPath does not map into a native view");
    }

    @Override
    public void updateExtraData(View root, Object extraData) {
        throw new IllegalStateException("RNSVGPath does not map into a native view");
    }
}
