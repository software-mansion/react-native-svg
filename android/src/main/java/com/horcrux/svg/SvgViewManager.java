/*
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.horcrux.svg;

import android.util.SparseArray;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.uimanager.PointerEvents;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.ViewProps;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.RNSVGSvgViewAndroidManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGSvgViewAndroidManagerInterface;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Locale;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * ViewManager for RNSVGSvgView React views. Renders as a {@link SvgView} and handles invalidating
 * the native view on view updates happening in the underlying tree.
 */
class SvgViewManager extends ViewGroupManager<SvgView>
    implements RNSVGSvgViewAndroidManagerInterface<SvgView> {

  public static final String REACT_CLASS = "RNSVGSvgViewAndroid";

  private static final SparseArray<SvgView> mTagToSvgView = new SparseArray<>();
  private static final SparseArray<Runnable> mTagToRunnable = new SparseArray<>();

  private final ViewManagerDelegate<SvgView> mDelegate;

  protected ViewManagerDelegate<SvgView> getDelegate() {
    return mDelegate;
  }

  public SvgViewManager() {
    mDelegate = new RNSVGSvgViewAndroidManagerDelegate<>(this);
  }

  static void setSvgView(int tag, SvgView svg) {
    mTagToSvgView.put(tag, svg);
    Runnable task = mTagToRunnable.get(tag);
    if (task != null) {
      task.run();
      mTagToRunnable.delete(tag);
    }
  }

  static void runWhenViewIsAvailable(int tag, Runnable task) {
    mTagToRunnable.put(tag, task);
  }

  static @Nullable SvgView getSvgViewByTag(int tag) {
    return mTagToSvgView.get(tag);
  }

  @Nonnull
  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Nonnull
  @Override
  public SvgView createViewInstance(ThemedReactContext reactContext) {
    return new SvgView(reactContext);
  }

  @Override
  public void updateExtraData(SvgView root, Object extraData) {
    super.updateExtraData(root, extraData);
    root.invalidate();
  }

  @Override
  public void onDropViewInstance(@Nonnull SvgView view) {
    super.onDropViewInstance(view);
    mTagToSvgView.remove(view.getId());
  }

  @Override
  public boolean needsCustomLayoutForChildren() {
    return true;
  }

  @ReactProp(name = "tintColor", customType = "Color")
  @Override
  public void setTintColor(SvgView node, Integer tintColor) {
    node.setTintColor(tintColor);
  }

  @ReactProp(name = "color", customType = "Color")
  @Override
  public void setColor(SvgView node, Integer color) {
    node.setTintColor(color);
  }

  @ReactProp(name = "minX")
  @Override
  public void setMinX(SvgView node, float minX) {
    node.setMinX(minX);
  }

  @ReactProp(name = "minY")
  @Override
  public void setMinY(SvgView node, float minY) {
    node.setMinY(minY);
  }

  @ReactProp(name = "vbWidth")
  @Override
  public void setVbWidth(SvgView node, float vbWidth) {
    node.setVbWidth(vbWidth);
  }

  @ReactProp(name = "vbHeight")
  @Override
  public void setVbHeight(SvgView node, float vbHeight) {
    node.setVbHeight(vbHeight);
  }

  @ReactProp(name = "bbWidth")
  public void setBbWidth(SvgView node, Dynamic bbWidth) {
    node.setBbWidth(bbWidth);
  }

  @ReactProp(name = "bbHeight")
  public void setBbHeight(SvgView node, Dynamic bbHeight) {
    node.setBbHeight(bbHeight);
  }

  @ReactProp(name = "align")
  @Override
  public void setAlign(SvgView node, String align) {
    node.setAlign(align);
  }

  @ReactProp(name = "meetOrSlice")
  @Override
  public void setMeetOrSlice(SvgView node, int meetOrSlice) {
    node.setMeetOrSlice(meetOrSlice);
  }

  @ReactProp(name = ViewProps.POINTER_EVENTS)
  public void setPointerEvents(SvgView view, @Nullable String pointerEventsStr) {
    try {
      Class<?> superclass = view.getClass().getSuperclass();
      if (superclass != null) {
        Method method = superclass.getDeclaredMethod("setPointerEvents", PointerEvents.class);
        method.setAccessible(true);
        method.invoke(
            view, PointerEvents.valueOf(pointerEventsStr.toUpperCase(Locale.US).replace("-", "_")));
      }
    } catch (IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
      e.printStackTrace();
    }
  }
}
