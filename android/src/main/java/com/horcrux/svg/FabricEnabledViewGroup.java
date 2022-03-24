package com.horcrux.svg;

import android.content.Context;

import com.facebook.react.views.view.ReactViewGroup;

public abstract class FabricEnabledViewGroup extends ReactViewGroup {
  public FabricEnabledViewGroup(Context context) {
    super(context);
  }

  protected void updateScreenSizeFabric(int width, int height) {
    // do nothing
  }
}
