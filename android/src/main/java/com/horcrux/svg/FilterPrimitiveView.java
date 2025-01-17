package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReactContext;
import java.util.HashMap;

@SuppressLint("ViewConstructor")
class FilterPrimitiveView extends DefinitionView {
  private String mResult;
  public final FilterRegion mFilterSubregion;

  public FilterPrimitiveView(ReactContext reactContext) {
    super(reactContext);
    mFilterSubregion = new FilterRegion();
  }

  public void setX(Dynamic x) {
    mFilterSubregion.setX(x);
    invalidate();
  }

  public void setY(Dynamic y) {
    mFilterSubregion.setY(y);
    invalidate();
  }

  public void setWidth(Dynamic width) {
    mFilterSubregion.setWidth(width);
    invalidate();
  }

  public void setHeight(Dynamic height) {
    mFilterSubregion.setHeight(height);
    invalidate();
  }

  public void setResult(String result) {
    mResult = result;
    invalidate();
  }

  public String getResult() {
    return mResult;
  }

  protected static Bitmap getSource(
      HashMap<String, Bitmap> resultsMap, Bitmap prevResult, String in1) {
    Bitmap sourceFromResults = in1 != null ? resultsMap.get(in1) : null;
    return sourceFromResults != null ? sourceFromResults : prevResult;
  }

  public Bitmap applyFilter(HashMap<String, Bitmap> resultsMap, Bitmap prevResult) {
    return null;
  }

  @Override
  void saveDefinition() {}
}
