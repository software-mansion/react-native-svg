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
 * ViewManager for RNSVGSurfaceView React views. Renders as a {@link RNSVGSurfaceView} and handles
 * invalidating the native view on shadow view updates happening in the underlying tree.
 */
public class RNSVGSurfaceViewManager extends
    BaseViewManager<RNSVGSurfaceView, RNSVGSurfaceViewShadowNode> {

  private static final String REACT_CLASS = "RNSVGSurfaceView";

  private static final CSSNode.MeasureFunction MEASURE_FUNCTION = new CSSNode.MeasureFunction() {
    @Override
    public void measure(CSSNode node, float width, float height, MeasureOutput measureOutput) {
      throw new IllegalStateException("SurfaceView should have explicit width and height set");
    }
  };

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  public RNSVGSurfaceViewShadowNode createShadowNodeInstance() {
    RNSVGSurfaceViewShadowNode node = new RNSVGSurfaceViewShadowNode();
    node.setMeasureFunction(MEASURE_FUNCTION);
    return node;
  }

  @Override
  public Class<RNSVGSurfaceViewShadowNode> getShadowNodeClass() {
    return RNSVGSurfaceViewShadowNode.class;
  }

  @Override
  protected RNSVGSurfaceView createViewInstance(ThemedReactContext reactContext) {
    return new RNSVGSurfaceView(reactContext);
  }

  @Override
  public void updateExtraData(RNSVGSurfaceView root, Object extraData) {
    root.setBitmap((Bitmap) extraData);
  }
}
