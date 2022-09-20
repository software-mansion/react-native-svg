package com.horcrux.svg;

import android.view.View;
import androidx.annotation.Nullable;
import com.facebook.react.uimanager.BaseViewManagerInterface;

public interface MissingPropsInterface<T extends View> extends BaseViewManagerInterface<T> {
  void setPointerEvents(T view, @Nullable String value);
}
