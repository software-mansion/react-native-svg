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
class FeBlendView extends FilterPrimitiveView {
  String mIn1;
  String mIn2;
  FilterProperties.FeBlendMode mMode;

  public FeBlendView(ReactContext reactContext) {
    super(reactContext);
    super.mFilterSubregion.mX = new SVGLength(0);
    super.mFilterSubregion.mY = new SVGLength(0);
    super.mFilterSubregion.mW = new SVGLength("100%");
    super.mFilterSubregion.mH = new SVGLength("100%");
  }

  public void setIn1(String in1) {
    this.mIn1 = in1;
    invalidate();
  }

  public void setIn2(String in2) {
    this.mIn2 = in2;
    invalidate();
  }

  public void setMode(String mode) {
    this.mMode = FilterProperties.FeBlendMode.getEnum(mode);
    invalidate();
  }

  @Override
  public Bitmap applyFilter(HashMap<String, Bitmap> resultsMap, Bitmap prevResult) {
    Bitmap in1 = getSource(resultsMap, prevResult, this.mIn1);
    Bitmap in2 = getSource(resultsMap, prevResult, this.mIn2);

    if (this.mMode == FilterProperties.FeBlendMode.MULTIPLY) {
      CustomFilterFunction multiply =
          (src, dst) -> {
            float[] res = new float[4];
            res[0] = 1f - (1f - src[0]) * (1f - dst[0]);
            res[1] =
                src[1] * src[0] * (1f - dst[0])
                    + dst[1] * dst[0] * (1f - src[0])
                    + src[1] * src[0] * dst[1] * dst[0];
            res[2] =
                src[2] * src[0] * (1f - dst[0])
                    + dst[2] * dst[0] * (1f - src[0])
                    + src[2] * src[0] * dst[2] * dst[0];
            res[3] =
                src[3] * src[0] * (1f - dst[0])
                    + dst[3] * dst[0] * (1f - src[0])
                    + src[3] * src[0] * dst[3] * dst[0];
            return res;
          };
      return CustomFilter.apply(in1, in2, multiply);
    }

    Bitmap result = Bitmap.createBitmap(in1.getWidth(), in1.getHeight(), Bitmap.Config.ARGB_8888);
    Canvas canvas = new Canvas(result);
    Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
    canvas.drawBitmap(in1, 0, 0, paint);

    switch (this.mMode) {
      case UNKNOWN:
      case NORMAL:
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.DST_OVER));
        break;
      case SCREEN:
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SCREEN));
        break;
      case LIGHTEN:
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.LIGHTEN));
        break;
      case DARKEN:
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.DARKEN));
        break;
      case MULTIPLY:
        break;
    }
    canvas.drawBitmap(in2, 0, 0, paint);

    return result;
  }
}
