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

  public SvgLoadEvent(int viewId, float width, float height, String uri) {
    super(viewId);
    this.width = width;
    this.height = height;
    this.uri = uri;
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
