package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.Color;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReactContext;
import java.util.ArrayList;
import java.util.HashMap;

@SuppressLint("ViewConstructor")
class FeMorphologyView extends FilterPrimitiveView {
  String mIn1;
  FilterProperties.FeMorphologyOperator mOperator;
  ArrayList<SVGLength> mRadius;

  public FeMorphologyView(ReactContext reactContext) {
    super(reactContext);
  }

  public void setIn1(String in1) {
    this.mIn1 = in1;
    invalidate();
  }

  public void setOperator1(String operator1) {
    this.mOperator = FilterProperties.FeMorphologyOperator.getEnum(operator1);
    invalidate();
  }

  public void setRadius(Dynamic radius) {
    this.mRadius = SVGLength.arrayFrom(radius);
    invalidate();
  }

  @Override
  public Bitmap applyFilter(HashMap<String, Bitmap> resultsMap, Bitmap prevResult) {
    Bitmap source = getSource(resultsMap, prevResult, this.mIn1);
    int width = source.getWidth();
    int height = source.getHeight();
    Bitmap result =
        Bitmap.createBitmap(prevResult.getWidth(), prevResult.getHeight(), Bitmap.Config.ARGB_8888);

    int[] srcPixels = new int[width * height];
    source.getPixels(srcPixels, 0, width, 0, 0, width, height);
    int[] dstPixels = this.applyMorphology(srcPixels, width, height);

    result.setPixels(dstPixels, 0, width, 0, 0, width, height);
    return result;
  }

  private int[] applyMorphology(int[] srcPixels, int width, int height) {
    int[] dstPixels = new int[width * height];
    int[] tmpPixels = new int[width * height];
    boolean isErode = this.mOperator == FilterProperties.FeMorphologyOperator.ERODE;
    int radiusX = this.getRadiusX();
    int radiusY = this.getRadiusY();

    if (radiusX == 0 && radiusY == 0) {
      return srcPixels;
    }

    horizontalPass(srcPixels, tmpPixels, width, height, radiusX, isErode);
    verticalPass(tmpPixels, dstPixels, width, height, radiusY, isErode);

    return dstPixels;
  }

  private int getRadiusX() {
    if (this.mRadius != null && !this.mRadius.isEmpty()) {
      return (int) Math.max(0, this.mRadius.get(0).value);
    }

    return 0;
  }

  private int getRadiusY() {
    if (this.mRadius != null) {
      if (this.mRadius.size() == 1) {
        return this.getRadiusX();
      }

      if (this.mRadius.size() == 2) {
        return (int) Math.max(0, this.mRadius.get(1).value);
      }
    }

    return 0;
  }

  private void horizontalPass(
      int[] src, int[] dst, int width, int height, int radiusX, boolean isErode) {
    for (int y = 0; y < height; y++) {
      for (int x = 0; x < width; x++) {
        PixelRange range = new PixelRange();

        int startX = Math.max(0, x - radiusX);
        int endX = Math.min(width - 1, x + radiusX);

        for (int nx = startX; nx <= endX; nx++) {
          int c = src[y * width + nx];
          range.include(c);
        }

        dst[y * width + x] = isErode ? range.minColor() : range.maxColor();
      }
    }
  }

  private void verticalPass(
      int[] src, int[] dst, int width, int height, int radiusY, boolean isErode) {
    for (int y = 0; y < height; y++) {
      int startY = Math.max(0, y - radiusY);
      int endY = Math.min(height - 1, y + radiusY);

      for (int x = 0; x < width; x++) {
        PixelRange range = new PixelRange();

        for (int ny = startY; ny <= endY; ny++) {
          int c = src[ny * width + x];
          range.include(c);
        }

        dst[y * width + x] = isErode ? range.minColor() : range.maxColor();
      }
    }
  }

  /** Helper to track min and max RGBA values while scanning neighbors. */
  private static class PixelRange {
    int minR = 255, minG = 255, minB = 255, minA = 255;
    int maxR = 0, maxG = 0, maxB = 0, maxA = 0;

    void include(int color) {
      int A = Color.alpha(color);
      int R = Color.red(color);
      int G = Color.green(color);
      int B = Color.blue(color);

      if (R < minR) minR = R;
      if (G < minG) minG = G;
      if (B < minB) minB = B;
      if (A < minA) minA = A;

      if (R > maxR) maxR = R;
      if (G > maxG) maxG = G;
      if (B > maxB) maxB = B;
      if (A > maxA) maxA = A;
    }

    int minColor() {
      return Color.argb(minA, minR, minG, minB);
    }

    int maxColor() {
      return Color.argb(maxA, maxR, maxG, maxB);
    }
  }
}
