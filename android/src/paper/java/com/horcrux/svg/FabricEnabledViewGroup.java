package com.horcrux.svg;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.views.view.ReactViewGroup;
import org.jetbrains.annotations.Nullable;

public abstract class FabricEnabledViewGroup extends ReactViewGroup {

  public FabricEnabledViewGroup(@Nullable ReactContext context) {
    super(context);
  }

  protected final void updateScreenSizeFabric(int width, int height) {
    // do nothing
  }
}
