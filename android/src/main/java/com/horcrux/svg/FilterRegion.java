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

  public Rect getCropRect(VirtualView view, FilterProperties.Units units, RectF renderableBounds) {
    double x, y, width, height;
    if (units == FilterProperties.Units.USER_SPACE_ON_USE) {
      x = view.relativeOn(this.mX, view.getSvgView().getCanvasWidth());
      y = view.relativeOn(this.mY, view.getSvgView().getCanvasHeight());
      width = view.relativeOn(this.mW, view.getSvgView().getCanvasWidth());
      height = view.relativeOn(this.mH, view.getSvgView().getCanvasHeight());
      return new Rect((int) x, (int) y, (int) (x + width), (int) (y + height));
    } else { // FilterProperties.Units.OBJECT_BOUNDING_BOX
      x = view.relativeOnFraction(this.mX, renderableBounds.width());
      y = view.relativeOnFraction(this.mY, renderableBounds.height());
      width = view.relativeOnFraction(this.mW, renderableBounds.width());
      height = view.relativeOnFraction(this.mH, renderableBounds.height());
      return new Rect(
          (int) (renderableBounds.left + x),
          (int) (renderableBounds.top + y),
          (int) (renderableBounds.left + x + width),
          (int) (renderableBounds.top + y + height));
    }
  }
}
