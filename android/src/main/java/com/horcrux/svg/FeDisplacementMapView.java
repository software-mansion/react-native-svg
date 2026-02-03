package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.Color;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReactContext;
import java.util.HashMap;

@SuppressLint("ViewConstructor")
class FeDisplacementMapView extends FilterPrimitiveView {
  String mIn1;
  String mIn2;
  SVGLength mScale1;
  FilterProperties.FeDisplacementMapChannelSelector mXChannelSelector;
  FilterProperties.FeDisplacementMapChannelSelector mYChannelSelector;

  public FeDisplacementMapView(ReactContext reactContext) {
    super(reactContext);
  }

  public void setIn1(String in1) {
    this.mIn1 = in1;
    invalidate();
  }

  public void setIn2(String in2) {
    this.mIn2 = in2;
    invalidate();
  }

  public void setScale(Dynamic scale) {
    this.mScale1 = SVGLength.from(scale);
    invalidate();
  }

  public void setXChannelSelector(String channelSelector) {
    this.mXChannelSelector =
        FilterProperties.FeDisplacementMapChannelSelector.getEnum(channelSelector);
    invalidate();
  }

  public void setYChannelSelector(String channelSelector) {
    this.mYChannelSelector =
        FilterProperties.FeDisplacementMapChannelSelector.getEnum(channelSelector);
    invalidate();
  }

  @Override
  public Bitmap applyFilter(HashMap<String, Bitmap> resultsMap, Bitmap prevResult) {
    Bitmap in1 = getSource(resultsMap, prevResult, this.mIn1);
    Bitmap in2 = getSource(resultsMap, prevResult, this.mIn2);

    int width = in1.getWidth();
    int height = in1.getHeight();
    Bitmap result = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);

    float scale = (float) mScale1.value * mScale;

    int[] pixels1 = new int[width * height];
    int[] pixels2 = new int[width * height];
    in1.getPixels(pixels1, 0, width, 0, 0, width, height);
    in2.getPixels(pixels2, 0, width, 0, 0, width, height);

    int[] outPixels = new int[width * height];

    for (int y = 0; y < height; y++) {
      for (int x = 0; x < width; x++) {
        int idx = y * width + x;

        int c2 = pixels2[idx];
        float xChannelVal = getChannelValue(c2, mXChannelSelector);
        float yChannelVal = getChannelValue(c2, mYChannelSelector);

        // normalize to [0,1]
        xChannelVal /= 255f;
        yChannelVal /= 255f;

        float dx = scale * (xChannelVal - 0.5f);
        float dy = scale * (yChannelVal - 0.5f);

        float srcX = x + dx;
        float srcY = y + dy;

        int color = sampleBilinear(pixels1, width, height, srcX, srcY);
        outPixels[idx] = color;
      }
    }

    result.setPixels(outPixels, 0, width, 0, 0, width, height);
    return result;
  }

  private int getChannelValue(
      int color, FilterProperties.FeDisplacementMapChannelSelector selector) {
    return switch (selector) {
      case R -> Color.red(color);
      case G -> Color.green(color);
      case B -> Color.blue(color);
      case A -> Color.alpha(color);
    };
  }

  private int sampleBilinear(int[] pixels, int width, int height, float fx, float fy) {
    if (fx < 0.0f) fx = 0.0f;
    if (fy < 0.0f) fy = 0.0f;
    if (fx > (float) (width - 1)) fx = (float) (width - 1);
    if (fy > (float) (height - 1)) fy = (float) (height - 1);

    int x0 = (int) Math.floor(fx);
    int y0 = (int) Math.floor(fy);
    int x1 = x0 + 1;
    int y1 = y0 + 1;

    float wx = fx - x0;
    float wy = fy - y0;

    if (x0 < 0 || y0 < 0 || x1 >= width || y1 >= height) {
      return 0;
    }

    int c00 = pixels[y0 * width + x0];
    int c10 = pixels[y0 * width + x1];
    int c01 = pixels[y1 * width + x0];
    int c11 = pixels[y1 * width + x1];

    return bilerp(c00, c10, c01, c11, wx, wy);
  }

  private int bilerp(int c00, int c10, int c01, int c11, float wx, float wy) {
    float[] c0 = lerpColor(c00, c10, wx);
    float[] c1 = lerpColor(c01, c11, wx);
    float[] c = new float[4];

    for (int i = 0; i < 4; i++) {
      c[i] = c0[i] * (1 - wy) + c1[i] * wy;
    }

    return ((int) c[3] << 24) | ((int) c[0] << 16) | ((int) c[1] << 8) | (int) c[2];
  }

  private float[] lerpColor(int c0, int c1, float t) {
    float a0 = Color.alpha(c0);
    float r0 = Color.red(c0);
    float g0 = Color.green(c0);
    float b0 = Color.blue(c0);

    float a1 = Color.alpha(c1);
    float r1 = Color.red(c1);
    float g1 = Color.green(c1);
    float b1 = Color.blue(c1);

    return new float[] {
      r0 + (r1 - r0) * t, g0 + (g1 - g0) * t, b0 + (b1 - b0) * t, a0 + (a1 - a0) * t
    };
  }
}
