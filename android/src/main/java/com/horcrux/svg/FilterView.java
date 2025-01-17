package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Rect;
import android.graphics.RectF;
import android.util.Log;
import android.view.View;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReactContext;
import java.util.HashMap;

@SuppressLint("ViewConstructor")
class FilterView extends DefinitionView {
  private final HashMap<String, Bitmap> mResultsMap = new HashMap<>();

  private FilterProperties.Units mFilterUnits;
  private FilterProperties.Units mPrimitiveUnits;
  private final FilterRegion mFilterRegion;

  public FilterView(ReactContext reactContext) {
    super(reactContext);
    mFilterRegion = new FilterRegion();
  }

  public void setX(Dynamic x) {
    mFilterRegion.setX(x);
    invalidate();
  }

  public void setY(Dynamic y) {
    mFilterRegion.setY(y);
    invalidate();
  }

  public void setWidth(Dynamic width) {
    mFilterRegion.setWidth(width);
    invalidate();
  }

  public void setHeight(Dynamic height) {
    mFilterRegion.setHeight(height);
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

  public FilterRegion getFilterRegion() {
    return mFilterRegion;
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

  public Bitmap applyFilter(Bitmap source, Bitmap background, RectF renderableBounds) {
    mResultsMap.clear();
    mResultsMap.put("SourceGraphic", source);
    mResultsMap.put("SourceAlpha", FilterUtils.applySourceAlphaFilter(source));
    mResultsMap.put("BackgroundImage", background);
    mResultsMap.put("BackgroundAlpha", FilterUtils.applySourceAlphaFilter(background));

    Bitmap res = source;
    Bitmap resultBitmap = Bitmap.createBitmap(res.getWidth(), res.getHeight(), res.getConfig());
    Canvas canvas = new Canvas(resultBitmap);
    Rect filterRegionRect =
        this.mFilterRegion.getCropRect(this, this.mFilterUnits, renderableBounds);
    Rect cropRect;

    for (int i = 0; i < getChildCount(); i++) {
      View node = getChildAt(i);
      if (node instanceof FilterPrimitiveView) {
        FilterPrimitiveView currentFilter = (FilterPrimitiveView) node;
        resultBitmap.eraseColor(Color.TRANSPARENT);
        cropRect =
            currentFilter.mFilterSubregion.getCropRect(
                currentFilter,
                this.mPrimitiveUnits,
                this.mPrimitiveUnits == FilterProperties.Units.USER_SPACE_ON_USE
                    ? new RectF(filterRegionRect)
                    : renderableBounds);
        canvas.drawBitmap(currentFilter.applyFilter(mResultsMap, res), cropRect, cropRect, null);
        res = resultBitmap.copy(Bitmap.Config.ARGB_8888, true);
        String resultName = currentFilter.getResult();
        if (resultName != null) {
          mResultsMap.put(resultName, res);
        }
      } else {
        Log.e("RNSVG", "Invalid `Filter` child: Filter children can only be `Fe...` components");
      }
    }

    // crop Bitmap to filter coordinates
    resultBitmap.eraseColor(Color.TRANSPARENT);
    canvas.drawBitmap(res, filterRegionRect, filterRegionRect, null);
    return resultBitmap;
  }
}
