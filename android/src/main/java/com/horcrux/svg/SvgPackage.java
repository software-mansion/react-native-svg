/*
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.horcrux.svg;

import static com.horcrux.svg.RenderableViewManager.*;

import androidx.annotation.Nullable;

import com.facebook.react.ReactPackage;
import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.ModuleSpec;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.module.annotations.ReactModuleList;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.turbomodule.core.interfaces.TurboModule;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.ViewManagerOnDemandReactPackage;
import java.util.Arrays;
import java.util.Collections;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.Nonnull;


@ReactModuleList(
  nativeModules = {
    SvgViewModule.class,
    RNSVGRenderableManager.class,
  })
public class SvgPackage extends TurboReactPackage implements ViewManagerOnDemandReactPackage {

  private @Nullable
  Map<String, ModuleSpec> mViewManagers;

  private Map<String, ModuleSpec> getViewManagersMap(final ReactApplicationContext reactContext) {
    if (mViewManagers == null) {
      Map<String, ModuleSpec> specs = MapBuilder.newHashMap();
      specs.put(GroupViewManager.REACT_CLASS, ModuleSpec.viewManagerSpec(() -> new GroupViewManager()));
      specs.put(PathViewManager.REACT_CLASS, ModuleSpec.viewManagerSpec(() -> new PathViewManager()));
      specs.put(CircleViewManager.REACT_CLASS, ModuleSpec.viewManagerSpec(() -> new CircleViewManager()));
      specs.put(EllipseViewManager.REACT_CLASS, ModuleSpec.viewManagerSpec(() -> new EllipseViewManager()));
      specs.put(LineViewManager.REACT_CLASS, ModuleSpec.viewManagerSpec(() -> new LineViewManager()));
      specs.put(RectViewManager.REACT_CLASS, ModuleSpec.viewManagerSpec(() -> new RectViewManager()));
      specs.put(TextViewManager.REACT_CLASS, ModuleSpec.viewManagerSpec(() -> new TextViewManager()));
      specs.put(TSpanViewManager.REACT_CLASS, ModuleSpec.viewManagerSpec(() -> new TSpanViewManager()));
      specs.put(TextPathViewManager.REACT_CLASS, ModuleSpec.viewManagerSpec(() -> new TextPathViewManager()));
      specs.put(ImageViewManager.REACT_CLASS, ModuleSpec.viewManagerSpec(() -> new ImageViewManager()));
      specs.put(ClipPathViewManager.REACT_CLASS, ModuleSpec.viewManagerSpec(() -> new ClipPathViewManager()));
      specs.put(DefsViewManager.REACT_CLASS, ModuleSpec.viewManagerSpec(() -> new DefsViewManager()));
      specs.put(UseViewManager.REACT_CLASS, ModuleSpec.viewManagerSpec(() -> new UseViewManager()));
      specs.put(SymbolManager.REACT_CLASS, ModuleSpec.viewManagerSpec(() -> new SymbolManager()));
      specs.put(LinearGradientManager.REACT_CLASS, ModuleSpec.viewManagerSpec(() -> new LinearGradientManager()));
      specs.put(RadialGradientManager.REACT_CLASS, ModuleSpec.viewManagerSpec(() -> new RadialGradientManager()));
      specs.put(PatternManager.REACT_CLASS, ModuleSpec.viewManagerSpec(() -> new PatternManager()));
      specs.put(MaskManager.REACT_CLASS, ModuleSpec.viewManagerSpec(() -> new MaskManager()));
      specs.put(ForeignObjectManager.REACT_CLASS, ModuleSpec.viewManagerSpec(() -> new ForeignObjectManager()));
      specs.put(MarkerManager.REACT_CLASS, ModuleSpec.viewManagerSpec(() -> new MarkerManager()));
      specs.put(SvgViewManager.REACT_CLASS, ModuleSpec.viewManagerSpec(() -> new SvgViewManager()));
      mViewManagers = specs;
    }
    return mViewManagers;
  }

  /** {@inheritDoc} */
  @Override
  public Collection<String> getViewManagerNames(ReactApplicationContext reactContext) {
    return getViewManagersMap(reactContext).keySet();
  }

  /** {@inheritDoc} */
  @Override
  public @Nullable ViewManager createViewManager(
    ReactApplicationContext reactContext, String viewManagerName) {
    ModuleSpec spec = getViewManagersMap(reactContext).get(viewManagerName);
    return spec != null ? (ViewManager) spec.getProvider().get() : null;
  }

  @Override
  public NativeModule getModule(String name, @Nonnull ReactApplicationContext reactContext) {
    switch (name) {
      case SvgViewModule.NAME:
        return new SvgViewModule(reactContext);
      case RNSVGRenderableManager.NAME:
        return new RNSVGRenderableManager(reactContext);
      default:
        return null;
    }
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    try {
      Class<?> reactModuleInfoProviderClass =
        Class.forName("com.horcrux.svg.SvgPackage$$ReactModuleInfoProvider");
      return (ReactModuleInfoProvider) reactModuleInfoProviderClass.newInstance();
    } catch (ClassNotFoundException e) {
      // ReactModuleSpecProcessor does not run at build-time. Create this ReactModuleInfoProvider by hand.
      return () -> {
        final Map<String, ReactModuleInfo> reactModuleInfoMap = new HashMap<>();

        Class<? extends NativeModule>[] moduleList =
          new Class[] {
            SvgViewModule.class,
            RNSVGRenderableManager.class,
          };

        for (Class<? extends NativeModule> moduleClass : moduleList) {
          ReactModule reactModule = moduleClass.getAnnotation(ReactModule.class);

          reactModuleInfoMap.put(
            reactModule.name(),
            new ReactModuleInfo(
              reactModule.name(),
              moduleClass.getName(),
              reactModule.canOverrideExistingModule(),
              reactModule.needsEagerInit(),
              reactModule.hasConstants(),
              reactModule.isCxxModule(),
              TurboModule.class.isAssignableFrom(moduleClass)));
        }

        return reactModuleInfoMap;
      };
    } catch (InstantiationException | IllegalAccessException e) {
      throw new RuntimeException(
        "No ReactModuleInfoProvider for MyPackage$$ReactModuleInfoProvider", e);
    }
  }

  @SuppressWarnings("unused")
  public List<Class<? extends JavaScriptModule>> createJSModules() {
    return Collections.emptyList();
  }
}
