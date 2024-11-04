package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.RectF;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReactContext;
import java.util.HashMap;

@SuppressLint("ViewConstructor")
class FeOffsetView extends FilterPrimitiveView {
  String mIn1;
  SVGLength mDx;
  SVGLength mDy;

  public FeOffsetView(ReactContext reactContext) {
    super(reactContext);
  }

  public void setIn1(String in1) {
    this.mIn1 = in1;
    invalidate();
  }

  public void setDx(Dynamic dx) {
    mDx = SVGLength.from(dx);
    invalidate();
  }

  public void setDy(Dynamic dy) {
    mDy = SVGLength.from(dy);
    invalidate();
  }

  @Override
  public Bitmap applyFilter(HashMap<String, Bitmap> resultsMap, Bitmap prevResult) {
    Bitmap source = getSource(resultsMap, prevResult, this.mIn1);
    Bitmap result =
        Bitmap.createBitmap(prevResult.getWidth(), prevResult.getHeight(), Bitmap.Config.ARGB_8888);
    Canvas canvas = new Canvas(result);

    float dx = this.mDx != null ? (float) this.relativeOnWidth(this.mDx) : 0;
    float dy = this.mDy != null ? (float) this.relativeOnHeight(this.mDy) : 0;
    RectF frame = new RectF(0, 0, dx, dy);
    this.getSvgView().getCtm().mapRect(frame);
    dx = frame.left < 0 ? frame.left : frame.width();
    dy = frame.top < 0 ? frame.top : frame.height();

    canvas.drawBitmap(source, dx, dy, null);

    return result;
  }
}
