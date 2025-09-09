package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.BitmapShader;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.Shader;
import com.facebook.react.bridge.ReactContext;
import java.util.HashMap;

@SuppressLint("ViewConstructor")
class FeTileView extends FilterPrimitiveView {
  String mIn1;

  public FeTileView(ReactContext reactContext) {
    super(reactContext);
  }

  public void setIn1(String in1) {
    this.mIn1 = in1;
    invalidate();
  }

  @Override
  public Bitmap applyFilter(HashMap<String, Bitmap> resultsMap, Bitmap prevResult) {
    Bitmap source = getSource(resultsMap, prevResult, this.mIn1);
    Bitmap result =
        Bitmap.createBitmap(source.getWidth(), source.getHeight(), Bitmap.Config.ARGB_8888);
    Canvas canvas = new Canvas(result);

    Rect cropRect =
        mFilterSubregion.getCropRect(
            this,
            FilterProperties.Units.USER_SPACE_ON_USE,
            new RectF(0, 0, prevResult.getWidth(), prevResult.getHeight()));

    // Clamp crop to source bitmap bounds
    int sx = Math.max(0, Math.min(cropRect.left, source.getWidth() - 1));
    int sy = Math.max(0, Math.min(cropRect.top, source.getHeight() - 1));
    int sw = Math.max(1, Math.min(cropRect.width(), source.getWidth() - sx));
    int sh = Math.max(1, Math.min(cropRect.height(), source.getHeight() - sy));

    Bitmap tile = Bitmap.createBitmap(source, sx, sy, sw, sh);

    Shader shader = new BitmapShader(tile, Shader.TileMode.REPEAT, Shader.TileMode.REPEAT);

    Matrix matrix = new Matrix();
    matrix.setTranslate(cropRect.left, cropRect.top);
    shader.setLocalMatrix(matrix);

    Paint paint = new Paint();
    paint.setShader(shader);

    canvas.drawRect(0, 0, result.getWidth(), result.getHeight(), paint);
    return result;
  }
}
