package com.horcrux.svg;

import androidx.annotation.Nullable;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.BaseViewManagerDelegate;
import com.facebook.react.uimanager.ViewManagerDelegate;

public class MissingPropsDelegate<
        T extends VirtualView,
        U extends MissingPropsInterface<T>,
        V extends BaseViewManagerDelegate<T, U>>
    implements ViewManagerDelegate<T> {
  public MissingPropsDelegate(VirtualViewManager viewManager, V concreteDelegate) {
    mConcreteViewManager = viewManager;
    mConcreteDelegate = concreteDelegate;
  }

  private final VirtualViewManager mConcreteViewManager;
  private final V mConcreteDelegate;

  public void setProperty(T view, String propName, @Nullable Object value) {
    switch (propName) {
      case "pointerEvents":
        mConcreteViewManager.setPointerEvents(view, value == null ? null : (String) value);
        break;
      default:
        mConcreteDelegate.setProperty(view, propName, value);
    }
  }

  @Override
  public void receiveCommand(T view, String commandName, ReadableArray args) {}
}
