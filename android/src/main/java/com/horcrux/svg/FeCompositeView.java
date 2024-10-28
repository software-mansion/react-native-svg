package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import com.facebook.react.bridge.ReactContext;
import java.util.HashMap;

@SuppressLint("ViewConstructor")
class FeCompositeView extends FilterPrimitiveView {
  String mIn1;
  String mIn2;
  float mK1;
  float mK2;
  float mK3;
  float mK4;
  FilterProperties.FeCompositeOperator mOperator;

  public FeCompositeView(ReactContext reactContext) {
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

  public void setK1(Float value) {
    this.mK1 = value;
    invalidate();
  }

  public void setK2(Float value) {
    this.mK2 = value;
    invalidate();
  }

  public void setK3(Float value) {
    this.mK3 = value;
    invalidate();
  }

  public void setK4(Float value) {
    this.mK4 = value;
    invalidate();
  }

  public void setOperator(String operator) {
    this.mOperator = FilterProperties.FeCompositeOperator.getEnum(operator);
    invalidate();
  }

  @Override
  public Bitmap applyFilter(HashMap<String, Bitmap> resultsMap, Bitmap prevResult) {
    Bitmap in1 = getSource(resultsMap, prevResult, this.mIn1);
    Bitmap in2 = getSource(resultsMap, prevResult, this.mIn2);
    Bitmap result = Bitmap.createBitmap(in1.getWidth(), in1.getHeight(), Bitmap.Config.ARGB_8888);
    Canvas canvas = new Canvas(result);
    Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
    canvas.drawBitmap(in1, 0, 0, paint);

    switch (this.mOperator) {
      case OVER -> {
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.DST_OVER));
      }
      case IN -> {
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.DST_IN));
      }
      case OUT -> {
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.DST_OUT));
      }
      case ATOP -> {
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.DST_ATOP));
      }
      case XOR -> {
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.XOR));
      }
      case ARITHMETIC -> {
        // result = k1*i1*i2 + k2*i1 + k3*i2 + k4
        int nPixels = result.getWidth() * result.getHeight();
        int[] pixels1 = new int[nPixels];
        int[] pixels2 = new int[nPixels];
        result.getPixels(
            pixels1, 0, result.getWidth(), 0, 0, result.getWidth(), result.getHeight());
        in2.getPixels(pixels2, 0, result.getWidth(), 0, 0, result.getWidth(), result.getHeight());

        for (int i = 0; i < nPixels; i++) {
          int color1 = pixels1[i];
          int color2 = pixels2[i];

          int r1 = (color1 >> 16) & 0xFF;
          int g1 = (color1 >> 8) & 0xFF;
          int b1 = color1 & 0xFF;
          int a1 = (color1 >>> 24);
          int r2 = (color2 >> 16) & 0xFF;
          int g2 = (color2 >> 8) & 0xFF;
          int b2 = color2 & 0xFF;
          int a2 = (color2 >>> 24);

          int rResult = (int) (mK1 * r1 * r2 + mK2 * r1 + mK3 * r2 + mK4);
          int gResult = (int) (mK1 * g1 * g2 + mK2 * g1 + mK3 * g2 + mK4);
          int bResult = (int) (mK1 * b1 * b2 + mK2 * b1 + mK3 * b2 + mK4);
          int aResult = (int) (mK1 * a1 * a2 + mK2 * a1 + mK3 * a2 + mK4);

          rResult = Math.min(255, Math.max(0, rResult));
          gResult = Math.min(255, Math.max(0, gResult));
          bResult = Math.min(255, Math.max(0, bResult));
          aResult = Math.min(255, Math.max(0, aResult));

          int pixel = (aResult << 24) | (rResult << 16) | (gResult << 8) | bResult;
          pixels1[i] = pixel;
        }

        result.setPixels(
            pixels1, 0, result.getWidth(), 0, 0, result.getWidth(), result.getHeight());
      }
    }

    if (this.mOperator != FilterProperties.FeCompositeOperator.ARITHMETIC) {
      canvas.drawBitmap(in2, 0, 0, paint);
    }

    return result;
  }
}
