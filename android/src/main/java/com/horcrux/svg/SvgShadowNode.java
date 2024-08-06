/*
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.horcrux.svg;

import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.text.ReactBaseTextShadowNode;
import com.facebook.yoga.YogaMeasureFunction;
import com.facebook.yoga.YogaMeasureMode;
import com.facebook.yoga.YogaMeasureOutput;
import com.facebook.yoga.YogaNode;

public class SvgShadowNode extends ReactBaseTextShadowNode implements YogaMeasureFunction {
  private float mVbWidth = 0;
  private float mVbHeight = 0;

  public SvgShadowNode() {
    setMeasureFunction(this);
  }

  @ReactProp(name = "vbWidth")
  public void setVbWidth(float vbWidth) {
    mVbWidth = vbWidth;
  }

  @ReactProp(name = "vbHeight")
  public void setVbHeight(float vbHeight) {
    mVbHeight = vbHeight;
  }

  @Override
  public long measure(
      YogaNode node,
      float baseWidth,
      YogaMeasureMode widthMode,
      float baseHeight,
      YogaMeasureMode heightMode) {

    float width = baseWidth;
    float height = baseHeight;
    float maxWidth = widthMode == YogaMeasureMode.AT_MOST ? width : Float.MAX_VALUE;
    float maxHeight = heightMode == YogaMeasureMode.AT_MOST ? height : Float.MAX_VALUE;

    if (mVbWidth != 0 && mVbHeight != 0) {
      if (widthMode != YogaMeasureMode.EXACTLY) {
        width = Math.min(mVbWidth / mVbHeight * height, maxWidth);
      }
      if (heightMode != YogaMeasureMode.EXACTLY) {
        height = Math.min(mVbHeight / mVbWidth * width, maxHeight);
      }
    }

    return YogaMeasureOutput.make(width, height);
  }
}
