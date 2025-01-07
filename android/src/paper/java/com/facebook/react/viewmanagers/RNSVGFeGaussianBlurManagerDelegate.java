/**
* This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
*
* Do not edit this file as changes may cause incorrect behavior and will be lost
* once the code is regenerated.
*
* @generated by codegen project: GeneratePropsJavaDelegate.js
*/

package com.facebook.react.viewmanagers;

import android.view.View;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.DynamicFromObject;
import com.facebook.react.uimanager.BaseViewManager;
import com.facebook.react.uimanager.BaseViewManagerDelegate;
import com.facebook.react.uimanager.LayoutShadowNode;

public class RNSVGFeGaussianBlurManagerDelegate<T extends View, U extends BaseViewManager<T, ? extends LayoutShadowNode> & RNSVGFeGaussianBlurManagerInterface<T>> extends BaseViewManagerDelegate<T, U> {
  public RNSVGFeGaussianBlurManagerDelegate(U viewManager) {
    super(viewManager);
  }
  @Override
  public void setProperty(T view, String propName, @Nullable Object value) {
    switch (propName) {
      case "x":
        mViewManager.setX(view, new DynamicFromObject(value));
        break;
      case "y":
        mViewManager.setY(view, new DynamicFromObject(value));
        break;
      case "width":
        mViewManager.setWidth(view, new DynamicFromObject(value));
        break;
      case "height":
        mViewManager.setHeight(view, new DynamicFromObject(value));
        break;
      case "result":
        mViewManager.setResult(view, value == null ? null : (String) value);
        break;
      case "in1":
        mViewManager.setIn1(view, value == null ? null : (String) value);
        break;
      case "stdDeviationX":
        mViewManager.setStdDeviationX(view, value == null ? 0f : ((Double) value).floatValue());
        break;
      case "stdDeviationY":
        mViewManager.setStdDeviationY(view, value == null ? 0f : ((Double) value).floatValue());
        break;
      case "edgeMode":
        mViewManager.setEdgeMode(view, (String) value);
        break;
      default:
        super.setProperty(view, propName, value);
    }
  }
}
