package com.horcrux.svg;

import android.annotation.SuppressLint;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReactContext;
import java.util.ArrayList;

@SuppressLint("ViewConstructor")
class FeComponentTransferFunctionView extends FilterPrimitiveView {
  FilterProperties.FeComponentTransferFuncChannel channel;
  FilterProperties.FeComponentTransferFuncType type;
  ArrayList<SVGLength> tableValues;
  SVGLength slope;
  SVGLength intercept;
  SVGLength amplitude;
  SVGLength exponent;
  SVGLength offset;

  public FeComponentTransferFunctionView(ReactContext reactContext) {
    super(reactContext);
  }

  public void setChannel(String channel) {
    this.channel = FilterProperties.FeComponentTransferFuncChannel.getEnum(channel);
    invalidate();
  }

  public void setType(String type) {
    this.type = FilterProperties.FeComponentTransferFuncType.getEnum(type);
    invalidate();
  }

  public void setTableValues(Dynamic tableValues) {
    this.tableValues = SVGLength.arrayFrom(tableValues);
    invalidate();
  }

  public void setSlope(Dynamic length) {
    slope = SVGLength.from(length);
    invalidate();
  }

  public void setIntercept(Dynamic length) {
    intercept = SVGLength.from(length);
    invalidate();
  }

  public void setAmplitude(Dynamic length) {
    amplitude = SVGLength.from(length);
    invalidate();
  }

  public void setExponent(Dynamic length) {
    exponent = SVGLength.from(length);
    invalidate();
  }

  public void setOffset(Dynamic length) {
    offset = SVGLength.from(length);
    invalidate();
  }

  public int apply(int colorValue) {
    double C = colorValue / 255f; // normalize to [0,1]
    double Cprime = C;

    switch (type) {
      case TABLE:
        if (tableValues != null && !tableValues.isEmpty()) {
          int n = tableValues.size() - 1;
          if (C >= 1f) {
            Cprime = tableValues.get(n).value;
          } else {
            double pos = C * n;
            int k = (int) Math.floor(pos);
            double frac = pos - k;
            Cprime =
                tableValues.get(k).value
                    + frac * (tableValues.get(k + 1).value - tableValues.get(k).value);
          }
        }
        break;

      case DISCRETE:
        if (tableValues != null && !tableValues.isEmpty()) {
          int n = tableValues.size();
          if (C >= 1f) {
            Cprime = tableValues.get(n - 1).value;
          } else {
            int k = (int) Math.floor(C * n);
            Cprime = tableValues.get(k).value;
          }
        }
        break;

      case LINEAR:
        Cprime = slope.value * C + intercept.value;
        break;

      case GAMMA:
        Cprime = amplitude.value * Math.pow(C, exponent.value) + offset.value;
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
