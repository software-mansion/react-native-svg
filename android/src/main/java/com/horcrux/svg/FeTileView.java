package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import com.facebook.react.bridge.ReactContext;
import java.util.HashMap;

@SuppressLint("ViewConstructor")
class FeTileView extends FilterPrimitiveView {
  String mIn1;

  public FeTileView(ReactContext reactContext) {
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

  @Override
  public Bitmap applyFilter(HashMap<String, Bitmap> resultsMap, Bitmap prevResult) {
    // TODO: implement applyFilter function
  }
}
