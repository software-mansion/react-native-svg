package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.ColorMatrix;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import java.util.HashMap;

@SuppressLint("ViewConstructor")
class FeColorMatrixView extends FilterPrimitiveView {
  String mIn1;
  FilterProperties.FeColorMatrixType mType;
  ReadableArray mValues;

  public FeColorMatrixView(ReactContext reactContext) {
    super(reactContext);
  }

  public void setIn1(String in1) {
    this.mIn1 = in1;
    invalidate();
  }

  public void setType(String type) {
    this.mType = FilterProperties.FeColorMatrixType.getEnum(type);
    invalidate();
  }

  public void setValues(ReadableArray values) {
    this.mValues = values;
    invalidate();
  }

  @Override
  public Bitmap applyFilter(HashMap<String, Bitmap> resultsMap, Bitmap prevResult) {
    Bitmap source = getSource(resultsMap, prevResult, this.mIn1);

    ColorMatrix colorMatrix = new ColorMatrix();
    switch (this.mType) {
      case MATRIX:
        if (this.mValues.size() < 20) return source;

        float[] rawMatrix = new float[mValues.size()];

        for (int i = 0; i < this.mValues.size(); i++) {
          rawMatrix[i] = (float) this.mValues.getDouble(i) * (i % 5 == 4 ? 255 : 1);
        }

        colorMatrix.set(rawMatrix);
        break;
      case SATURATE:
        if (this.mValues.size() != 1) return source;

        colorMatrix.setSaturation((float) this.mValues.getDouble(0));
        break;
      case HUE_ROTATE:
        if (this.mValues.size() != 1) return source;

        float hue = (float) this.mValues.getDouble(0);
        float cosHue = (float) Math.cos(hue * Math.PI / 180);
        float sinHue = (float) Math.sin(hue * Math.PI / 180);

        colorMatrix.set(
            new float[] {
              0.213f + cosHue * 0.787f - sinHue * 0.213f, // 0
              0.715f - cosHue * 0.715f - sinHue * 0.715f, // 1
              0.072f - cosHue * 0.072f + sinHue * 0.928f, // 2
              0, // 3
              0, // 4
              0.213f - cosHue * 0.213f + sinHue * 0.143f, // 5
              0.715f + cosHue * 0.285f + sinHue * 0.140f, // 6
              0.072f - cosHue * 0.072f - sinHue * 0.283f, // 7
              0, // 8
              0, // 9
              0.213f - cosHue * 0.213f - sinHue * 0.787f, // 10
              0.715f - cosHue * 0.715f + sinHue * 0.715f, // 11
              0.072f + cosHue * 0.928f + sinHue * 0.072f, // 12
              0, // 13
              0, // 14
              0, // 15
              0, // 16
              0, // 17
              1, // 18
              0, // 19
            });
        break;
      case LUMINANCE_TO_ALPHA:
        colorMatrix.set(
            new float[] {
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2125f, 0.7154f, 0.0721f, 0, 0,
            });
        break;
    }

    return FilterUtils.getBitmapWithColorMatrix(colorMatrix, source);
  }
}
