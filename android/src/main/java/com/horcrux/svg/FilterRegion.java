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

  public Rect getCropRect(VirtualView view, FilterProperties.Units units, RectF bounds) {
    double x, y, width, height;
    if (units == FilterProperties.Units.USER_SPACE_ON_USE) {
      x = this.mX == null ? 0 : view.relativeOn(this.mX, view.getSvgView().getCanvasWidth());
      y = this.mY == null ? 0 : view.relativeOn(this.mY, view.getSvgView().getCanvasHeight());
      width = this.mW == null ? 0 : view.relativeOn(this.mW, view.getSvgView().getCanvasWidth());
      height = this.mH == null ? 0 : view.relativeOn(this.mH, view.getSvgView().getCanvasHeight());
      return new Rect((int) x, (int) y, (int) (x + width), (int) (y + height));
    } else { // FilterProperties.Units.OBJECT_BOUNDING_BOX
      x = view.relativeOnFraction(this.mX, bounds.width());
      y = view.relativeOnFraction(this.mY, bounds.height());
      width = view.relativeOnFraction(this.mW, bounds.width());
      height = view.relativeOnFraction(this.mH, bounds.height());
      return new Rect(
          (int) (bounds.left + x),
          (int) (bounds.top + y),
          (int) (bounds.left + x + width),
          (int) (bounds.top + y + height));
    }
  }
}
