package com.horcrux.svg;

import com.facebook.jni.HybridData;
import com.facebook.proguard.annotations.DoNotStrip;
import com.facebook.react.fabric.ComponentFactory;
import com.facebook.soloader.SoLoader;

@DoNotStrip
public class RNSvgComponentsRegistry {
  static {
    SoLoader.loadLibrary("rnsvg_modules");
  }

  @DoNotStrip private final HybridData mHybridData;

  @DoNotStrip
  private native HybridData initHybrid(ComponentFactory componentFactory);

  @DoNotStrip
  private RNSvgComponentsRegistry(ComponentFactory componentFactory) {
    mHybridData = initHybrid(componentFactory);
  }

  @DoNotStrip
  public static RNSvgComponentsRegistry register(ComponentFactory componentFactory) {
    return new RNSvgComponentsRegistry(componentFactory);
  }
}
