package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import java.util.HashMap;

@SuppressLint("ViewConstructor")
class FeMergeView extends FilterPrimitiveView {
  private ReadableArray mNodes;

  public FeMergeView(ReactContext reactContext) {
    super(reactContext);
  }

  public void setNodes(ReadableArray nodes) {
    this.mNodes = nodes;
    invalidate();
  }

  @Override
  public Bitmap applyFilter(HashMap<String, Bitmap> resultsMap, Bitmap prevResult) {
    Bitmap result =
        Bitmap.createBitmap(prevResult.getWidth(), prevResult.getHeight(), Bitmap.Config.ARGB_8888);
    Canvas canvas = new Canvas(result);
    int nodesSize = this.mNodes.size();
    for (int i = 0; i < nodesSize; i++) {
      String nodeKey = this.mNodes.getString(i);
      Bitmap sourceFromResults = nodeKey.isEmpty() ? prevResult : resultsMap.get(nodeKey);

      if (sourceFromResults != null) {
        canvas.drawBitmap(sourceFromResults, 0, 0, new Paint());
      }
    }

    return result;
  }
}
