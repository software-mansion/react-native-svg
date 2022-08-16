package com.horcrux.svg;

import android.content.Context;
import androidx.annotation.UiThread;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.FabricViewStateManager;
import com.facebook.react.uimanager.FabricViewStateManager.HasFabricViewStateManager;
import com.facebook.react.uimanager.FabricViewStateManager.StateUpdateCallback;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.views.view.ReactViewGroup;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

public abstract class FabricEnabledViewGroup extends ReactViewGroup
    implements HasFabricViewStateManager {
  private final FabricViewStateManager mFabricViewStateManager = new FabricViewStateManager();

  @NotNull
  public FabricViewStateManager getFabricViewStateManager() {
    return this.mFabricViewStateManager;
  }

  protected final void updateScreenSizeFabric(int width, int height) {
    this.updateState(width, height);
  }

  @UiThread
  public final void updateState(int width, int height) {
    final float realWidth = PixelUtil.toDIPFromPixel((float) width);
    final float realHeight = PixelUtil.toDIPFromPixel((float) height);
    ReadableMap currentState = this.mFabricViewStateManager.getStateData();
    if (currentState != null) {
      float delta = 0.9F;
      float stateFrameHeight =
          currentState.hasKey("frameHeight") ? (float) currentState.getDouble("frameHeight") : 0.0F;
      float stateFrameWidth =
          currentState.hasKey("frameWidth") ? (float) currentState.getDouble("frameWidth") : 0.0F;
      if (Math.abs(stateFrameWidth - realWidth) < delta
          && Math.abs(stateFrameHeight - realHeight) < delta) {
        return;
      }
    }

    this.mFabricViewStateManager.setState(
        (StateUpdateCallback)
            (new StateUpdateCallback() {
              public final WritableMap getStateUpdate() {
                WritableMap map = (WritableMap) (new WritableNativeMap());
                map.putDouble("frameWidth", (double) realWidth);
                map.putDouble("frameHeight", (double) realHeight);
                return map;
              }
            }));
  }

  public FabricEnabledViewGroup(@Nullable ReactContext context) {
    super((Context) context);
  }
}
