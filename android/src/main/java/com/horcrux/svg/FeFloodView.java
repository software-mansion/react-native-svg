package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import com.facebook.react.bridge.ColorPropConverter;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.JavaOnlyArray;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.annotation.Nullable;

@SuppressLint("ViewConstructor")
class FeFloodView extends FilterPrimitiveView {
  private static final Pattern regex = Pattern.compile("[0-9.-]+");

  public @Nullable ReadableArray floodColor;
  public float floodOpacity = 1;

  public FeFloodView(ReactContext reactContext) {
    super(reactContext);
  }

  public void setFloodColor(@Nullable Dynamic color) {
    if (color == null || color.isNull()) {
      floodColor = null;
      invalidate();
      return;
    }

    ReadableType strokeType = color.getType();
    if (strokeType.equals(ReadableType.Map)) {
      ReadableMap colorMap = color.asMap();
      setFloodColor(colorMap);
      return;
    }

    // This code will probably never be reached with current changes
    ReadableType type = color.getType();
    if (type.equals(ReadableType.Number)) {
      floodColor = JavaOnlyArray.of(0, color.asInt());
    } else if (type.equals(ReadableType.Array)) {
      floodColor = color.asArray();
    } else {
      JavaOnlyArray arr = new JavaOnlyArray();
      arr.pushInt(0);
      Matcher m = regex.matcher(color.asString());
      int i = 0;
      while (m.find()) {
        double parsed = Double.parseDouble(m.group());
        arr.pushDouble(i++ < 3 ? parsed / 255 : parsed);
      }
      floodColor = arr;
    }
    invalidate();
  }

  public void setFloodColor(@Nullable ReadableMap color) {
    if (color == null) {
      this.floodColor = null;
      invalidate();
      return;
    }
    int type = color.getInt("type");
    if (type == 0) {
      ReadableType payloadType = color.getType("payload");
      if (payloadType.equals(ReadableType.Number)) {
        this.floodColor = JavaOnlyArray.of(0, color.getInt("payload"));
      } else if (payloadType.equals(ReadableType.Map)) {
        this.floodColor = JavaOnlyArray.of(0, color.getMap("payload"));
      }
    } else if (type == 1) {
      this.floodColor = JavaOnlyArray.of(1, color.getString("brushRef"));
    } else {
      this.floodColor = JavaOnlyArray.of(type);
    }
    invalidate();
  }

  public void setFloodOpacity(float opacity) {
    this.floodOpacity = opacity;
    invalidate();
  }

  @Override
  public Bitmap applyFilter(HashMap<String, Bitmap> resultsMap, Bitmap prevResult) {
    Bitmap floodBitmap =
        Bitmap.createBitmap(prevResult.getWidth(), prevResult.getHeight(), Bitmap.Config.ARGB_8888);
    Canvas floodCanvas = new Canvas(floodBitmap);
    Paint paint = new Paint();
    paint.setFlags(Paint.ANTI_ALIAS_FLAG | Paint.SUBPIXEL_TEXT_FLAG);
    paint.setStyle(Paint.Style.FILL);
    this.setupPaint(paint, this.floodOpacity, this.floodColor);
    floodCanvas.drawPaint(paint);
    return floodBitmap;
  }

  private void setupPaint(Paint paint, float opacity, @Nullable ReadableArray colors) {
    int colorType = colors.getInt(0);
    switch (colorType) {
      case 0:
        if (colors.size() == 2) {
          int color;
          if (colors.getType(1) == ReadableType.Map) {
            color = ColorPropConverter.getColor(colors.getMap(1), getContext());
          } else {
            color = colors.getInt(1);
          }
          int alpha = color >>> 24;
          int combined = Math.round((float) alpha * opacity);
          paint.setColor(combined << 24 | (color & 0x00ffffff));
        } else {
          // solid color
          paint.setARGB(
              (int) (colors.size() > 4 ? colors.getDouble(4) * opacity * 255 : opacity * 255),
              (int) (colors.getDouble(1) * 255),
              (int) (colors.getDouble(2) * 255),
              (int) (colors.getDouble(3) * 255));
        }
        break;
        // TODO: handle currentColor
    }
  }
}
