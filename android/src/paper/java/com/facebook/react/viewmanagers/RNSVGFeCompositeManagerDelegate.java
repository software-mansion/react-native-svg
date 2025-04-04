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

public class RNSVGFeCompositeManagerDelegate<T extends View, U extends BaseViewManager<T, ? extends LayoutShadowNode> & RNSVGFeCompositeManagerInterface<T>> extends BaseViewManagerDelegate<T, U> {
  public RNSVGFeCompositeManagerDelegate(U viewManager) {
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
      case "in2":
        mViewManager.setIn2(view, value == null ? null : (String) value);
        break;
      case "operator1":
        mViewManager.setOperator1(view, (String) value);
        break;
      case "k1":
        mViewManager.setK1(view, value == null ? 0f : ((Double) value).floatValue());
        break;
      case "k2":
        mViewManager.setK2(view, value == null ? 0f : ((Double) value).floatValue());
        break;
      case "k3":
        mViewManager.setK3(view, value == null ? 0f : ((Double) value).floatValue());
        break;
      case "k4":
        mViewManager.setK4(view, value == null ? 0f : ((Double) value).floatValue());
        break;
      default:
        super.setProperty(view, propName, value);
    }
  }
}
