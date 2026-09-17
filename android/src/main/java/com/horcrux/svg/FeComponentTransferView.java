package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.view.View;

import com.facebook.react.bridge.ReactContext;

import java.util.HashMap;

@SuppressLint("ViewConstructor")
class FeComponentTransferView extends FilterPrimitiveView {
  String mIn1;
  FeComponentTransferFunctionView mFeFuncR;
  FeComponentTransferFunctionView mFeFuncG;
  FeComponentTransferFunctionView mFeFuncB;
  FeComponentTransferFunctionView mFeFuncA;

  public FeComponentTransferView(ReactContext reactContext) {
    super(reactContext);
  }

  public void setIn1(String in1) {
    this.mIn1 = in1;
    invalidate();
  }

  @Override
  public Bitmap applyFilter(HashMap<String, Bitmap> resultsMap, Bitmap prevResult) {
    Bitmap source = getSource(resultsMap, prevResult, this.mIn1);
    if (source == null) return prevResult;
    assignFeComponentTransferFunctionViews();

    Bitmap result = source.copy(Bitmap.Config.ARGB_8888, true);
    int w = result.getWidth();
    int h = result.getHeight();
    int[] pixels = new int[w * h];
    result.getPixels(pixels, 0, w, 0, 0, w, h);

    applyComponentTransferOnPixels(pixels);

    result.setPixels(pixels, 0, w, 0, 0, w, h);
    return result;
  }

  private void assignFeComponentTransferFunctionViews() {
    for (int i = 0; i < getChildCount(); i++) {
      View node = getChildAt(i);
      if (!(node instanceof FeComponentTransferFunctionView)) {
        continue;
      }

      FeComponentTransferFunctionView functionView = (FeComponentTransferFunctionView) node;

      switch (functionView.mChannel) {
        case R -> mFeFuncR = functionView;
        case G -> mFeFuncG = functionView;
        case B -> mFeFuncB = functionView;
        case A -> mFeFuncA = functionView;
      }
    }
  }

  private void applyComponentTransferOnPixels(int[] pixels) {
    for (int i = 0; i < pixels.length; i++) {
      int c = pixels[i];

      int a = Color.alpha(c);
      int r = Color.red(c);
      int g = Color.green(c);
      int b = Color.blue(c);

      if (mFeFuncR != null) r = mFeFuncR.apply(r);
      if (mFeFuncG != null) g = mFeFuncG.apply(g);
      if (mFeFuncB != null) b = mFeFuncB.apply(b);
      if (mFeFuncA != null) a = mFeFuncA.apply(a);

      pixels[i] = Color.argb(a, r, g, b);
    }
  }
}
