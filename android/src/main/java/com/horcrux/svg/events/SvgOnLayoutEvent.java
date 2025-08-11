package com.horcrux.svg.events;

import androidx.core.util.Pools.SynchronizedPool;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.events.Event;

public class SvgOnLayoutEvent extends Event<SvgOnLayoutEvent> {

  public int x = 0;
  public int y = 0;
  public int width = 0;
  public int height = 0;

  private SvgOnLayoutEvent() {}

  @Override
  public void onDispose() {
    EVENTS_POOL.release(this);
  }

  protected void init(int surfaceId, int viewTag, int x, int y, int width, int height) {
    super.init(surfaceId, viewTag);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  @Override
  public String getEventName() {
    return "topLayout";
  }

  @Override
  public WritableMap getEventData() {
    WritableMap layout = Arguments.createMap();
    layout.putDouble("x", (double) PixelUtil.toDIPFromPixel((float) x));
    layout.putDouble("y", (double) PixelUtil.toDIPFromPixel((float) y));
    layout.putDouble("width", (double) PixelUtil.toDIPFromPixel((float) width));
    layout.putDouble("height", (double) PixelUtil.toDIPFromPixel((float) height));

    WritableMap event = Arguments.createMap();
    event.putMap("layout", layout);
    event.putInt("target", getViewTag());

    return event;
  }

  private static final SynchronizedPool<SvgOnLayoutEvent> EVENTS_POOL =
      new SynchronizedPool<SvgOnLayoutEvent>(20);

  public static SvgOnLayoutEvent obtain(int viewTag, int x, int y, int width, int height) {
    return obtain(-1, viewTag, x, y, width, height);
  }

  public static SvgOnLayoutEvent obtain(int surfaceId, int viewTag, int x, int y, int width, int height) {
    SvgOnLayoutEvent event = EVENTS_POOL.acquire();
    if (event == null) {
      event = new SvgOnLayoutEvent();
    }
    event.init(surfaceId, viewTag, x, y, width, height);
    return event;
  }
}
