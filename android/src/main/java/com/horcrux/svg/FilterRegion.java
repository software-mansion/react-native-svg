package com.horcrux.svg;

import android.graphics.Rect;
import android.graphics.RectF;
import com.facebook.react.bridge.Dynamic;

public class FilterRegion {
  SVGLength mX;
  SVGLength mY;
  SVGLength mW;
  SVGLength mH;

  public void setX(Dynamic x) {
    mX = SVGLength.from(x);
  }

  public void setY(Dynamic y) {
    mY = SVGLength.from(y);
  }

  public void setWidth(Dynamic width) {
    mW = SVGLength.from(width);
  }

  public void setHeight(Dynamic height) {
    mH = SVGLength.from(height);
  }

  private double getRelativeOrDefault(
      VirtualView view, SVGLength value, float relativeOn, double defaultValue) {
    if (value == null || value.unit == SVGLength.UnitType.UNKNOWN) {
      return defaultValue;
    }
    return view.relativeOn(value, relativeOn);
  }

  public Rect getCropRect(VirtualView view, FilterProperties.Units units, RectF bounds) {
    double x, y, width, height;
    if (bounds == null) {
      return new Rect(0, 0, 0, 0);
    }
    if (units == FilterProperties.Units.OBJECT_BOUNDING_BOX) {
      x = bounds.left + view.relativeOnFraction(this.mX, bounds.width());
      y = bounds.top + view.relativeOnFraction(this.mY, bounds.height());
      width = view.relativeOnFraction(this.mW, bounds.width());
      height = view.relativeOnFraction(this.mH, bounds.height());
    } else { // FilterProperties.Units.USER_SPACE_ON_USE
      float canvasWidth = view.getSvgView().getCanvasWidth();
      float canvasHeight = view.getSvgView().getCanvasHeight();
      x = getRelativeOrDefault(view, mX, canvasWidth, bounds.left);
      y = getRelativeOrDefault(view, mY, canvasHeight, bounds.top);
      width = getRelativeOrDefault(view, mW, canvasWidth, bounds.width());
      height = getRelativeOrDefault(view, mH, canvasHeight, bounds.height());
    }
    return new Rect((int) x, (int) y, (int) (x + width), (int) (y + height));
  }
}
