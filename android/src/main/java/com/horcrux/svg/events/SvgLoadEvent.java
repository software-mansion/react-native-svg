package com.horcrux.svg.events;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class SvgLoadEvent extends Event<SvgLoadEvent> {

  public static final String EVENT_NAME = "topLoad";
  private final float width;
  private final float height;
  private final String uri;

  public SvgLoadEvent(int surfaceId, int viewId, String uri, float width, float height) {
    super(surfaceId, viewId);
    this.uri = uri;
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
  public void dispatch(RCTEventEmitter rctEventEmitter) {
    rctEventEmitter.receiveEvent(getViewTag(), getEventName(), getEventData());
  }

  protected WritableMap getEventData() {
    WritableMap eventData = Arguments.createMap();
    eventData.putDouble("width", width);
    eventData.putDouble("height", height);
    eventData.putString("uri", uri);
    return eventData;
  }
}
