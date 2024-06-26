package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Rect;
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

  public Bitmap applyFilter(Bitmap source, Rect bounds, Bitmap background) {
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
      Rect canvasRect = this.getSvgView().getCanvasBounds();
      x = (int) (this.relativeOn(this.mX, canvasRect.width()));
      y = (int) (this.relativeOn(this.mY, canvasRect.height()));
      width = (int) this.relativeOn(this.mW, canvasRect.width());
      height = (int) this.relativeOn(this.mH, canvasRect.height());
    } else if (this.mFilterUnits == FilterProperties.Units.OBJECT_BOUNDING_BOX) {
      // FIXME: implement similar to above / iOS
      x = (int) (bounds.left + this.relativeOn(this.mX, bounds.width()));
      y = (int) (bounds.top + this.relativeOn(this.mY, bounds.height()));
      width = (int) this.relativeOn(this.mW, bounds.width());
      height = (int) this.relativeOn(this.mH, bounds.height());
    } else {
      // this code should never be executed
      x = bounds.left;
      y = bounds.top;
      width = bounds.width();
      height = bounds.height();
    }
    Rect cropRect = new Rect(x, y, x + width, y + height);
    Bitmap resultBitmap = Bitmap.createBitmap(res.getWidth(), res.getHeight(), res.getConfig());
    Canvas canvas = new Canvas(resultBitmap);
    canvas.drawBitmap(res, cropRect, cropRect, null);
    return resultBitmap;
  }
}
