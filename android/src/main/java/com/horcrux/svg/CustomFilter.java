package com.horcrux.svg;

import android.graphics.Bitmap;

interface CustomFilterFunction {
  float[] execute(float[] src, float[] dst);
}

public class CustomFilter {
  public static Bitmap apply(Bitmap srcBmp, Bitmap dstBmp, CustomFilterFunction func) {
    int width = srcBmp.getWidth();
    int height = srcBmp.getHeight();
    int[] srcPixels = new int[width * height];
    int[] dstPixels = new int[width * height];
    int[] resPixels = new int[width * height];
    int srcArgb = 0;
    float[] src = new float[] {0, 0, 0, 0};
    int dstArgb = 0;
    float[] dst = new float[] {0, 0, 0, 0};

    try {
      srcBmp.getPixels(srcPixels, 0, width, 0, 0, width, height);
      dstBmp.getPixels(dstPixels, 0, width, 0, 0, width, height);
    } catch (IllegalArgumentException | ArrayIndexOutOfBoundsException ignored) {
    }

    for (int y = 0; y < height; y++) {
      for (int x = 0; x < width; x++) {
        srcArgb = srcPixels[y * width + x];
        src[0] = ((srcArgb >> 24) & 0xff) / 255f;
        src[1] = ((srcArgb >> 16) & 0xff) / 255f;
        src[2] = ((srcArgb >> 8) & 0xff) / 255f;
        src[3] = (srcArgb & 0xff) / 255f;

        dstArgb = dstPixels[y * width + x];
        dst[0] = ((dstArgb >> 24) & 0xff) / 255f;
        dst[1] = ((dstArgb >> 16) & 0xff) / 255f;
        dst[2] = ((dstArgb >> 8) & 0xff) / 255f;
        dst[3] = (dstArgb & 0xff) / 255f;

        resPixels[y * width + x] = normalizeFromFloats(func.execute(src, dst));
      }
    }

    return Bitmap.createBitmap(resPixels, width, height, Bitmap.Config.ARGB_8888);
  }

  public static int normalizeFromFloat(float c) {
    return Math.min(255, Math.max(0, Math.round(c * 255)));
  }

  public static int normalizeFromFloats(float[] res) {
    if (res.length < 4 || normalizeFromFloat(res[0]) <= 0) {
      return 0;
    }
    return (normalizeFromFloat(res[0]) << 24)
        | (normalizeFromFloat(res[1] / res[0]) << 16)
        | (normalizeFromFloat(res[2] / res[0]) << 8)
        | normalizeFromFloat(res[3] / res[0]);
  }
}
