/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

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
    /* package */ static final String CLASS_IMAGE = "RNSVGImage";
    /* package */ static final String CLASS_CIRCLE = "RNSVGCircle";
    /* package */ static final String CLASS_ELLIPSE = "RNSVGEllipse";
    /* package */ static final String CLASS_LINE = "RNSVGLine";
    /* package */ static final String CLASS_RECT = "RNSVGRect";

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

    public static RNSVGRenderableViewManager createRNSVGImageViewManager() {
        return new RNSVGRenderableViewManager(CLASS_IMAGE);
    }

    public static RNSVGRenderableViewManager createRNSVGCircleViewManager() {
        return new RNSVGRenderableViewManager(CLASS_CIRCLE);
    }

    public static RNSVGRenderableViewManager createRNSVGEllipseViewManager() {
        return new RNSVGRenderableViewManager(CLASS_ELLIPSE);
    }

    public static RNSVGRenderableViewManager createRNSVGLineViewManager() {
        return new RNSVGRenderableViewManager(CLASS_LINE);
    }

    public static RNSVGRenderableViewManager createRNSVGRectViewManager() {
        return new RNSVGRenderableViewManager(CLASS_RECT);
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
        } else if (mClassName == CLASS_CIRCLE) {
            return new RNSVGCircleShadowNode();
        } else if (mClassName == CLASS_ELLIPSE) {
            return new RNSVGEllipseShadowNode();
        } else if (mClassName == CLASS_LINE) {
            return new RNSVGLineShadowNode();
        } else if (mClassName == CLASS_RECT) {
            return new RNSVGRectShadowNode();
        } else if (mClassName == CLASS_TEXT) {
            return new RNSVGTextShadowNode();
        } else if (mClassName == CLASS_IMAGE) {
            return new RNSVGImageShadowNode();
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
        } else if (mClassName == CLASS_CIRCLE) {
            return RNSVGCircleShadowNode.class;
        } else if (mClassName == CLASS_ELLIPSE) {
            return RNSVGEllipseShadowNode.class;
        } else if (mClassName == CLASS_LINE) {
            return RNSVGLineShadowNode.class;
        } else if (mClassName == CLASS_RECT) {
            return RNSVGRectShadowNode.class;
        } else if (mClassName == CLASS_TEXT) {
            return RNSVGTextShadowNode.class;
        } else if (mClassName == CLASS_IMAGE) {
            return RNSVGImageShadowNode.class;
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
