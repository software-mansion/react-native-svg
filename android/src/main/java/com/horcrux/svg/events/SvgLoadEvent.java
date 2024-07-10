package com.horcrux.svg.events;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.imagehelper.ImageSource;

public class SvgLoadEvent extends Event<SvgLoadEvent> {

  public static final String EVENT_NAME = "topLoad";
  private final float width;
  private final float height;
  private final String uri;

  public SvgLoadEvent(int surfaceId, int viewId, ReactContext mContext, String uriString, float width, float height) {
    super(surfaceId, viewId);
    ImageSource imageSource = new ImageSource(mContext, uriString);
    this.uri = imageSource.getSource();;
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

    WritableMap event = Arguments.createMap();
    event.putMap("source", eventData);
    return event;
  }
}
