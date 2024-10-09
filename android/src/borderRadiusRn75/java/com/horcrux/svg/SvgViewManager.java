/*
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.horcrux.svg;

import android.graphics.Rect;
import android.util.SparseArray;
import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.PointerEvents;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.ViewProps;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.RNSVGSvgViewAndroidManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGSvgViewAndroidManagerInterface;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Locale;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * ViewManager for RNSVGSvgView React views. Renders as a {@link SvgView} and handles invalidating
 * the native view on view updates happening in the underlying tree.
 */
class SvgViewManager extends ReactViewManager
    implements RNSVGSvgViewAndroidManagerInterface<SvgView> {

  public static final String REACT_CLASS = "RNSVGSvgViewAndroid";

  private static final SparseArray<SvgView> mTagToSvgView = new SparseArray<>();
  private static final SparseArray<Runnable> mTagToRunnable = new SparseArray<>();

  private final ViewManagerDelegate<SvgView> mDelegate;

  protected ViewManagerDelegate getDelegate() {
    return mDelegate;
  }

  public SvgViewManager() {
    mDelegate = new RNSVGSvgViewAndroidManagerDelegate(this);
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
  public ReactViewGroup createViewInstance(ThemedReactContext reactContext) {
    return new SvgView(reactContext);
  }

  @Override
  public void updateExtraData(ReactViewGroup root, Object extraData) {
    super.updateExtraData(root, extraData);
    root.invalidate();
  }

  @Override
  public void onDropViewInstance(@Nonnull ReactViewGroup view) {
    super.onDropViewInstance(view);
    mTagToSvgView.remove(view.getId());
  }

  @Override
  public boolean needsCustomLayoutForChildren() {
    return true;
  }

  @ReactProp(name = "color", customType = "Color")
  @Override
  public void setColor(SvgView node, Integer color) {
    node.setCurrentColor(color);
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

  @Override
  public void setHasTVPreferredFocus(SvgView view, boolean value) {
    super.setTVPreferredFocus(view, value);
  }

  @Override
  public void setBorderBottomColor(SvgView view, @Nullable Integer value) {
    super.setBorderColor(view, 4, value);
  }

  @Override
  public void setNextFocusDown(SvgView view, int value) {
    super.nextFocusDown(view, value);
  }

  @Override
  public void setBorderRightColor(SvgView view, @Nullable Integer value) {
    super.setBorderColor(view, 2, value);
  }

  @Override
  public void setNextFocusRight(SvgView view, int value) {
    super.nextFocusRight(view, value);
  }

  @Override
  public void setBorderLeftColor(SvgView view, @Nullable Integer value) {
    super.setBorderColor(view, 1, value);
  }

  @Override
  public void setBorderColor(SvgView view, @Nullable Integer value) {
    super.setBorderColor(view, 0, value);
  }

  @Override
  public void setRemoveClippedSubviews(SvgView view, boolean value) {
    super.setRemoveClippedSubviews(view, value);
  }

  @Override
  public void setNextFocusForward(SvgView view, int value) {
    super.nextFocusForward(view, value);
  }

  @Override
  public void setNextFocusUp(SvgView view, int value) {
    super.nextFocusUp(view, value);
  }

  @Override
  public void setAccessible(SvgView view, boolean value) {
    super.setAccessible(view, value);
  }

  @Override
  public void setBorderStartColor(SvgView view, @Nullable Integer value) {
    super.setBorderColor(view, 5, value);
  }

  @Override
  public void setBorderEndColor(SvgView view, @Nullable Integer value) {
    super.setBorderColor(view, 6, value);
  }

  @Override
  public void setFocusable(SvgView view, boolean value) {
    super.setFocusable(view, value);
  }

  @Override
  public void setNativeBackgroundAndroid(SvgView view, @Nullable ReadableMap value) {
    super.setNativeBackground(view, value);
  }

  @Override
  public void setNativeForegroundAndroid(SvgView view, @Nullable ReadableMap value) {
    super.setNativeForeground(view, value);
  }

  @Override
  public void setBackfaceVisibility(SvgView view, @Nullable String value) {
    super.setBackfaceVisibility(view, value);
  }

  @Override
  public void setBorderStyle(SvgView view, @Nullable String value) {
    super.setBorderStyle(view, value);
  }

  @Override
  public void setNeedsOffscreenAlphaCompositing(SvgView view, boolean value) {
    super.setNeedsOffscreenAlphaCompositing(view, value);
  }

  @Override
  public void setHitSlop(SvgView view, Dynamic hitSlop) {
    // we don't call super here since its signature changed in RN 0.69 and we want backwards
    // compatibility
    switch (hitSlop.getType()) {
      case Map:
        ReadableMap hitSlopMap = hitSlop.asMap();
        view.setHitSlopRect(
            new Rect(
                hitSlopMap.hasKey("left")
                    ? (int) PixelUtil.toPixelFromDIP(hitSlopMap.getDouble("left"))
                    : 0,
                hitSlopMap.hasKey("top")
                    ? (int) PixelUtil.toPixelFromDIP(hitSlopMap.getDouble("top"))
                    : 0,
                hitSlopMap.hasKey("right")
                    ? (int) PixelUtil.toPixelFromDIP(hitSlopMap.getDouble("right"))
                    : 0,
                hitSlopMap.hasKey("bottom")
                    ? (int) PixelUtil.toPixelFromDIP(hitSlopMap.getDouble("bottom"))
                    : 0));
        break;
      case Number:
        int hitSlopValue = (int) PixelUtil.toPixelFromDIP(hitSlop.asDouble());
        view.setHitSlopRect(new Rect(hitSlopValue, hitSlopValue, hitSlopValue, hitSlopValue));
        break;
      default:
        FLog.w(ReactConstants.TAG, "Invalid type for 'hitSlop' value " + hitSlop.getType());
        /* falls through */
      case Null:
        view.setHitSlopRect(null);
        break;
    }
  }

  @Override
  public void setBorderTopColor(SvgView view, @Nullable Integer value) {
    super.setBorderColor(view, 3, value);
  }

  @Override
  public void setNextFocusLeft(SvgView view, int value) {
    super.nextFocusLeft(view, value);
  }

  @Override
  public void setBorderBlockColor(SvgView view, @Nullable Integer value) {
    super.setBorderColor(view, 9, value);
  }

  @Override
  public void setBorderBlockEndColor(SvgView view, @Nullable Integer value) {
    super.setBorderColor(view, 10, value);
  }

  @Override
  public void setBorderBlockStartColor(SvgView view, @Nullable Integer value) {
    super.setBorderColor(view, 11, value);
  }

  @Override
  public void setBorderRadius(SvgView view, Dynamic rawBorderRadius) {
    super.setBorderRadius(view, 0, rawBorderRadius);
  }

  @Override
  public void setBorderTopLeftRadius(SvgView view, Dynamic rawBorderRadius) {
    super.setBorderRadius(view, 1, rawBorderRadius);
  }

  @Override
  public void setBorderTopRightRadius(SvgView view, Dynamic rawBorderRadius) {
    super.setBorderRadius(view, 2, rawBorderRadius);
  }

  @Override
  public void setBorderBottomRightRadius(SvgView view, Dynamic rawBorderRadius) {
    super.setBorderRadius(view, 3, rawBorderRadius);
  }

  @Override
  public void setBorderBottomLeftRadius(SvgView view, Dynamic rawBorderRadius) {
    super.setBorderRadius(view, 4, rawBorderRadius);
  }

  @Override
  public void setBorderTopStartRadius(SvgView view, Dynamic rawBorderRadius) {
    super.setBorderRadius(view, 5, rawBorderRadius);
  }

  @Override
  public void setBorderTopEndRadius(SvgView view, Dynamic rawBorderRadius) {
    super.setBorderRadius(view, 6, rawBorderRadius);
  }

  @Override
  public void setBorderBottomStartRadius(SvgView view, Dynamic rawBorderRadius) {
    super.setBorderRadius(view, 7, rawBorderRadius);
  }

  @Override
  public void setBorderBottomEndRadius(SvgView view, Dynamic rawBorderRadius) {
    super.setBorderRadius(view, 8, rawBorderRadius);
  }

  @Override
  public void setBorderEndEndRadius(SvgView view, Dynamic rawBorderRadius) {
    super.setBorderRadius(view, 9, rawBorderRadius);
  }

  @Override
  public void setBorderEndStartRadius(SvgView view, Dynamic rawBorderRadius) {
    super.setBorderRadius(view, 10, rawBorderRadius);
  }

  @Override
  public void setBorderStartEndRadius(SvgView view, Dynamic rawBorderRadius) {
    super.setBorderRadius(view, 11, rawBorderRadius);
  }

  @Override
  public void setBorderStartStartRadius(SvgView view, Dynamic rawBorderRadius) {
    super.setBorderRadius(view, 12, rawBorderRadius);
  }
}
