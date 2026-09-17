package com.horcrux.svg;

import android.annotation.SuppressLint;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReactContext;
import java.util.ArrayList;

@SuppressLint("ViewConstructor")
class FeComponentTransferFunctionView extends FilterPrimitiveView {
  FilterProperties.FeComponentTransferFuncChannel mChannel;
  FilterProperties.FeComponentTransferFuncType mType;
  ArrayList<SVGLength> mTableValues;
  SVGLength mSlope;
  SVGLength mIntercept;
  SVGLength mAmplitude;
  SVGLength mExponent;
  SVGLength mOffset;

  public FeComponentTransferFunctionView(ReactContext reactContext) {
    super(reactContext);
  }

  public void setChannel(String channel) {
    this.mChannel = FilterProperties.FeComponentTransferFuncChannel.getEnum(channel);
    invalidate();
  }

  public void setType(String type) {
    this.mType = FilterProperties.FeComponentTransferFuncType.getEnum(type);
    invalidate();
  }

  public void setTableValues(Dynamic tableValues) {
    this.mTableValues = SVGLength.arrayFrom(tableValues);
    invalidate();
  }

  public void setSlope(Dynamic slope) {
    this.mSlope = SVGLength.from(slope);
    invalidate();
  }

  public void setIntercept(Dynamic intercept) {
    this.mIntercept = SVGLength.from(intercept);
    invalidate();
  }

  public void setAmplitude(Dynamic amplitude) {
    this.mAmplitude = SVGLength.from(amplitude);
    invalidate();
  }

  public void setExponent(Dynamic exponent) {
    this.mExponent = SVGLength.from(exponent);
    invalidate();
  }

  public void setOffset(Dynamic offset) {
    this.mOffset = SVGLength.from(offset);
    invalidate();
  }

  public int apply(int colorValue) {
    double C = colorValue / 255f; // normalize to [0,1]
    double Cprime = C;

    switch (mType) {
      case TABLE:
        if (mTableValues != null && !mTableValues.isEmpty()) {
          int n = mTableValues.size() - 1;
          if (C >= 1f) {
            Cprime = mTableValues.get(n).value;
          } else {
            double pos = C * n;
            int k = (int) Math.floor(pos);
            double frac = pos - k;
            Cprime =
                mTableValues.get(k).value
                    + frac * (mTableValues.get(k + 1).value - mTableValues.get(k).value);
          }
        }
        break;

      case DISCRETE:
        if (mTableValues != null && !mTableValues.isEmpty()) {
          int n = mTableValues.size();
          if (C >= 1f) {
            Cprime = mTableValues.get(n - 1).value;
          } else {
            int k = (int) Math.floor(C * n);
            Cprime = mTableValues.get(k).value;
          }
        }
        break;

      case LINEAR:
        Cprime = mSlope.value * C + mIntercept.value;
        break;

      case GAMMA:
        Cprime = mAmplitude.value * Math.pow(C, mExponent.value) + mOffset.value;
        break;

      case IDENTITY:
      default:
        break;
    }

    // clamp to [0,1] and scale back to 0..255
    Cprime = Math.max(0f, Math.min(1f, Cprime));
    return (int) (Cprime * 255f + 0.5f);
  }
}
