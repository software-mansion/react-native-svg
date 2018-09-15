package com.horcrux.svg;

import android.view.ViewGroup;

import com.facebook.react.bridge.ReactContext;

public class RenderableView<T extends VirtualNode> extends ViewGroup {
    public T shadowNode;

    public RenderableView(ReactContext reactContext) {
        super(reactContext);
    }

    @Override
    public void setId(int id) {
        super.setId(id);
        shadowNode = (T) RenderableViewManager.getShadowNodeByTag(id);
    }

    void dropView() {
        shadowNode = null;
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {

    }
}
