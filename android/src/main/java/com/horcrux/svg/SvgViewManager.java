/*
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.util.SparseArray;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;
import com.facebook.yoga.YogaMeasureFunction;
import com.facebook.yoga.YogaMeasureMode;
import com.facebook.yoga.YogaMeasureOutput;
import com.facebook.yoga.YogaNode;

import javax.annotation.Nullable;

/**
 * ViewManager for RNSVGSvgView React views. Renders as a {@link SvgView} and handles
 * invalidating the native view on shadow view updates happening in the underlying tree.
 */
class SvgViewManager extends ReactViewManager {

    private static final String REACT_CLASS = "RNSVGSvgView";

    private static final YogaMeasureFunction MEASURE_FUNCTION = new YogaMeasureFunction() {
        @Override
        public long measure(
                YogaNode node,
                float width,
                YogaMeasureMode widthMode,
                float height,
                YogaMeasureMode heightMode) {
            return YogaMeasureOutput.make(width, height);
        }
    };

    private static final SparseArray<SvgViewShadowNode> mTagToShadowNode = new SparseArray<>();
    private static final SparseArray<SvgView> mTagToSvgView = new SparseArray<>();

    static void setShadowNode(SvgViewShadowNode shadowNode) {
        mTagToShadowNode.put(shadowNode.getReactTag(), shadowNode);
    }

    static void setSvgView(SvgView svg) {
        mTagToSvgView.put(svg.getId(), svg);
    }

    @SuppressWarnings("unused")
    static @Nullable SvgView getSvgViewByTag(int tag) {
        return mTagToSvgView.get(tag);
    }

    static @Nullable SvgViewShadowNode getShadowNodeByTag(int tag) {
        return mTagToShadowNode.get(tag);
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public Class<SvgViewShadowNode> getShadowNodeClass() {
        return SvgViewShadowNode.class;
    }

    @Override
    public SvgViewShadowNode createShadowNodeInstance() {
        SvgViewShadowNode node = new SvgViewShadowNode();
        node.setMeasureFunction(MEASURE_FUNCTION);
        return node;
    }

    @Override
    public SvgView createViewInstance(ThemedReactContext reactContext) {
        return new SvgView(reactContext);
    }

    @Override
    public void updateExtraData(ReactViewGroup root, Object extraData) {
        super.updateExtraData(root, extraData);
        root.invalidate();
    }

    @Override
    public void onDropViewInstance(ReactViewGroup view) {
        super.onDropViewInstance(view);

        int tag = view.getId();
        mTagToShadowNode.remove(tag);
        mTagToSvgView.remove(tag);
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }
}
