package com.horcrux.svg.events;

import androidx.core.util.Pools.SynchronizedPool;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.events.Event;

public class SvgOnLayoutEvent extends Event<SvgOnLayoutEvent> {

  public static final String EVENT_NAME = "topSvgLayout";
  public int x = 0;
  public int y = 0;
  public int width = 0;
  public int height = 0;

  public SvgOnLayoutEvent(int surfaceId, int viewId, int x, int y, int width, int height) {
    super(surfaceId, viewId);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  @Override
  public String getEventName() {
    return EVENT_NAME;
  }

  @Override
  public short getCoalescingKey() {
    return 0;
  }

  @Override
  protected WritableMap getEventData() {
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
}
