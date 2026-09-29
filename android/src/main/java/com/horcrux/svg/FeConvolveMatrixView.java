package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReactContext;
import java.util.ArrayList;
import java.util.HashMap;

@SuppressLint("ViewConstructor")
class FeConvolveMatrixView extends FilterPrimitiveView {
  String mIn1;
  ArrayList<SVGLength> mOrder;
  ArrayList<SVGLength> mKernelMatrix;
  SVGLength mDivisor;
  SVGLength mBias;
  SVGLength mTargetX;
  SVGLength mTargetY;
  FilterProperties.EdgeMode mEdgeMode;
  boolean mPreserveAlpha;

  public FeConvolveMatrixView(ReactContext reactContext) {
    super(reactContext);
  }

  public void setIn1(String in1) {
    this.mIn1 = in1;
    invalidate();
  }

  public void setOrder(Dynamic order) {
    this.mOrder = SVGLength.arrayFrom(order);
    invalidate();
  }

  public void setKernelMatrix(Dynamic kernelMatrix) {
    this.mKernelMatrix = SVGLength.arrayFrom(kernelMatrix);
    invalidate();
  }

  public void setDivisor(Dynamic divisor) {
    this.mDivisor = SVGLength.from(divisor);
    invalidate();
  }

  public void setBias(Dynamic bias) {
    this.mBias = SVGLength.from(bias);
    invalidate();
  }

  public void setTargetX(Dynamic targetX) {
    this.mTargetX = SVGLength.from(targetX);
    invalidate();
  }

  public void setTargetY(Dynamic targetY) {
    this.mTargetY = SVGLength.from(targetY);
    invalidate();
  }

  public void setEdgeMode(String edgeMode) {
    this.mEdgeMode = FilterProperties.EdgeMode.getEnum(edgeMode);
    System.out.println(this.mEdgeMode);
    invalidate();
  }

  public void setPreserveAlpha(boolean preserveAlpha) {
    this.mPreserveAlpha = preserveAlpha;
    invalidate();
  }

  @Override
  public Bitmap applyFilter(HashMap<String, Bitmap> resultsMap, Bitmap prevResult) {
    Bitmap in1 = getSource(resultsMap, prevResult, this.mIn1);

    return performConvolution(in1);
  }

  private Bitmap performConvolution(Bitmap src) {
    int width = src.getWidth();
    int height = src.getHeight();
    int orderX = this.getOrderX();
    int orderY = this.getOrderY();
    float[] kernel = this.getKernelMatrixArray(orderX, orderY);
    float divisor = this.getDivisor(kernel);
    int targetX = this.getTargetX(orderX);
    int targetY = this.getTargetY(orderY);

    Bitmap out = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);

    int[] inPixels = new int[width * height];
    src.getPixels(inPixels, 0, width, 0, 0, width, height);
    int[] outPixels = new int[inPixels.length];

    for (int y = 0; y < height; y++) {
      for (int x = 0; x < width; x++) {
        float r = 0, g = 0, b = 0, a = 0;

        for (int ky = 0; ky < orderY; ky++) {
          for (int kx = 0; kx < orderX; kx++) {
            int ix = x + (kx - targetX);
            int iy = y + (ky - targetY);

            int sample;
            switch (this.mEdgeMode) {
              case DUPLICATE:
                ix = Math.max(0, Math.min(ix, width - 1));
                iy = Math.max(0, Math.min(iy, height - 1));
                sample = inPixels[iy * width + ix];
                break;
              case WRAP:
                ix = (ix + width) % width;
                iy = (iy + height) % height;
                sample = inPixels[iy * width + ix];
                break;
              case NONE:
              default:
                if (ix < 0 || iy < 0 || ix >= width || iy >= height) {
                  sample = 0;
                } else {
                  sample = inPixels[iy * width + ix];
                }
                break;
            }

            float kval = kernel[(orderY - 1 - ky) * orderX + (orderX - 1 - kx)];

            a += ((sample >> 24) & 0xFF) * kval;
            r += ((sample >> 16) & 0xFF) * kval;
            g += ((sample >> 8) & 0xFF) * kval;
            b += (sample & 0xFF) * kval;
          }
        }

        r = r / divisor + (int) mBias.value;
        g = g / divisor + (int) mBias.value;
        b = b / divisor + (int) mBias.value;

        if (mPreserveAlpha) {
          a = (inPixels[y * width + x] >> 24) & 0xFF;
        } else {
          a = a / divisor;
        }

        int ir = Math.min(255, Math.max(0, Math.round(r)));
        int ig = Math.min(255, Math.max(0, Math.round(g)));
        int ib = Math.min(255, Math.max(0, Math.round(b)));
        int ia = Math.min(255, Math.max(0, Math.round(a)));

        outPixels[y * width + x] = (ia << 24) | (ir << 16) | (ig << 8) | ib;
      }
    }

    out.setPixels(outPixels, 0, width, 0, 0, width, height);
    return out;
  }

  private int getOrderX() {
    if (this.mOrder == null || this.mOrder.isEmpty()) {
      return 3;
    }

    return (int) this.mOrder.get(0).value;
  }

  private int getOrderY() {
    if (this.mOrder == null || this.mOrder.size() <= 1) {
      return this.getOrderX();
    }

    return (int) this.mOrder.get(1).value;
  }

  private float getDivisor(float[] kernel) {
    float divisor = (mDivisor != null) ? (float) mDivisor.value : 0f;

    if (divisor == 0f) {
      float sum = 0;
      for (float v : kernel) sum += v;
      divisor = (sum == 0f) ? 1f : sum;
    }

    return divisor;
  }

  private float[] getKernelMatrixArray(int orderX, int orderY) {
    float[] kernel = new float[orderX * orderY];

    for (int i = 0; i < kernel.length; i++) {
      kernel[i] = (float) mKernelMatrix.get(i).value;
    }

    return kernel;
  }

  private int getTargetX(int orderX) {
    return (mTargetX != null) ? (int) mTargetX.value : orderX / 2;
  }

  private int getTargetY(int orderY) {
    return (mTargetY != null) ? (int) mTargetY.value : orderY / 2;
  }
}
