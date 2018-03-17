package com.horcrux.svg;

import android.view.ViewGroup;

import com.facebook.react.bridge.ReactContext;

public class RenderableView extends ViewGroup {
    VirtualNode shadowNode;

    public RenderableView(ReactContext reactContext) {
        super(reactContext);
    }

    VirtualNode getShadowNode() {
        return shadowNode;
    }

    @Override
    public void setId(int id) {
        super.setId(id);
        shadowNode = RenderableViewManager.getShadowNodeByTag(id);
    }

    void dropView() {
        shadowNode = null;
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {

    }
}
