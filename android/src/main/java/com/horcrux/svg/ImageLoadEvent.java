package com.horcrux.svg;

import androidx.annotation.IntDef;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

public class ImageLoadEvent extends Event<ImageLoadEvent> {

  public static final int ON_LOAD = 2;

  @IntDef({ON_LOAD})
  @Retention(RetentionPolicy.SOURCE)
  public @interface ImageEventType {}

  private final @ImageEventType int eventType;
  private final String errorMessage;
  private final String sourceUri;
  private final int width;
  private final int height;
  private final int loaded;
  private final int total;

  private ImageLoadEvent(
      int surfaceId,
      int viewId,
      @ImageEventType int eventType,
      String errorMessage,
      String sourceUri,
      int width,
      int height,
      int loaded,
      int total) {
    super(surfaceId, viewId);
    this.eventType = eventType;
    this.errorMessage = errorMessage;
    this.sourceUri = sourceUri;
    this.width = width;
    this.height = height;
    this.loaded = loaded;
    this.total = total;
  }

  @Override
  public String getEventName() {
    return eventNameForType(eventType);
  }

  @Override
  public short getCoalescingKey() {
    return (short) eventType;
  }

  @Override
  public void dispatch(RCTEventEmitter rctEventEmitter) {
    rctEventEmitter.receiveEvent(getViewTag(), getEventName(), getEventData());
  }

  protected WritableMap getEventData() {
    WritableMap eventData = Arguments.createMap();
    switch (eventType) {
      case ON_LOAD:
        eventData.putMap("source", createEventDataSource());
        break;
    }
    return eventData;
  }

  private WritableMap createEventDataSource() {
    WritableMap source = Arguments.createMap();
    source.putString("uri", sourceUri);
    source.putDouble("width", width);
    source.putDouble("height", height);
    return source;
  }

  public static ImageLoadEvent createLoadEvent(
      int surfaceId, int viewId, String imageUri, int width, int height) {
    return new ImageLoadEvent(surfaceId, viewId, ON_LOAD, null, imageUri, width, height, 0, 0);
  }

  public static String eventNameForType(@ImageEventType int eventType) {
    switch (eventType) {
      case ON_LOAD:
        return "topLoad";
      default:
        throw new IllegalArgumentException("Invalid image event: " + eventType);
    }
  }
}
