/*
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.view.View;
import com.facebook.react.bridge.ReactContext;

@SuppressLint("ViewConstructor")
class DefsView extends GroupView {

  public DefsView(ReactContext reactContext) {
    super(reactContext);
  }

  void saveDefinition() {
    for (int i = 0; i < getChildCount(); i++) {
      View child = getChildAt(i);
      if (child instanceof VirtualView) {
        ((VirtualView) child).saveDefinition();
      }
    }
  }
}
