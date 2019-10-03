/*
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.UiThreadUtil;

import javax.annotation.Nonnull;

class RNSVGRenderableManager extends ReactContextBaseJavaModule {
    RNSVGRenderableManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Nonnull
    @Override
    public String getName() {
        return "RNSVGRenderableManager";
    }

    private static void isPointInFill(final int tag, final float[] src, final Callback successCallback, final int attempt) {
        UiThreadUtil.runOnUiThread(
                new Runnable() {
                    @Override
                    public void run() {
                        RenderableView svg = RenderableViewManager.getRenderableViewByTag(tag);

                        if (svg == null) {
                            if (attempt < 1) {
                                RenderableViewManager.runWhenViewIsAvailable(tag, new Runnable() {
                                    @Override
                                    public void run() {
                                        RenderableView svg = RenderableViewManager.getRenderableViewByTag(tag);
                                        if (svg == null) { // Should never happen
                                            successCallback.invoke(false);
                                            return;
                                        }
                                        isPointInFill(tag, src, successCallback, attempt + 1);
                                    }
                                });
                            } else {
                                successCallback.invoke(false);
                            }
                            return;
                        } else {
                            float scale = svg.mScale;
                            src[0] *= scale;
                            src[1] *= scale;
                            int i = svg.hitTest(src);
                            successCallback.invoke(i != -1);
                        }
                    }
                }
        );
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void isPointInFill(int tag, ReadableMap options, Callback successCallback) {
        float x = (float)options.getDouble("x");
        float y = (float)options.getDouble("y");
        float[] src = new float[] { x, y };
        isPointInFill(tag, src, successCallback, 0);
    }
}
