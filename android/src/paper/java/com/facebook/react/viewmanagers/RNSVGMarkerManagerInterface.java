/**
* This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
*
* Do not edit this file as changes may cause incorrect behavior and will be lost
* once the code is regenerated.
*
* @generated by codegen project: GeneratePropsJavaInterface.js
*/

package com.facebook.react.viewmanagers;

import android.view.View;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

public interface RNSVGMarkerManagerInterface<T extends View> {
  void setName(T view, @Nullable String value);
  void setOpacity(T view, float value);
  void setMatrix(T view, @Nullable ReadableArray value);
  void setMask(T view, @Nullable String value);
  void setMarkerStart(T view, @Nullable String value);
  void setMarkerMid(T view, @Nullable String value);
  void setMarkerEnd(T view, @Nullable String value);
  void setClipPath(T view, @Nullable String value);
  void setClipRule(T view, int value);
  void setResponsible(T view, boolean value);
  void setDisplay(T view, @Nullable String value);
  void setPointerEvents(T view, @Nullable String value);
  void setFill(T view, @Nullable ReadableMap value);
  void setFillOpacity(T view, float value);
  void setFillRule(T view, int value);
  void setStroke(T view, @Nullable ReadableMap value);
  void setStrokeOpacity(T view, float value);
  void setStrokeWidth(T view, Dynamic value);
  void setStrokeLinecap(T view, int value);
  void setStrokeLinejoin(T view, int value);
  void setStrokeDasharray(T view, Dynamic value);
  void setStrokeDashoffset(T view, float value);
  void setStrokeMiterlimit(T view, float value);
  void setVectorEffect(T view, int value);
  void setPropList(T view, @Nullable ReadableArray value);
  void setFilter(T view, @Nullable String value);
  void setFontSize(T view, Dynamic value);
  void setFontWeight(T view, Dynamic value);
  void setFont(T view, Dynamic value);
  void setRefX(T view, Dynamic value);
  void setRefY(T view, Dynamic value);
  void setMarkerHeight(T view, Dynamic value);
  void setMarkerWidth(T view, Dynamic value);
  void setMarkerUnits(T view, @Nullable String value);
  void setOrient(T view, @Nullable String value);
  void setMinX(T view, float value);
  void setMinY(T view, float value);
  void setVbWidth(T view, float value);
  void setVbHeight(T view, float value);
  void setAlign(T view, @Nullable String value);
  void setMeetOrSlice(T view, int value);
}
