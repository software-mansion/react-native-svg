/*
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.horcrux.svg;

import static com.facebook.react.uimanager.ViewProps.ALIGN_CONTENT;
import static com.facebook.react.uimanager.ViewProps.ALIGN_ITEMS;
import static com.facebook.react.uimanager.ViewProps.ALIGN_SELF;
import static com.facebook.react.uimanager.ViewProps.BORDER_BOTTOM_WIDTH;
import static com.facebook.react.uimanager.ViewProps.BORDER_END_WIDTH;
import static com.facebook.react.uimanager.ViewProps.BORDER_LEFT_WIDTH;
import static com.facebook.react.uimanager.ViewProps.BORDER_RIGHT_WIDTH;
import static com.facebook.react.uimanager.ViewProps.BORDER_START_WIDTH;
import static com.facebook.react.uimanager.ViewProps.BORDER_TOP_WIDTH;
import static com.facebook.react.uimanager.ViewProps.BORDER_WIDTH;
import static com.facebook.react.uimanager.ViewProps.BOTTOM;
import static com.facebook.react.uimanager.ViewProps.COLLAPSABLE;
import static com.facebook.react.uimanager.ViewProps.DISPLAY;
import static com.facebook.react.uimanager.ViewProps.END;
import static com.facebook.react.uimanager.ViewProps.FLEX;
import static com.facebook.react.uimanager.ViewProps.FLEX_BASIS;
import static com.facebook.react.uimanager.ViewProps.FLEX_DIRECTION;
import static com.facebook.react.uimanager.ViewProps.FLEX_GROW;
import static com.facebook.react.uimanager.ViewProps.FLEX_SHRINK;
import static com.facebook.react.uimanager.ViewProps.FLEX_WRAP;
import static com.facebook.react.uimanager.ViewProps.HEIGHT;
import static com.facebook.react.uimanager.ViewProps.JUSTIFY_CONTENT;
import static com.facebook.react.uimanager.ViewProps.LEFT;
import static com.facebook.react.uimanager.ViewProps.MARGIN;
import static com.facebook.react.uimanager.ViewProps.MARGIN_BOTTOM;
import static com.facebook.react.uimanager.ViewProps.MARGIN_END;
import static com.facebook.react.uimanager.ViewProps.MARGIN_HORIZONTAL;
import static com.facebook.react.uimanager.ViewProps.MARGIN_LEFT;
import static com.facebook.react.uimanager.ViewProps.MARGIN_RIGHT;
import static com.facebook.react.uimanager.ViewProps.MARGIN_START;
import static com.facebook.react.uimanager.ViewProps.MARGIN_TOP;
import static com.facebook.react.uimanager.ViewProps.MARGIN_VERTICAL;
import static com.facebook.react.uimanager.ViewProps.MAX_HEIGHT;
import static com.facebook.react.uimanager.ViewProps.MAX_WIDTH;
import static com.facebook.react.uimanager.ViewProps.MIN_HEIGHT;
import static com.facebook.react.uimanager.ViewProps.MIN_WIDTH;
import static com.facebook.react.uimanager.ViewProps.OVERFLOW;
import static com.facebook.react.uimanager.ViewProps.PADDING;
import static com.facebook.react.uimanager.ViewProps.PADDING_BOTTOM;
import static com.facebook.react.uimanager.ViewProps.PADDING_END;
import static com.facebook.react.uimanager.ViewProps.PADDING_HORIZONTAL;
import static com.facebook.react.uimanager.ViewProps.PADDING_LEFT;
import static com.facebook.react.uimanager.ViewProps.PADDING_RIGHT;
import static com.facebook.react.uimanager.ViewProps.PADDING_START;
import static com.facebook.react.uimanager.ViewProps.PADDING_TOP;
import static com.facebook.react.uimanager.ViewProps.PADDING_VERTICAL;
import static com.facebook.react.uimanager.ViewProps.POSITION;
import static com.facebook.react.uimanager.ViewProps.RIGHT;
import static com.facebook.react.uimanager.ViewProps.START;
import static com.facebook.react.uimanager.ViewProps.TOP;
import static com.facebook.react.uimanager.ViewProps.WIDTH;
import static com.horcrux.svg.RenderableView.CAP_ROUND;
import static com.horcrux.svg.RenderableView.FILL_RULE_NONZERO;
import static com.horcrux.svg.RenderableView.JOIN_ROUND;

import android.graphics.Matrix;
import android.util.SparseArray;
import android.view.View;
import android.view.ViewGroup;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.JavaOnlyMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.DisplayMetricsHolder;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.MatrixMathHelper;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.PointerEvents;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.TransformHelper;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.ViewProps;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.annotations.ReactPropGroup;
import com.facebook.react.viewmanagers.RNSVGCircleManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGCircleManagerInterface;
import com.facebook.react.viewmanagers.RNSVGClipPathManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGClipPathManagerInterface;
import com.facebook.react.viewmanagers.RNSVGDefsManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGDefsManagerInterface;
import com.facebook.react.viewmanagers.RNSVGEllipseManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGEllipseManagerInterface;
import com.facebook.react.viewmanagers.RNSVGFeBlendManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGFeBlendManagerInterface;
import com.facebook.react.viewmanagers.RNSVGFeColorMatrixManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGFeColorMatrixManagerInterface;
import com.facebook.react.viewmanagers.RNSVGFeCompositeManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGFeCompositeManagerInterface;
import com.facebook.react.viewmanagers.RNSVGFeFloodManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGFeFloodManagerInterface;
import com.facebook.react.viewmanagers.RNSVGFeGaussianBlurManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGFeGaussianBlurManagerInterface;
import com.facebook.react.viewmanagers.RNSVGFeMergeManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGFeMergeManagerInterface;
import com.facebook.react.viewmanagers.RNSVGFeOffsetManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGFeOffsetManagerInterface;
import com.facebook.react.viewmanagers.RNSVGFilterManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGFilterManagerInterface;
import com.facebook.react.viewmanagers.RNSVGForeignObjectManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGForeignObjectManagerInterface;
import com.facebook.react.viewmanagers.RNSVGGroupManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGGroupManagerInterface;
import com.facebook.react.viewmanagers.RNSVGImageManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGImageManagerInterface;
import com.facebook.react.viewmanagers.RNSVGLineManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGLineManagerInterface;
import com.facebook.react.viewmanagers.RNSVGLinearGradientManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGLinearGradientManagerInterface;
import com.facebook.react.viewmanagers.RNSVGMarkerManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGMarkerManagerInterface;
import com.facebook.react.viewmanagers.RNSVGMaskManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGMaskManagerInterface;
import com.facebook.react.viewmanagers.RNSVGPathManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGPathManagerInterface;
import com.facebook.react.viewmanagers.RNSVGPatternManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGPatternManagerInterface;
import com.facebook.react.viewmanagers.RNSVGRadialGradientManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGRadialGradientManagerInterface;
import com.facebook.react.viewmanagers.RNSVGRectManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGRectManagerInterface;
import com.facebook.react.viewmanagers.RNSVGSymbolManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGSymbolManagerInterface;
import com.facebook.react.viewmanagers.RNSVGTSpanManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGTSpanManagerInterface;
import com.facebook.react.viewmanagers.RNSVGTextManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGTextManagerInterface;
import com.facebook.react.viewmanagers.RNSVGTextPathManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGTextPathManagerInterface;
import com.facebook.react.viewmanagers.RNSVGUseManagerDelegate;
import com.facebook.react.viewmanagers.RNSVGUseManagerInterface;
import com.horcrux.svg.events.SvgLoadEvent;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/** ViewManager for DefinitionView RNSVG views */
class VirtualViewManager<V extends VirtualView> extends ViewGroupManager<VirtualView> {

  protected final SVGClass svgClass;
  protected final String mClassName;

  protected VirtualViewManager(SVGClass svgclass) {
    svgClass = svgclass;
    mClassName = svgclass.toString();
  }

  protected ViewManagerDelegate<V> mDelegate;

  protected ViewManagerDelegate getDelegate() {
    return mDelegate;
  }

  static class RenderableShadowNode extends LayoutShadowNode {

    @SuppressWarnings({"unused", "EmptyMethod"})
    @ReactPropGroup(
        names = {
          ALIGN_SELF,
          ALIGN_ITEMS,
          COLLAPSABLE,
          FLEX,
          FLEX_BASIS,
          FLEX_DIRECTION,
          FLEX_GROW,
          FLEX_SHRINK,
          FLEX_WRAP,
          JUSTIFY_CONTENT,
          OVERFLOW,
          ALIGN_CONTENT,
          DISPLAY,

          /* position */
          POSITION,
          RIGHT,
          TOP,
          BOTTOM,
          LEFT,
          START,
          END,

          /* dimensions */
          WIDTH,
          HEIGHT,
          MIN_WIDTH,
          MAX_WIDTH,
          MIN_HEIGHT,
          MAX_HEIGHT,

          /* margins */
          MARGIN,
          MARGIN_VERTICAL,
          MARGIN_HORIZONTAL,
          MARGIN_LEFT,
          MARGIN_RIGHT,
          MARGIN_TOP,
          MARGIN_BOTTOM,
          MARGIN_START,
          MARGIN_END,

          /* paddings */
          PADDING,
          PADDING_VERTICAL,
          PADDING_HORIZONTAL,
          PADDING_LEFT,
          PADDING_RIGHT,
          PADDING_TOP,
          PADDING_BOTTOM,
          PADDING_START,
          PADDING_END,
          BORDER_WIDTH,
          BORDER_START_WIDTH,
          BORDER_END_WIDTH,
          BORDER_TOP_WIDTH,
          BORDER_BOTTOM_WIDTH,
          BORDER_LEFT_WIDTH,
          BORDER_RIGHT_WIDTH,
        })
    public void ignoreLayoutProps(int index, Dynamic value) {}
  }

  @Override
  public LayoutShadowNode createShadowNodeInstance() {
    return new RenderableShadowNode();
  }

  @Override
  public Class<? extends LayoutShadowNode> getShadowNodeClass() {
    return RenderableShadowNode.class;
  }

  private static final MatrixMathHelper.MatrixDecompositionContext sMatrixDecompositionContext =
      new MatrixMathHelper.MatrixDecompositionContext();
  private static final double[] sTransformDecompositionArray = new double[16];

  private static final int PERSPECTIVE_ARRAY_INVERTED_CAMERA_DISTANCE_INDEX = 2;
  private static final float CAMERA_DISTANCE_NORMALIZATION_MULTIPLIER = 5;

  private static float sanitizeFloatPropertyValue(float value) {
    if (value >= -Float.MAX_VALUE && value <= Float.MAX_VALUE) {
      return value;
    }
    if (value < -Float.MAX_VALUE || value == Float.NEGATIVE_INFINITY) {
      return -Float.MAX_VALUE;
    }
    if (value > Float.MAX_VALUE || value == Float.POSITIVE_INFINITY) {
      return Float.MAX_VALUE;
    }
    if (Float.isNaN(value)) {
      return 0;
    }
    // Shouldn't be possible to reach this point.
    throw new IllegalStateException("Invalid float property value: " + value);
  }

  protected void setTransformProperty(VirtualView view, ReadableArray transforms) {
    if (transforms == null) {
      view.setTranslationX(PixelUtil.toPixelFromDIP(0));
      view.setTranslationY(PixelUtil.toPixelFromDIP(0));
      view.setRotation(0);
      view.setRotationX(0);
      view.setRotationY(0);
      view.setScaleX(1);
      view.setScaleY(1);
      view.setCameraDistance(0);
      return;
    }

    sMatrixDecompositionContext.reset();
    TransformHelper.processTransform(
        transforms, sTransformDecompositionArray, view.getWidth(), view.getHeight(), null, false);
    MatrixMathHelper.decomposeMatrix(sTransformDecompositionArray, sMatrixDecompositionContext);
    view.setTranslationX(
        PixelUtil.toPixelFromDIP(
            sanitizeFloatPropertyValue((float) sMatrixDecompositionContext.translation[0])));
    view.setTranslationY(
        PixelUtil.toPixelFromDIP(
            sanitizeFloatPropertyValue((float) sMatrixDecompositionContext.translation[1])));
    view.setRotation(
        sanitizeFloatPropertyValue((float) sMatrixDecompositionContext.rotationDegrees[2]));
    view.setRotationX(
        sanitizeFloatPropertyValue((float) sMatrixDecompositionContext.rotationDegrees[0]));
    view.setRotationY(
        sanitizeFloatPropertyValue((float) sMatrixDecompositionContext.rotationDegrees[1]));
    view.setScaleX(sanitizeFloatPropertyValue((float) sMatrixDecompositionContext.scale[0]));
    view.setScaleY(sanitizeFloatPropertyValue((float) sMatrixDecompositionContext.scale[1]));

    double[] perspectiveArray = sMatrixDecompositionContext.perspective;

    if (perspectiveArray.length > PERSPECTIVE_ARRAY_INVERTED_CAMERA_DISTANCE_INDEX) {
      float invertedCameraDistance =
          (float) perspectiveArray[PERSPECTIVE_ARRAY_INVERTED_CAMERA_DISTANCE_INDEX];
      if (invertedCameraDistance == 0) {
        // Default camera distance, before scale multiplier (1280)
        invertedCameraDistance = 0.00078125f;
      }
      float cameraDistance = -1 / invertedCameraDistance;
      float scale = DisplayMetricsHolder.getScreenDisplayMetrics().density;

      // The following converts the matrix's perspective to a camera distance
      // such that the camera perspective looks the same on Android and iOS.
      // The native Android implementation removed the screen density from the
      // calculation, so squaring and a normalization value of
      // sqrt(5) produces an exact replica with iOS.
      // For more information, see https://github.com/facebook/react-native/pull/18302
      float normalizedCameraDistance =
          scale * scale * cameraDistance * CAMERA_DISTANCE_NORMALIZATION_MULTIPLIER;
      view.setCameraDistance(normalizedCameraDistance);
    }
  }

  @Nonnull
  public String getName() {
    return mClassName;
  }

  @ReactProp(name = "mask")
  public void setMask(V node, String mask) {
    node.setMask(mask);
  }

  @ReactProp(name = "markerStart")
  public void setMarkerStart(V node, String markerStart) {
    node.setMarkerStart(markerStart);
  }

  @ReactProp(name = "markerMid")
  public void setMarkerMid(V node, String markerMid) {
    node.setMarkerMid(markerMid);
  }

  @ReactProp(name = "markerEnd")
  public void setMarkerEnd(V node, String markerEnd) {
    node.setMarkerEnd(markerEnd);
  }

  @ReactProp(name = "clipPath")
  public void setClipPath(V node, String clipPath) {
    node.setClipPath(clipPath);
  }

  @ReactProp(name = "clipRule")
  public void setClipRule(V node, int clipRule) {
    node.setClipRule(clipRule);
  }

  @ReactProp(name = "opacity")
  public void setOpacity(@Nonnull V node, @Nullable Dynamic opacity) {
    node.setOpacity(opacity);
  }
  public void setOpacity(@Nonnull V node, String opacity) {
    node.setOpacity(opacity);
  }
  public void setOpacity(@Nonnull V node, float opacity) {
    node.setOpacity(opacity);
  }

  @ReactProp(name = "responsible")
  public void setResponsible(V node, boolean responsible) {
    node.setResponsible(responsible);
  }

  @ReactProp(name = ViewProps.POINTER_EVENTS)
  public void setPointerEvents(V view, @Nullable String pointerEventsStr) {
    if (pointerEventsStr == null) {
      view.setPointerEvents(PointerEvents.AUTO);
    } else {
      PointerEvents pointerEvents =
          PointerEvents.valueOf(pointerEventsStr.toUpperCase(Locale.US).replace("-", "_"));
      view.setPointerEvents(pointerEvents);
    }
  }

  @ReactProp(name = "name")
  public void setName(V node, String name) {
    node.setName(name);
  }

  @ReactProp(name = "display")
  public void setDisplay(V node, String display) {
    node.setDisplay(display);
  }

  @ReactProp(name = "matrix")
  public void setMatrix(V node, Dynamic matrixArray) {
    node.setMatrix(matrixArray);
  }

  public void setMatrix(V view, @Nullable ReadableArray value) {
    view.setMatrix(value);
  }

  @Override
  public void setTransform(VirtualView node, @Nullable ReadableArray matrix) {
    setTransformProperty(node, matrix);

    Matrix m = node.getMatrix();
    node.mMatrix = m;
    node.mInvertible = m.invert(node.mInvMatrix);
  }

  @ReactProp(name = "transform")
  public void setTransform(V node, Dynamic matrix) {
    if (matrix.getType() != ReadableType.Array) {
      return;
    }
    ReadableArray ma = matrix.asArray();
    setTransform(node, ma);
  }

  private void invalidateSvgView(V node) {
    SvgView view = node.getSvgView();
    if (view != null) {
      view.invalidate();
    }
    if (node instanceof TextView) {
      ((TextView) node).getTextContainer().clearChildCache();
    }
  }

  @Override
  protected void addEventEmitters(
      @Nonnull ThemedReactContext reactContext, @Nonnull VirtualView view) {
    super.addEventEmitters(reactContext, view);
    view.setOnHierarchyChangeListener(
        new ViewGroup.OnHierarchyChangeListener() {
          @Override
          public void onChildViewAdded(View view, View view1) {
            if (view instanceof VirtualView) {
              invalidateSvgView((V) view);
            }
          }

          @Override
          public void onChildViewRemoved(View view, View view1) {
            if (view instanceof VirtualView) {
              invalidateSvgView((V) view);
            }
          }
        });
  }

  /**
   * Callback that will be triggered after all properties are updated in current update transaction
   * (all @ReactProp handlers for properties updated in current transaction have been called). If
   * you want to override this method you should call super.onAfterUpdateTransaction from it as the
   * parent class of the ViewManager may rely on callback being executed.
   */
  @Override
  protected void onAfterUpdateTransaction(@Nonnull VirtualView node) {
    super.onAfterUpdateTransaction(node);
    invalidateSvgView((V) node);
  }

  protected enum SVGClass {
    RNSVGGroup,
    RNSVGPath,
    RNSVGText,
    RNSVGTSpan,
    RNSVGTextPath,
    RNSVGImage,
    RNSVGCircle,
    RNSVGEllipse,
    RNSVGLine,
    RNSVGRect,
    RNSVGClipPath,
    RNSVGDefs,
    RNSVGUse,
    RNSVGSymbol,
    RNSVGLinearGradient,
    RNSVGRadialGradient,
    RNSVGPattern,
    RNSVGMask,
    RNSVGFilter,
    RNSVGFeBlend,
    RNSVGFeColorMatrix,
    RNSVGFeComposite,
    RNSVGFeFlood,
    RNSVGFeGaussianBlur,
    RNSVGFeMerge,
    RNSVGFeOffset,
    RNSVGMarker,
    RNSVGForeignObject,
  }

  @Nonnull
  @Override
  protected VirtualView createViewInstance(@Nonnull ThemedReactContext reactContext) {
    switch (svgClass) {
      case RNSVGGroup:
        return new GroupView(reactContext);
      case RNSVGPath:
        return new PathView(reactContext);
      case RNSVGCircle:
        return new CircleView(reactContext);
      case RNSVGEllipse:
        return new EllipseView(reactContext);
      case RNSVGLine:
        return new LineView(reactContext);
      case RNSVGRect:
        return new RectView(reactContext);
      case RNSVGText:
        return new TextView(reactContext);
      case RNSVGTSpan:
        return new TSpanView(reactContext);
      case RNSVGTextPath:
        return new TextPathView(reactContext);
      case RNSVGImage:
        return new ImageView(reactContext);
      case RNSVGClipPath:
        return new ClipPathView(reactContext);
      case RNSVGDefs:
        return new DefsView(reactContext);
      case RNSVGUse:
        return new UseView(reactContext);
      case RNSVGSymbol:
        return new SymbolView(reactContext);
      case RNSVGLinearGradient:
        return new LinearGradientView(reactContext);
      case RNSVGRadialGradient:
        return new RadialGradientView(reactContext);
      case RNSVGPattern:
        return new PatternView(reactContext);
      case RNSVGMask:
        return new MaskView(reactContext);
      case RNSVGFilter:
        return new FilterView(reactContext);
      case RNSVGFeBlend:
        return new FeBlendView(reactContext);
      case RNSVGFeColorMatrix:
        return new FeColorMatrixView(reactContext);
      case RNSVGFeComposite:
        return new FeCompositeView(reactContext);
      case RNSVGFeFlood:
        return new FeFloodView(reactContext);
      case RNSVGFeGaussianBlur:
        return new FeGaussianBlurView(reactContext);
      case RNSVGFeMerge:
        return new FeMergeView(reactContext);
      case RNSVGFeOffset:
        return new FeOffsetView(reactContext);
      case RNSVGMarker:
        return new MarkerView(reactContext);
      case RNSVGForeignObject:
        return new ForeignObjectView(reactContext);
      default:
        throw new IllegalStateException("Unexpected type " + svgClass.toString());
    }
  }

  private static final SparseArray<RenderableView> mTagToRenderableView = new SparseArray<>();
  private static final SparseArray<Runnable> mTagToRunnable = new SparseArray<>();

  static void setRenderableView(int tag, RenderableView svg) {
    mTagToRenderableView.put(tag, svg);
    Runnable task = mTagToRunnable.get(tag);
    if (task != null) {
      task.run();
      mTagToRunnable.delete(tag);
    }
  }

  static void runWhenViewIsAvailable(int tag, Runnable task) {
    mTagToRunnable.put(tag, task);
  }

  static @Nullable RenderableView getRenderableViewByTag(int tag) {
    return mTagToRenderableView.get(tag);
  }

  @Override
  public void onDropViewInstance(@Nonnull VirtualView view) {
    super.onDropViewInstance(view);
    mTagToRenderableView.remove(view.getId());
  }
}
/** ViewManager for Renderable RNSVG views */
class RenderableViewManager<T extends RenderableView> extends VirtualViewManager<T> {

  RenderableViewManager(SVGClass svgclass) {
    super(svgclass);
  }

  static class GroupViewManagerAbstract<U extends GroupView> extends RenderableViewManager<U> {
    GroupViewManagerAbstract(SVGClass svgClass) {
      super(svgClass);
    }

    @ReactProp(name = "font")
    public void setFont(U node, Dynamic font) {
      node.setFont(font);
    }

    @ReactProp(name = "fontSize")
    public void setFontSize(U node, Dynamic fontSize) {
      JavaOnlyMap map = new JavaOnlyMap();
      switch (fontSize.getType()) {
        case Number:
          map.putDouble("fontSize", fontSize.asDouble());
          break;
        case String:
          map.putString("fontSize", fontSize.asString());
          break;
        default:
          return;
      }
      node.setFont(map);
    }

    @ReactProp(name = "fontWeight")
    public void setFontWeight(U node, Dynamic fontWeight) {
      JavaOnlyMap map = new JavaOnlyMap();
      switch (fontWeight.getType()) {
        case Number:
          map.putDouble("fontWeight", fontWeight.asDouble());
          break;
        case String:
          map.putString("fontWeight", fontWeight.asString());
          break;
        default:
          return;
      }
      node.setFont(map);
    }
  }

  static class GroupViewManager extends GroupViewManagerAbstract<GroupView>
      implements RNSVGGroupManagerInterface<GroupView> {
    GroupViewManager() {
      super(SVGClass.RNSVGGroup);
      mDelegate = new RNSVGGroupManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGGroup";
  }

  static class PathViewManager extends RenderableViewManager<PathView>
      implements RNSVGPathManagerInterface<PathView> {
    PathViewManager() {
      super(SVGClass.RNSVGPath);
      mDelegate = new RNSVGPathManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGPath";

    @ReactProp(name = "d")
    public void setD(PathView node, String d) {
      node.setD(d);
    }
  }

  static class TextViewManagerAbstract<K extends TextView> extends GroupViewManagerAbstract<K> {
    TextViewManagerAbstract(SVGClass svgClass) {
      super(svgClass);
    }

    @ReactProp(name = "inlineSize")
    public void setInlineSize(K node, Dynamic inlineSize) {
      node.setInlineSize(inlineSize);
    }

    @ReactProp(name = "textLength")
    public void setTextLength(K node, Dynamic length) {
      node.setTextLength(length);
    }

    @ReactProp(name = "lengthAdjust")
    public void setLengthAdjust(K node, @Nullable String adjustment) {
      node.setLengthAdjust(adjustment);
    }

    @ReactProp(name = "alignmentBaseline")
    public void setMethod(K node, @Nullable String alignment) {
      node.setMethod(alignment);
    }

    @ReactProp(name = "baselineShift")
    public void setBaselineShift(K node, Dynamic baselineShift) {
      node.setBaselineShift(baselineShift);
    }

    @ReactProp(name = "verticalAlign")
    public void setVerticalAlign(K node, @Nullable Dynamic verticalAlign) {
      node.setVerticalAlign(verticalAlign);
    }

    @ReactProp(name = "rotate")
    public void setRotate(K node, Dynamic rotate) {
      node.setRotate(rotate);
    }

    @ReactProp(name = "dx")
    public void setDx(K node, Dynamic deltaX) {
      node.setDeltaX(deltaX);
    }

    @ReactProp(name = "dy")
    public void setDy(K node, Dynamic deltaY) {
      node.setDeltaY(deltaY);
    }

    @ReactProp(name = "x")
    public void setX(K node, Dynamic positionX) {
      node.setPositionX(positionX);
    }

    @ReactProp(name = "y")
    public void setY(K node, Dynamic positionY) {
      node.setPositionY(positionY);
    }

    @ReactProp(name = "font")
    public void setFont(K node, Dynamic font) {
      node.setFont(font);
    }

    public void setAlignmentBaseline(K view, @Nullable String value) {
      view.setMethod(value);
    }
  }

  static class TextViewManager extends TextViewManagerAbstract<TextView>
      implements RNSVGTextManagerInterface<TextView> {
    TextViewManager() {
      super(SVGClass.RNSVGText);
      mDelegate = new RNSVGTextManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGText";

    TextViewManager(SVGClass svgClass) {
      super(svgClass);
      mDelegate = new RNSVGTextManagerDelegate(this);
    }
  }

  static class TSpanViewManager extends TextViewManagerAbstract<TSpanView>
      implements RNSVGTSpanManagerInterface<TSpanView> {
    TSpanViewManager() {
      super(SVGClass.RNSVGTSpan);
      mDelegate = new RNSVGTSpanManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGTSpan";

    TSpanViewManager(SVGClass svgClass) {
      super(svgClass);
      mDelegate = new RNSVGTSpanManagerDelegate(this);
    }

    @ReactProp(name = "content")
    public void setContent(TSpanView node, @Nullable String content) {
      node.setContent(content);
    }
  }

  static class TextPathViewManager extends TextViewManagerAbstract<TextPathView>
      implements RNSVGTextPathManagerInterface<TextPathView> {
    TextPathViewManager() {
      super(SVGClass.RNSVGTextPath);
      mDelegate = new RNSVGTextPathManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGTextPath";

    TextPathViewManager(SVGClass svgClass) {
      super(svgClass);
      mDelegate = new RNSVGTextPathManagerDelegate(this);
    }

    @ReactProp(name = "href")
    public void setHref(TextPathView node, String href) {
      node.setHref(href);
    }

    @ReactProp(name = "startOffset")
    public void setStartOffset(TextPathView node, Dynamic startOffset) {
      node.setStartOffset(startOffset);
    }

    @ReactProp(name = "method")
    public void setMethod(TextPathView node, @Nullable String method) {
      node.setMethod(method);
    }

    @Override
    public void setMidLine(TextPathView view, @Nullable String value) {
      view.setSharp(value);
    }

    @ReactProp(name = "spacing")
    public void setSpacing(TextPathView node, @Nullable String spacing) {
      node.setSpacing(spacing);
    }

    @ReactProp(name = "side")
    public void setSide(TextPathView node, @Nullable String side) {
      node.setSide(side);
    }

    @ReactProp(name = "midLine")
    public void setSharp(TextPathView node, @Nullable String midLine) {
      node.setSharp(midLine);
    }
  }

  static class ImageViewManager extends RenderableViewManager<ImageView>
      implements RNSVGImageManagerInterface<ImageView> {
    ImageViewManager() {
      super(SVGClass.RNSVGImage);
      mDelegate = new RNSVGImageManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGImage";

    @ReactProp(name = "x")
    public void setX(ImageView node, Dynamic x) {
      node.setX(x);
    }

    @ReactProp(name = "y")
    public void setY(ImageView node, Dynamic y) {
      node.setY(y);
    }

    @ReactProp(name = "width")
    public void setWidth(ImageView node, Dynamic width) {
      node.setWidth(width);
    }

    @ReactProp(name = "height")
    public void setHeight(ImageView node, Dynamic height) {
      node.setHeight(height);
    }

    @ReactProp(name = "src", customType = "ImageSource")
    public void setSrc(ImageView node, @Nullable ReadableMap src) {
      node.setSrc(src);
    }

    @ReactProp(name = "align")
    public void setAlign(ImageView node, String align) {
      node.setAlign(align);
    }

    @ReactProp(name = "meetOrSlice")
    public void setMeetOrSlice(ImageView node, int meetOrSlice) {
      node.setMeetOrSlice(meetOrSlice);
    }

    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
      Map<String, Object> eventTypes = new HashMap<>();
      eventTypes.put(SvgLoadEvent.EVENT_NAME, MapBuilder.of("registrationName", "onLoad"));
      return eventTypes;
    }
  }

  static class CircleViewManager extends RenderableViewManager<CircleView>
      implements RNSVGCircleManagerInterface<CircleView> {
    CircleViewManager() {
      super(SVGClass.RNSVGCircle);
      mDelegate = new RNSVGCircleManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGCircle";

    @ReactProp(name = "cx")
    public void setCx(CircleView node, Dynamic cx) {
      node.setCx(cx);
    }

    @ReactProp(name = "cy")
    public void setCy(CircleView node, Dynamic cy) {
      node.setCy(cy);
    }

    @ReactProp(name = "r")
    public void setR(CircleView node, Dynamic r) {
      node.setR(r);
    }
  }

  static class EllipseViewManager extends RenderableViewManager<EllipseView>
      implements RNSVGEllipseManagerInterface<EllipseView> {
    EllipseViewManager() {
      super(SVGClass.RNSVGEllipse);
      mDelegate = new RNSVGEllipseManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGEllipse";

    @ReactProp(name = "cx")
    public void setCx(EllipseView node, Dynamic cx) {
      node.setCx(cx);
    }

    @ReactProp(name = "cy")
    public void setCy(EllipseView node, Dynamic cy) {
      node.setCy(cy);
    }

    @ReactProp(name = "rx")
    public void setRx(EllipseView node, Dynamic rx) {
      node.setRx(rx);
    }

    @ReactProp(name = "ry")
    public void setRy(EllipseView node, Dynamic ry) {
      node.setRy(ry);
    }
  }

  static class LineViewManager extends RenderableViewManager<LineView>
      implements RNSVGLineManagerInterface<LineView> {

    LineViewManager() {
      super(SVGClass.RNSVGLine);
      mDelegate = new RNSVGLineManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGLine";

    @ReactProp(name = "x1")
    public void setX1(LineView node, Dynamic x1) {
      node.setX1(x1);
    }

    @ReactProp(name = "y1")
    public void setY1(LineView node, Dynamic y1) {
      node.setY1(y1);
    }

    @ReactProp(name = "x2")
    public void setX2(LineView node, Dynamic x2) {
      node.setX2(x2);
    }

    @ReactProp(name = "y2")
    public void setY2(LineView node, Dynamic y2) {
      node.setY2(y2);
    }
  }

  static class RectViewManager extends RenderableViewManager<RectView>
      implements RNSVGRectManagerInterface<RectView> {

    RectViewManager() {
      super(SVGClass.RNSVGRect);
      mDelegate = new RNSVGRectManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGRect";

    @ReactProp(name = "x")
    public void setX(RectView node, Dynamic x) {
      node.setX(x);
    }

    @ReactProp(name = "y")
    public void setY(RectView node, Dynamic y) {
      node.setY(y);
    }

    @ReactProp(name = "width")
    public void setWidth(RectView node, Dynamic width) {
      node.setWidth(width);
    }

    @ReactProp(name = "height")
    public void setHeight(RectView node, Dynamic height) {
      node.setHeight(height);
    }

    @ReactProp(name = "rx")
    public void setRx(RectView node, Dynamic rx) {
      node.setRx(rx);
    }

    @ReactProp(name = "ry")
    public void setRy(RectView node, Dynamic ry) {
      node.setRy(ry);
    }
  }

  static class ClipPathViewManager extends GroupViewManagerAbstract<ClipPathView>
      implements RNSVGClipPathManagerInterface<ClipPathView> {
    ClipPathViewManager() {
      super(SVGClass.RNSVGClipPath);
      mDelegate = new RNSVGClipPathManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGClipPath";
  }

  static class DefsViewManager extends VirtualViewManager<DefsView>
      implements RNSVGDefsManagerInterface<DefsView> {

    DefsViewManager() {
      super(SVGClass.RNSVGDefs);
      mDelegate = new RNSVGDefsManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGDefs";
  }

  static class UseViewManager extends RenderableViewManager<UseView>
      implements RNSVGUseManagerInterface<UseView> {

    UseViewManager() {
      super(SVGClass.RNSVGUse);
      mDelegate = new RNSVGUseManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGUse";

    @ReactProp(name = "href")
    public void setHref(UseView node, String href) {
      node.setHref(href);
    }

    @ReactProp(name = "x")
    public void setX(UseView node, Dynamic x) {
      node.setX(x);
    }

    @ReactProp(name = "y")
    public void setY(UseView node, Dynamic y) {
      node.setY(y);
    }

    @ReactProp(name = "width")
    public void setWidth(UseView node, Dynamic width) {
      node.setWidth(width);
    }

    @ReactProp(name = "height")
    public void setHeight(UseView node, Dynamic height) {
      node.setHeight(height);
    }
  }

  static class SymbolManager extends GroupViewManagerAbstract<SymbolView>
      implements RNSVGSymbolManagerInterface<SymbolView> {
    SymbolManager() {
      super(SVGClass.RNSVGSymbol);
      mDelegate = new RNSVGSymbolManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGSymbol";

    @ReactProp(name = "minX")
    public void setMinX(SymbolView node, float minX) {
      node.setMinX(minX);
    }

    @ReactProp(name = "minY")
    public void setMinY(SymbolView node, float minY) {
      node.setMinY(minY);
    }

    @ReactProp(name = "vbWidth")
    public void setVbWidth(SymbolView node, float vbWidth) {
      node.setVbWidth(vbWidth);
    }

    @ReactProp(name = "vbHeight")
    public void setVbHeight(SymbolView node, float vbHeight) {
      node.setVbHeight(vbHeight);
    }

    @ReactProp(name = "align")
    public void setAlign(SymbolView node, String align) {
      node.setAlign(align);
    }

    @ReactProp(name = "meetOrSlice")
    public void setMeetOrSlice(SymbolView node, int meetOrSlice) {
      node.setMeetOrSlice(meetOrSlice);
    }
  }

  static class PatternManager extends GroupViewManagerAbstract<PatternView>
      implements RNSVGPatternManagerInterface<PatternView> {
    PatternManager() {
      super(SVGClass.RNSVGPattern);
      mDelegate = new RNSVGPatternManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGPattern";

    @ReactProp(name = "x")
    public void setX(PatternView node, Dynamic x) {
      node.setX(x);
    }

    @ReactProp(name = "y")
    public void setY(PatternView node, Dynamic y) {
      node.setY(y);
    }

    @ReactProp(name = "width")
    public void setWidth(PatternView node, Dynamic width) {
      node.setWidth(width);
    }

    @ReactProp(name = "height")
    public void setHeight(PatternView node, Dynamic height) {
      node.setHeight(height);
    }

    @ReactProp(name = "patternUnits")
    public void setPatternUnits(PatternView node, int patternUnits) {
      node.setPatternUnits(patternUnits);
    }

    @ReactProp(name = "patternContentUnits")
    public void setPatternContentUnits(PatternView node, int patternContentUnits) {
      node.setPatternContentUnits(patternContentUnits);
    }

    @ReactProp(name = "patternTransform")
    public void setPatternTransform(PatternView node, @Nullable ReadableArray matrixArray) {
      node.setPatternTransform(matrixArray);
    }

    @ReactProp(name = "minX")
    public void setMinX(PatternView node, float minX) {
      node.setMinX(minX);
    }

    @ReactProp(name = "minY")
    public void setMinY(PatternView node, float minY) {
      node.setMinY(minY);
    }

    @ReactProp(name = "vbWidth")
    public void setVbWidth(PatternView node, float vbWidth) {
      node.setVbWidth(vbWidth);
    }

    @ReactProp(name = "vbHeight")
    public void setVbHeight(PatternView node, float vbHeight) {
      node.setVbHeight(vbHeight);
    }

    @ReactProp(name = "align")
    public void setAlign(PatternView node, String align) {
      node.setAlign(align);
    }

    @ReactProp(name = "meetOrSlice")
    public void setMeetOrSlice(PatternView node, int meetOrSlice) {
      node.setMeetOrSlice(meetOrSlice);
    }
  }

  static class MaskManager extends GroupViewManagerAbstract<MaskView>
      implements RNSVGMaskManagerInterface<MaskView> {
    MaskManager() {
      super(SVGClass.RNSVGMask);
      mDelegate = new RNSVGMaskManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGMask";

    @ReactProp(name = "x")
    public void setX(MaskView node, Dynamic x) {
      node.setX(x);
    }

    @ReactProp(name = "y")
    public void setY(MaskView node, Dynamic y) {
      node.setY(y);
    }

    @ReactProp(name = "width")
    public void setWidth(MaskView node, Dynamic width) {
      node.setWidth(width);
    }

    @ReactProp(name = "height")
    public void setHeight(MaskView node, Dynamic height) {
      node.setHeight(height);
    }

    @ReactProp(name = "maskUnits")
    public void setMaskUnits(MaskView node, int maskUnits) {
      node.setMaskUnits(maskUnits);
    }

    @ReactProp(name = "maskContentUnits")
    public void setMaskContentUnits(MaskView node, int maskContentUnits) {
      node.setMaskContentUnits(maskContentUnits);
    }

    @ReactProp(name = "maskType")
    public void setMaskType(MaskView node, int maskType) {
      node.setMaskType(maskType);
    }
  }

  static class ForeignObjectManager extends GroupViewManagerAbstract<ForeignObjectView>
      implements RNSVGForeignObjectManagerInterface<ForeignObjectView> {
    ForeignObjectManager() {
      super(SVGClass.RNSVGForeignObject);
      mDelegate = new RNSVGForeignObjectManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGForeignObject";

    @ReactProp(name = "x")
    public void setX(ForeignObjectView node, Dynamic x) {
      node.setX(x);
    }

    @ReactProp(name = "y")
    public void setY(ForeignObjectView node, Dynamic y) {
      node.setY(y);
    }

    @ReactProp(name = "width")
    public void setWidth(ForeignObjectView node, Dynamic width) {
      node.setWidth(width);
    }

    @ReactProp(name = "height")
    public void setHeight(ForeignObjectView node, Dynamic height) {
      node.setHeight(height);
    }
  }

  static class MarkerManager extends GroupViewManagerAbstract<MarkerView>
      implements RNSVGMarkerManagerInterface<MarkerView> {
    MarkerManager() {
      super(SVGClass.RNSVGMarker);
      mDelegate = new RNSVGMarkerManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGMarker";

    @ReactProp(name = "refX")
    public void setRefX(MarkerView node, Dynamic refX) {
      node.setRefX(refX);
    }

    @ReactProp(name = "refY")
    public void setRefY(MarkerView node, Dynamic refY) {
      node.setRefY(refY);
    }

    @ReactProp(name = "markerWidth")
    public void setMarkerWidth(MarkerView node, Dynamic markerWidth) {
      node.setMarkerWidth(markerWidth);
    }

    @ReactProp(name = "markerHeight")
    public void setMarkerHeight(MarkerView node, Dynamic markerHeight) {
      node.setMarkerHeight(markerHeight);
    }

    @ReactProp(name = "markerUnits")
    public void setMarkerUnits(MarkerView node, String markerUnits) {
      node.setMarkerUnits(markerUnits);
    }

    @ReactProp(name = "orient")
    public void setOrient(MarkerView node, String orient) {
      node.setOrient(orient);
    }

    @ReactProp(name = "minX")
    public void setMinX(MarkerView node, float minX) {
      node.setMinX(minX);
    }

    @ReactProp(name = "minY")
    public void setMinY(MarkerView node, float minY) {
      node.setMinY(minY);
    }

    @ReactProp(name = "vbWidth")
    public void setVbWidth(MarkerView node, float vbWidth) {
      node.setVbWidth(vbWidth);
    }

    @ReactProp(name = "vbHeight")
    public void setVbHeight(MarkerView node, float vbHeight) {
      node.setVbHeight(vbHeight);
    }

    @ReactProp(name = "align")
    public void setAlign(MarkerView node, String align) {
      node.setAlign(align);
    }

    @ReactProp(name = "meetOrSlice")
    public void setMeetOrSlice(MarkerView node, int meetOrSlice) {
      node.setMeetOrSlice(meetOrSlice);
    }
  }

  static class LinearGradientManager extends VirtualViewManager<LinearGradientView>
      implements RNSVGLinearGradientManagerInterface<LinearGradientView> {

    LinearGradientManager() {
      super(SVGClass.RNSVGLinearGradient);
      mDelegate = new RNSVGLinearGradientManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGLinearGradient";

    @ReactProp(name = "x1")
    public void setX1(LinearGradientView node, Dynamic x1) {
      node.setX1(x1);
    }

    @ReactProp(name = "y1")
    public void setY1(LinearGradientView node, Dynamic y1) {
      node.setY1(y1);
    }

    @ReactProp(name = "x2")
    public void setX2(LinearGradientView node, Dynamic x2) {
      node.setX2(x2);
    }

    @ReactProp(name = "y2")
    public void setY2(LinearGradientView node, Dynamic y2) {
      node.setY2(y2);
    }

    @ReactProp(name = "gradient")
    public void setGradient(LinearGradientView node, ReadableArray gradient) {
      node.setGradient(gradient);
    }

    @ReactProp(name = "gradientUnits")
    public void setGradientUnits(LinearGradientView node, int gradientUnits) {
      node.setGradientUnits(gradientUnits);
    }

    @ReactProp(name = "gradientTransform")
    public void setGradientTransform(LinearGradientView node, @Nullable ReadableArray matrixArray) {
      node.setGradientTransform(matrixArray);
    }
  }

  static class RadialGradientManager extends VirtualViewManager<RadialGradientView>
      implements RNSVGRadialGradientManagerInterface<RadialGradientView> {

    RadialGradientManager() {
      super(SVGClass.RNSVGRadialGradient);
      mDelegate = new RNSVGRadialGradientManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGRadialGradient";

    @ReactProp(name = "fx")
    public void setFx(RadialGradientView node, Dynamic fx) {
      node.setFx(fx);
    }

    @ReactProp(name = "fy")
    public void setFy(RadialGradientView node, Dynamic fy) {
      node.setFy(fy);
    }

    @ReactProp(name = "rx")
    public void setRx(RadialGradientView node, Dynamic rx) {
      node.setRx(rx);
    }

    @ReactProp(name = "ry")
    public void setRy(RadialGradientView node, Dynamic ry) {
      node.setRy(ry);
    }

    @ReactProp(name = "cx")
    public void setCx(RadialGradientView node, Dynamic cx) {
      node.setCx(cx);
    }

    @ReactProp(name = "cy")
    public void setCy(RadialGradientView node, Dynamic cy) {
      node.setCy(cy);
    }

    @ReactProp(name = "gradient")
    public void setGradient(RadialGradientView node, ReadableArray gradient) {
      node.setGradient(gradient);
    }

    @ReactProp(name = "gradientUnits")
    public void setGradientUnits(RadialGradientView node, int gradientUnits) {
      node.setGradientUnits(gradientUnits);
    }

    @ReactProp(name = "gradientTransform")
    public void setGradientTransform(RadialGradientView node, @Nullable ReadableArray matrixArray) {
      node.setGradientTransform(matrixArray);
    }
  }

  static class FilterManager extends VirtualViewManager<FilterView>
      implements RNSVGFilterManagerInterface<FilterView> {
    FilterManager() {
      super(SVGClass.RNSVGFilter);
      mDelegate = new RNSVGFilterManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGFilter";

    @ReactProp(name = "x")
    public void setX(FilterView node, Dynamic x) {
      node.setX(x);
    }

    @ReactProp(name = "y")
    public void setY(FilterView node, Dynamic y) {
      node.setY(y);
    }

    @ReactProp(name = "width")
    public void setWidth(FilterView node, Dynamic width) {
      node.setWidth(width);
    }

    @ReactProp(name = "height")
    public void setHeight(FilterView node, Dynamic height) {
      node.setHeight(height);
    }

    @ReactProp(name = "filterUnits")
    public void setFilterUnits(FilterView node, String filterUnits) {
      node.setFilterUnits(filterUnits);
    }

    @ReactProp(name = "primitiveUnits")
    public void setPrimitiveUnits(FilterView node, String primitiveUnits) {
      node.setPrimitiveUnits(primitiveUnits);
    }
  }

  static class FilterPrimitiveManager<T extends FilterPrimitiveView> extends VirtualViewManager<T> {
    protected FilterPrimitiveManager(SVGClass svgclass) {
      super(svgclass);
    }

    @ReactProp(name = "x")
    public void setX(T node, Dynamic x) {
      node.setX(x);
    }

    @ReactProp(name = "y")
    public void setY(T node, Dynamic y) {
      node.setY(y);
    }

    @ReactProp(name = "width")
    public void setWidth(T node, Dynamic width) {
      node.setWidth(width);
    }

    @ReactProp(name = "height")
    public void setHeight(T node, Dynamic height) {
      node.setHeight(height);
    }

    @ReactProp(name = "result")
    public void setResult(T node, String result) {
      node.setResult(result);
    }
  }

  static class FeBlendManager extends FilterPrimitiveManager<FeBlendView>
      implements RNSVGFeBlendManagerInterface<FeBlendView> {
    FeBlendManager() {
      super(SVGClass.RNSVGFeBlend);
      mDelegate = new RNSVGFeBlendManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGFeBlend";

    @ReactProp(name = "in1")
    public void setIn1(FeBlendView node, String in1) {
      node.setIn1(in1);
    }

    @ReactProp(name = "in2")
    public void setIn2(FeBlendView node, String in2) {
      node.setIn2(in2);
    }

    @ReactProp(name = "mode")
    public void setMode(FeBlendView node, String mode) {
      node.setMode(mode);
    }
  }

  static class FeColorMatrixManager extends FilterPrimitiveManager<FeColorMatrixView>
      implements RNSVGFeColorMatrixManagerInterface<FeColorMatrixView> {
    FeColorMatrixManager() {
      super(SVGClass.RNSVGFeColorMatrix);
      mDelegate = new RNSVGFeColorMatrixManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGFeColorMatrix";

    @ReactProp(name = "in1")
    public void setIn1(FeColorMatrixView node, String in1) {
      node.setIn1(in1);
    }

    @ReactProp(name = "type")
    public void setType(FeColorMatrixView node, String type) {
      node.setType(type);
    }

    @ReactProp(name = "values")
    public void setValues(FeColorMatrixView node, @Nullable ReadableArray values) {
      node.setValues(values);
    }
  }

  static class FeCompositeManager extends FilterPrimitiveManager<FeCompositeView>
      implements RNSVGFeCompositeManagerInterface<FeCompositeView> {
    FeCompositeManager() {
      super(SVGClass.RNSVGFeComposite);
      mDelegate = new RNSVGFeCompositeManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGFeComposite";

    @ReactProp(name = "in1")
    public void setIn1(FeCompositeView node, String in1) {
      node.setIn1(in1);
    }

    @ReactProp(name = "in2")
    public void setIn2(FeCompositeView node, String in2) {
      node.setIn2(in2);
    }

    @ReactProp(name = "operator1")
    public void setOperator1(FeCompositeView node, String operator) {
      node.setOperator(operator);
    }

    @ReactProp(name = "k1")
    public void setK1(FeCompositeView node, float value) {
      node.setK1(value);
    }

    @ReactProp(name = "k2")
    public void setK2(FeCompositeView node, float value) {
      node.setK2(value);
    }

    @ReactProp(name = "k3")
    public void setK3(FeCompositeView node, float value) {
      node.setK3(value);
    }

    @ReactProp(name = "k4")
    public void setK4(FeCompositeView node, float value) {
      node.setK4(value);
    }
  }

  static class FeFloodManager extends FilterPrimitiveManager<FeFloodView>
      implements RNSVGFeFloodManagerInterface<FeFloodView> {
    FeFloodManager() {
      super(SVGClass.RNSVGFeFlood);
      mDelegate = new RNSVGFeFloodManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGFeFlood";

    @ReactProp(name = "floodColor")
    public void setFloodColor(FeFloodView node, @Nullable Dynamic strokeColors) {
      node.setFloodColor(strokeColors);
    }

    public void setFloodColor(FeFloodView view, @Nullable ReadableMap value) {
      view.setFloodColor(value);
    }

    @ReactProp(name = "floodOpacity", defaultFloat = 1f)
    public void setFloodOpacity(FeFloodView node, float strokeOpacity) {
      node.setFloodOpacity(strokeOpacity);
    }
  }

  static class FeGaussianBlurManager extends FilterPrimitiveManager<FeGaussianBlurView>
      implements RNSVGFeGaussianBlurManagerInterface<FeGaussianBlurView> {
    FeGaussianBlurManager() {
      super(SVGClass.RNSVGFeGaussianBlur);
      mDelegate = new RNSVGFeGaussianBlurManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGFeGaussianBlur";

    @ReactProp(name = "in1")
    public void setIn1(FeGaussianBlurView node, String in1) {
      node.setIn1(in1);
    }

    @ReactProp(name = "stdDeviationX")
    public void setStdDeviationX(FeGaussianBlurView node, float stdDeviationX) {
      node.setStdDeviationX(stdDeviationX);
    }

    @ReactProp(name = "stdDeviationY")
    public void setStdDeviationY(FeGaussianBlurView node, float stdDeviationY) {
      node.setStdDeviationY(stdDeviationY);
    }

    @ReactProp(name = "values")
    public void setEdgeMode(FeGaussianBlurView node, String edgeMode) {
      node.setEdgeMode(edgeMode);
    }
  }

  static class FeMergeManager extends FilterPrimitiveManager<FeMergeView>
      implements RNSVGFeMergeManagerInterface<FeMergeView> {
    FeMergeManager() {
      super(SVGClass.RNSVGFeMerge);
      mDelegate = new RNSVGFeMergeManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGFeMerge";

    @ReactProp(name = "nodes")
    public void setNodes(FeMergeView node, ReadableArray nodes) {
      node.setNodes(nodes);
    }
  }

  static class FeOffsetManager extends FilterPrimitiveManager<FeOffsetView>
      implements RNSVGFeOffsetManagerInterface<FeOffsetView> {
    FeOffsetManager() {
      super(SVGClass.RNSVGFeOffset);
      mDelegate = new RNSVGFeOffsetManagerDelegate(this);
    }

    public static final String REACT_CLASS = "RNSVGFeOffset";

    @ReactProp(name = "in1")
    public void setIn1(FeOffsetView node, String in1) {
      node.setIn1(in1);
    }

    @ReactProp(name = "dx")
    public void setDx(FeOffsetView node, Dynamic dx) {
      node.setDx(dx);
    }

    @ReactProp(name = "dy")
    public void setDy(FeOffsetView node, Dynamic dy) {
      node.setDy(dy);
    }
  }

  @ReactProp(name = "filter")
  public void setFilter(T node, String filter) {
    node.setFilter(filter);
  }

  @ReactProp(name = "color", customType = "Color")
  public void setColor(T node, Integer color) {
    node.setCurrentColor(color);
  }

  @ReactProp(name = "fill")
  public void setFill(T node, @Nullable Dynamic fill) {
    node.setFill(fill);
  }

  public void setFill(T view, @Nullable ReadableMap value) {
    view.setFill(value);
  }

  @ReactProp(name = "fillOpacity")
  public void setFillOpacity(T node, @Nullable Dynamic fillOpacity) {
    node.setFillOpacity(fillOpacity);
  }
  public void setFillOpacity(T node, String opacity) {
    node.setOpacity(opacity);
  }
  public void setFillOpacity(T node, float opacity) {
    node.setOpacity(opacity);
  }

  @ReactProp(name = "fillRule", defaultInt = FILL_RULE_NONZERO)
  public void setFillRule(T node, int fillRule) {
    node.setFillRule(fillRule);
  }

  @ReactProp(name = "stroke")
  public void setStroke(T node, @Nullable Dynamic strokeColors) {
    node.setStroke(strokeColors);
  }

  public void setStroke(T view, @Nullable ReadableMap value) {
    view.setStroke(value);
  }

  @ReactProp(name = "strokeOpacity")
  public void setStrokeOpacity(T node, @Nullable Dynamic strokeOpacity) {
    node.setStrokeOpacity(strokeOpacity);
  }
  public void setStrokeOpacity(T node, String opacity) {
      node.setStrokeOpacity(opacity);
  }
  public void setStrokeOpacity(T node, float opacity) {
      node.setStrokeOpacity(opacity);
  }

  @ReactProp(name = "strokeDasharray")
  public void setStrokeDasharray(T node, Dynamic strokeDasharray) {
    node.setStrokeDasharray(strokeDasharray);
  }

  @ReactProp(name = "strokeDashoffset")
  public void setStrokeDashoffset(T node, float strokeDashoffset) {
    node.setStrokeDashoffset(strokeDashoffset);
  }

  @ReactProp(name = "strokeWidth")
  public void setStrokeWidth(T node, Dynamic strokeWidth) {
    node.setStrokeWidth(strokeWidth);
  }

  @ReactProp(name = "strokeMiterlimit", defaultFloat = 4f)
  public void setStrokeMiterlimit(T node, float strokeMiterlimit) {
    node.setStrokeMiterlimit(strokeMiterlimit);
  }

  @ReactProp(name = "strokeLinecap", defaultInt = CAP_ROUND)
  public void setStrokeLinecap(T node, int strokeLinecap) {
    node.setStrokeLinecap(strokeLinecap);
  }

  @ReactProp(name = "strokeLinejoin", defaultInt = JOIN_ROUND)
  public void setStrokeLinejoin(T node, int strokeLinejoin) {
    node.setStrokeLinejoin(strokeLinejoin);
  }

  @ReactProp(name = "vectorEffect")
  public void setVectorEffect(T node, int vectorEffect) {
    node.setVectorEffect(vectorEffect);
  }

  @ReactProp(name = "propList")
  public void setPropList(T node, @Nullable ReadableArray propList) {
    node.setPropList(propList);
  }
}
