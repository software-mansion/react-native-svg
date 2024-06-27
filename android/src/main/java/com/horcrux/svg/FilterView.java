package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Rect;
import android.graphics.RectF;
import android.view.View;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReactContext;
import java.util.HashMap;

@SuppressLint("ViewConstructor")
class FilterView extends DefinitionView {
  HashMap<String, Bitmap> resultsMap = new HashMap<>();

  SVGLength mX;
  SVGLength mY;
  SVGLength mW;
  SVGLength mH;

  // TODO implement proper support for units
  @SuppressWarnings({"FieldCanBeLocal", "unused"})
  private FilterProperties.Units mFilterUnits;

  @SuppressWarnings({"FieldCanBeLocal", "unused"})
  private FilterProperties.Units mPrimitiveUnits;

  public FilterView(ReactContext reactContext) {
    super(reactContext);
  }

  public void setX(Dynamic x) {
    mX = SVGLength.from(x);
    invalidate();
  }

  public void setY(Dynamic y) {
    mY = SVGLength.from(y);
    invalidate();
  }

  public void setWidth(Dynamic width) {
    mW = SVGLength.from(width);
    invalidate();
  }

  public void setHeight(Dynamic height) {
    mH = SVGLength.from(height);
    invalidate();
  }

  public void setFilterUnits(String filterUnits) {
    mFilterUnits = FilterProperties.Units.getEnum(filterUnits);
    invalidate();
  }

  public void setPrimitiveUnits(String primitiveUnits) {
    mPrimitiveUnits = FilterProperties.Units.getEnum(primitiveUnits);
    invalidate();
  }

  @Override
  void saveDefinition() {
    if (mName != null) {
      SvgView svg = getSvgView();
      if (svg != null) {
        svg.defineFilter(this, mName);
      }
    }
  }

  public Bitmap applyFilter(
      Bitmap source, Bitmap background, RectF renderableBounds, Rect canvasBounds) {
    resultsMap.clear();
    resultsMap.put("SourceGraphic", source);
    resultsMap.put("SourceAlpha", FilterUtils.applySourceAlphaFilter(source));
    // TODO: implement
    resultsMap.put("BackgroundImage", background);
    resultsMap.put("BackgroundAlpha", FilterUtils.applySourceAlphaFilter(background));

    Bitmap res = source;

    for (int i = 0; i < getChildCount(); i++) {
      View node = getChildAt(i);
      if (node instanceof FilterPrimitiveView currentFilter) {
        res = currentFilter.applyFilter(resultsMap, res);
        if (currentFilter.mResult != null) {
          resultsMap.put(currentFilter.mResult, res);
        }
      }
    }

    // crop image to filter x, y, width, height
    int x, y, width, height;
    if (this.mFilterUnits == FilterProperties.Units.USER_SPACE_ON_USE) {
      x = (int) (this.relativeOn(this.mX, canvasBounds.width()));
      y = (int) (this.relativeOn(this.mY, canvasBounds.height()));
      width = (int) this.relativeOn(this.mW, canvasBounds.width());
      height = (int) this.relativeOn(this.mH, canvasBounds.height());
    } else { // FilterProperties.Units.OBJECT_BOUNDING_BOX
      x = (int) (this.relativeOnFraction(this.mX, renderableBounds.width()));
      y = (int) (this.relativeOnFraction(this.mY, renderableBounds.height()));
      width = (int) this.relativeOnFraction(this.mW, renderableBounds.width());
      height = (int) this.relativeOnFraction(this.mH, renderableBounds.height());
    }
    Rect cropRect = new Rect(x, y, x + width, y + height);
    Bitmap resultBitmap = Bitmap.createBitmap(res.getWidth(), res.getHeight(), res.getConfig());
    Canvas canvas = new Canvas(resultBitmap);
    canvas.drawBitmap(res, cropRect, cropRect, null);
    return resultBitmap;
  }
}
