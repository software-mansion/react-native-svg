package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import android.renderscript.Allocation;
import android.renderscript.Element;
import android.renderscript.RenderScript;
import android.renderscript.ScriptIntrinsicBlur;
import com.facebook.react.bridge.ReactContext;
import java.util.HashMap;

@SuppressLint("ViewConstructor")
class FeGaussianBlurView extends FilterPrimitiveView {
  String mIn1;
  float mStdDeviationX;
  float mStdDeviationY;
  FilterProperties.EdgeMode mEdgeMode;

  public FeGaussianBlurView(ReactContext reactContext) {
    super(reactContext);
  }

  public void setIn1(String in1) {
    this.mIn1 = in1;
    invalidate();
  }

  public void setStdDeviationX(float stdDeviationX) {
    this.mStdDeviationX = stdDeviationX;
    invalidate();
  }

  public void setStdDeviationY(float stdDeviationY) {
    this.mStdDeviationY = stdDeviationY;
    invalidate();
  }

  public void setEdgeMode(String edgeMode) {
    this.mEdgeMode = FilterProperties.EdgeMode.getEnum(edgeMode);
    invalidate();
  }

  @Override
  public Bitmap applyFilter(HashMap<String, Bitmap> resultsMap, Bitmap prevResult) {
    Bitmap source = getSource(resultsMap, prevResult, this.mIn1);
    return blur(getContext(), source);
  }

  private Bitmap blur(Context context, Bitmap bitmap) {
    // Android blur radius is much weaker than SVG's, so we need to scale it up.
    float stdDeviation = Math.max(mStdDeviationX, mStdDeviationY) * 2;
    if (stdDeviation <= 0) return bitmap;
    final float maxRadius = 25.0f;
    float radius = Math.min(stdDeviation, maxRadius);

    Bitmap outputBitmap = Bitmap.createBitmap(bitmap);

    // Create a RenderScript with blur
    RenderScript rs = RenderScript.create(context);
    ScriptIntrinsicBlur blurScript = ScriptIntrinsicBlur.create(rs, Element.U8_4(rs));

    // Allocate memory for Renderscript to work with
    Allocation tmpIn = Allocation.createFromBitmap(rs, bitmap);
    Allocation tmpOut = Allocation.createFromBitmap(rs, outputBitmap);

    // Set the radius of the blur, allocation input, and output
    blurScript.setRadius(radius);
    blurScript.setInput(tmpIn);
    blurScript.forEach(tmpOut);

    // Copy the allocation output to the output bitmap and release memory
    tmpOut.copyTo(outputBitmap);
    tmpIn.destroy();
    tmpOut.destroy();
    rs.destroy();

    return Bitmap.createScaledBitmap(outputBitmap, bitmap.getWidth(), bitmap.getHeight(), false);
  }
}
