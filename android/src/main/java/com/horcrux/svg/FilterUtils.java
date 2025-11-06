package com.horcrux.svg;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.graphics.Paint;

public class FilterUtils {

  public static Bitmap getBitmapWithColorMatrix(ColorMatrix colorMatrix, Bitmap sourceBitmap) {
    Bitmap results =
        Bitmap.createBitmap(
            sourceBitmap.getWidth(), sourceBitmap.getHeight(), sourceBitmap.getConfig());

    Canvas canvas = new Canvas(results);

    Paint paint = new Paint();
    paint.setColorFilter(new ColorMatrixColorFilter(colorMatrix));
    canvas.drawBitmap(sourceBitmap, 0, 0, paint);

    return results;
  }

  public static Bitmap applySourceAlphaFilter(Bitmap source) {
    ColorMatrix colorMatrix = new ColorMatrix();
    colorMatrix.set(
        new float[] {
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 1, 0,
          0, 0, 0, 0, 1
        });
    return getBitmapWithColorMatrix(colorMatrix, source);
  }
}
