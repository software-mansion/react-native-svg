package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.Color;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReactContext;
import java.util.ArrayList;

@SuppressLint("ViewConstructor")
class FeTurbulenceView extends FilterPrimitiveView {
  ArrayList<SVGLength> mBaseFrequency;
  SVGLength mNumOctaves;
  SVGLength mSeed;
  FilterProperties.FeTurbulenceStitchTile mStitchTiles;
  FilterProperties.FeTurbulenceType mType;

  public FeTurbulenceView(ReactContext reactContext) {
    super(reactContext);
  }

  public void setBaseFrequency(Dynamic baseFrequency) {
    this.mBaseFrequency = SVGLength.arrayFrom(baseFrequency);
    invalidate();
  }

  public void setNumOctaves(Dynamic numOctaves) {
    this.mNumOctaves = SVGLength.from(numOctaves);
    invalidate();
  }

  public void setSeed(Dynamic seed) {
    this.mSeed = SVGLength.from(seed);
    invalidate();
  }

  public void setStitchTiles(String stitchTiles) {
    this.mStitchTiles = FilterProperties.FeTurbulenceStitchTile.getEnum(stitchTiles);
    invalidate();
  }

  public void setType(String type) {
    this.mType = FilterProperties.FeTurbulenceType.getEnum(type);
    invalidate();
  }

  private static final int RAND_m = 2147483647;
  private static final int RAND_a = 16807;
  private static final int RAND_q = 127773;
  private static final int RAND_r = 2836;

  private static final int BSize = 0x100;
  private static final int BM = 0xff;
  private static final int PerlinN = 0x1000;

  private final int[] uLatticeSelector = new int[BSize + BSize + 2];
  private final double[][][] fGradient = new double[4][BSize + BSize + 2][2];

  private long setupSeed(long lSeed) {
    if (lSeed <= 0) lSeed = -(lSeed % (RAND_m - 1)) + 1;
    if (lSeed > RAND_m - 1) lSeed = RAND_m - 1;
    return lSeed;
  }

  private long randomNext(long lSeed) {
    long result = RAND_a * (lSeed % RAND_q) - RAND_r * (lSeed / RAND_q);
    if (result <= 0) result += RAND_m;
    return result;
  }

  private void init(long lSeed) {
    lSeed = setupSeed(lSeed);
    for (int k = 0; k < 4; k++) {
      for (int i = 0; i < BSize; i++) {
        uLatticeSelector[i] = i;
        while (true) {
          lSeed = randomNext(lSeed);
          double gx = (double) ((lSeed % (BSize + BSize)) - BSize) / BSize;

          lSeed = randomNext(lSeed);
          double gy = (double) ((lSeed % (BSize + BSize)) - BSize) / BSize;

          if (gx == 0.0 && gy == 0.0) {
            continue;
          }
          double s = Math.sqrt(gx * gx + gy * gy);
          if (s > 1.0) {
            continue;
          }
          fGradient[k][i][0] = gx / s;
          fGradient[k][i][1] = gy / s;
          break;
        }
      }
    }

    int i = BSize;
    while (--i > 0) {
      lSeed = randomNext(lSeed);
      int j = (int) (lSeed % BSize);
      int tmp = uLatticeSelector[i];
      uLatticeSelector[i] = uLatticeSelector[j];
      uLatticeSelector[j] = tmp;
    }
    for (i = 0; i < BSize + 2; i++) {
      uLatticeSelector[BSize + i] = uLatticeSelector[i];
      for (int k = 0; k < 4; k++) {
        fGradient[k][BSize + i][0] = fGradient[k][i][0];
        fGradient[k][BSize + i][1] = fGradient[k][i][1];
      }
    }
  }

  private double sCurve(double t) {
    return t * t * (3.0 - 2.0 * t);
  }

  private double lerp(double t, double a, double b) {
    return a + t * (b - a);
  }

  private static class StitchInfo {
    int nWidth;
    int nHeight;
    int nWrapX;
    int nWrapY;
  }

  private double noise2(int nColorChannel, double[] vec, StitchInfo pStitchInfo) {
    int bx0, bx1, by0, by1;
    int b00, b10, b01, b11;
    double rx0, rx1, ry0, ry1, sx, sy, a, b, u, v;
    int i, j;

    double t = vec[0] + PerlinN;
    bx0 = (int) t;
    bx1 = bx0 + 1;
    rx0 = t - (int) t;
    rx1 = rx0 - 1.0;

    t = vec[1] + PerlinN;
    by0 = (int) t;
    by1 = by0 + 1;
    ry0 = t - (int) t;
    ry1 = ry0 - 1.0;

    if (pStitchInfo != null) {
      if (bx0 >= pStitchInfo.nWrapX) bx0 -= pStitchInfo.nWidth;
      if (bx1 >= pStitchInfo.nWrapX) bx1 -= pStitchInfo.nWidth;
      if (by0 >= pStitchInfo.nWrapY) by0 -= pStitchInfo.nHeight;
      if (by1 >= pStitchInfo.nWrapY) by1 -= pStitchInfo.nHeight;
    }

    bx0 &= BM;
    bx1 &= BM;
    by0 &= BM;
    by1 &= BM;

    i = uLatticeSelector[bx0];
    j = uLatticeSelector[bx1];

    b00 = uLatticeSelector[i + by0];
    b10 = uLatticeSelector[j + by0];
    b01 = uLatticeSelector[i + by1];
    b11 = uLatticeSelector[j + by1];

    sx = sCurve(rx0);
    sy = sCurve(ry0);

    double[] q;
    q = fGradient[nColorChannel][b00];
    u = rx0 * q[0] + ry0 * q[1];
    q = fGradient[nColorChannel][b10];
    v = rx1 * q[0] + ry0 * q[1];
    a = lerp(sx, u, v);
    q = fGradient[nColorChannel][b01];
    u = rx0 * q[0] + ry1 * q[1];
    q = fGradient[nColorChannel][b11];
    v = rx1 * q[0] + ry1 * q[1];
    b = lerp(sx, u, v);
    return lerp(sy, a, b);
  }

  private double turbulence(int nColorChannel, double[] point, double width, double height) {
    double baseFreqX = this.getBaseFrequencyX();
    double baseFreqY = this.getBaseFrequencyY();
    StitchInfo stitch = new StitchInfo();
    StitchInfo pStitchInfo = null;

    if (mStitchTiles == FilterProperties.FeTurbulenceStitchTile.STITCH) {
      if (baseFreqX != 0.0) {
        double fLoFreq = Math.floor(width * baseFreqX) / width;
        double fHiFreq = Math.ceil(width * baseFreqX) / width;
        if (baseFreqX / fLoFreq < fHiFreq / baseFreqX) baseFreqX = fLoFreq;
        else baseFreqX = fHiFreq;
      }
      if (baseFreqY != 0.0) {
        double fLoFreq = Math.floor(height * baseFreqY) / height;
        double fHiFreq = Math.ceil(height * baseFreqY) / height;
        if (baseFreqY / fLoFreq < fHiFreq / baseFreqY) baseFreqY = fLoFreq;
        else baseFreqY = fHiFreq;
      }

      pStitchInfo = stitch;
      stitch.nWidth = (int) (width * baseFreqX + 0.5);
      stitch.nWrapX = PerlinN + stitch.nWidth;
      stitch.nHeight = (int) (height * baseFreqY + 0.5);
      stitch.nWrapY = PerlinN + stitch.nHeight;
    }

    double fSum = 0.0;
    double[] vec = new double[2];
    vec[0] = (point[0] / mScale) * baseFreqX;
    vec[1] = (point[1] / mScale) * baseFreqY;
    double ratio = 1.0;

    for (int nOctave = 0; nOctave < (int) mNumOctaves.value; nOctave++) {
      double n = noise2(nColorChannel, vec, pStitchInfo);
      if (mType == FilterProperties.FeTurbulenceType.FRACTAL_NOISE) {
        fSum += (n / ratio);
      } else {
        fSum += (Math.abs(n) / ratio);
      }
      vec[0] *= 2.0;
      vec[1] *= 2.0;
      ratio *= 2.0;

      if (pStitchInfo != null) {
        stitch.nWidth *= 2;
        stitch.nWrapX = 2 * stitch.nWrapX - PerlinN;
        stitch.nHeight *= 2;
        stitch.nWrapY = 2 * stitch.nWrapY - PerlinN;
      }
    }
    return fSum;
  }

  public Bitmap applyFilter(java.util.HashMap<String, Bitmap> resultsMap, Bitmap prevResult) {
    int width = prevResult.getWidth();
    int height = prevResult.getHeight();

    Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);

    init((long) mSeed.value);

    int[] pixels = new int[width * height];

    for (int y = 0; y < height; y++) {
      for (int x = 0; x < width; x++) {
        double[] point = new double[] {x, y};

        double rSum = turbulence(0, point, width, height);
        double gSum = turbulence(1, point, width, height);
        double bSum = turbulence(2, point, width, height);
        double aSum = turbulence(3, point, width, height);

        if (mType == FilterProperties.FeTurbulenceType.FRACTAL_NOISE) {
          rSum = (rSum + 1.0) / 2.0;
          gSum = (gSum + 1.0) / 2.0;
          bSum = (bSum + 1.0) / 2.0;
          aSum = (aSum + 1.0) / 2.0;
        }

        rSum = Math.max(0.0, Math.min(1.0, rSum));
        gSum = Math.max(0.0, Math.min(1.0, gSum));
        bSum = Math.max(0.0, Math.min(1.0, bSum));
        aSum = Math.max(0.0, Math.min(1.0, aSum));

        int r8 = (int) Math.round(rSum * 255.0);
        int g8 = (int) Math.round(gSum * 255.0);
        int b8 = (int) Math.round(bSum * 255.0);
        int a8 = (int) Math.round(aSum * 255.0);

        int color = Color.argb(a8, r8, g8, b8);
        pixels[y * width + x] = color;
      }
    }

    bitmap.setPixels(pixels, 0, width, 0, 0, width, height);
    return bitmap;
  }

  private float getBaseFrequencyX() {
    if (mBaseFrequency != null && !mBaseFrequency.isEmpty()) {
      return (float) mBaseFrequency.get(0).value;
    }

    return 0;
  }

  private float getBaseFrequencyY() {
    if (mBaseFrequency != null && mBaseFrequency.size() > 1) {
      return (float) mBaseFrequency.get(1).value;
    }

    return this.getBaseFrequencyX();
  }
}
