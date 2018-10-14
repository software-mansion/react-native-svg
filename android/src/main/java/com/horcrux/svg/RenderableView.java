package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.view.ViewGroup;

import com.facebook.react.bridge.ReactContext;

@SuppressLint("ViewConstructor")
public class RenderableView<T extends VirtualNode> extends ViewGroup {
    public RenderableViewManager<T> vm;
    public T shadowNode;

    public RenderableView(ReactContext reactContext) {
        super(reactContext);
    }

    @Override
    public void setId(int id) {
        super.setId(id);
        shadowNode = vm.getShadowNodeByTag(id);
    }

    void dropView() {
        shadowNode = null;
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {

    }
}
