/*
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.util.SparseArray;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

import static com.horcrux.svg.RenderableShadowNode.CAP_ROUND;
import static com.horcrux.svg.RenderableShadowNode.FILL_RULE_NONZERO;
import static com.horcrux.svg.RenderableShadowNode.JOIN_ROUND;

/**
 * ViewManager for all shadowed RNSVG views: Group, Path and Text. Since these never get rendered
 * into native views and don't need any logic (all the logic is in {@link SvgView}), this
 * "stubbed" ViewManager is used for all of them.
 */
class RenderableViewManager extends ViewGroupManager<RenderableView> {

    /* package */ private static final String CLASS_GROUP = "RNSVGGroup";
    /* package */ private static final String CLASS_PATH = "RNSVGPath";
    /* package */ private static final String CLASS_TEXT = "RNSVGText";
    /* package */ private static final String CLASS_TSPAN = "RNSVGTSpan";
    /* package */ private static final String CLASS_TEXT_PATH = "RNSVGTextPath";
    /* package */ private static final String CLASS_IMAGE = "RNSVGImage";
    /* package */ private static final String CLASS_CIRCLE = "RNSVGCircle";
    /* package */ private static final String CLASS_ELLIPSE = "RNSVGEllipse";
    /* package */ private static final String CLASS_LINE = "RNSVGLine";
    /* package */ private static final String CLASS_RECT = "RNSVGRect";
    /* package */ private static final String CLASS_CLIP_PATH = "RNSVGClipPath";
    /* package */ private static final String CLASS_DEFS = "RNSVGDefs";
    /* package */ private static final String CLASS_USE = "RNSVGUse";
    /* package */ private static final String CLASS_SYMBOL = "RNSVGSymbol";
    /* package */ private static final String CLASS_LINEAR_GRADIENT = "RNSVGLinearGradient";
    /* package */ private static final String CLASS_RADIAL_GRADIENT = "RNSVGRadialGradient";

    private final String mClassName;


    static RenderableViewManager createGroupViewManager() {
        return new RenderableViewManager(CLASS_GROUP);
    }

    static RenderableViewManager createPathViewManager() {
        return new RenderableViewManager(CLASS_PATH) {

            @ReactProp(name = "d")
            public void setD(RenderableView node, String d) {
                ((PathShadowNode) node.getShadowNode()).setD(d);
            }
        };
    }

    static RenderableViewManager createTextViewManager() {
        return new RenderableViewManager(CLASS_TEXT) {

            @ReactProp(name = "textLength")
            public void setTextLength(RenderableView node, @Nullable String length) {
                ((TextShadowNode) node.getShadowNode()).setTextLength(length);
            }

            @ReactProp(name = "lengthAdjust")
            public void setLengthAdjust(RenderableView node, @Nullable String adjustment) {
                ((TextShadowNode) node.getShadowNode()).setLengthAdjust(adjustment);
            }

            @ReactProp(name = "alignmentBaseline")
            public void setMethod(RenderableView node, @Nullable String alignment) {
                ((TextShadowNode) node.getShadowNode()).setMethod(alignment);
            }

            @ReactProp(name = "baselineShift")
            public void setBaselineShift(RenderableView node, @Nullable String baselineShift) {
                ((TextShadowNode) node.getShadowNode()).setBaselineShift(baselineShift);
            }

            @ReactProp(name = "verticalAlign")
            public void setVerticalAlign(RenderableView node, @Nullable String verticalAlign) {
                ((TextShadowNode) node.getShadowNode()).setVerticalAlign(verticalAlign);
            }

            @ReactProp(name = "rotate")
            public void setRotate(RenderableView node, @Nullable ReadableArray rotate) {
                ((TextShadowNode) node.getShadowNode()).setRotate(rotate);
            }

            @ReactProp(name = "deltaX")
            public void setDeltaX(RenderableView node, @Nullable ReadableArray deltaX) {
                ((TextShadowNode) node.getShadowNode()).setDeltaX(deltaX);
            }

            @ReactProp(name = "deltaY")
            public void setDeltaY(RenderableView node, @Nullable ReadableArray deltaY) {
                ((TextShadowNode) node.getShadowNode()).setDeltaY(deltaY);
            }

            @ReactProp(name = "positionX")
            public void setPositionX(RenderableView node, @Nullable ReadableArray positionX) {
                ((TextShadowNode) node.getShadowNode()).setPositionX(positionX);
            }

            @ReactProp(name = "positionY")
            public void setPositionY(RenderableView node, @Nullable ReadableArray positionY) {
                ((TextShadowNode) node.getShadowNode()).setPositionY(positionY);
            }

            @ReactProp(name = "font")
            public void setFont(RenderableView node, @Nullable ReadableMap font) {
                ((TextShadowNode) node.getShadowNode()).setFont(font);
            }
        };
    }

    static RenderableViewManager createTSpanViewManager() {
        return new RenderableViewManager(CLASS_TSPAN) {

            @ReactProp(name = "content")
            public void setContent(RenderableView node, @Nullable String content) {
                ((TSpanShadowNode) node.getShadowNode()).setContent(content);
            }
        };
    }

    static RenderableViewManager createTextPathViewManager() {
        return new RenderableViewManager(CLASS_TEXT_PATH) {

            @ReactProp(name = "href")
            public void setHref(RenderableView node, String href) {
                ((TextPathShadowNode) node.getShadowNode()).setHref(href);
            }

            @ReactProp(name = "startOffset")
            public void setStartOffset(RenderableView node, @Nullable String startOffset) {
                ((TextPathShadowNode) node.getShadowNode()).setStartOffset(startOffset);
            }

            @ReactProp(name = "method")
            public void setMethod(RenderableView node, @Nullable String method) {
                ((TextPathShadowNode) node.getShadowNode()).setMethod(method);
            }

            @ReactProp(name = "spacing")
            public void setSpacing(RenderableView node, @Nullable String spacing) {
                ((TextPathShadowNode) node.getShadowNode()).setSpacing(spacing);
            }

            @ReactProp(name = "side")
            public void setSide(RenderableView node, @Nullable String side) {
                ((TextPathShadowNode) node.getShadowNode()).setSide(side);
            }

            @ReactProp(name = "midLine")
            public void setSharp(RenderableView node, @Nullable String midLine) {
                ((TextPathShadowNode) node.getShadowNode()).setSharp(midLine);
            }
        };
    }

    static RenderableViewManager createImageViewManager() {
        return new RenderableViewManager(CLASS_IMAGE) {

            @ReactProp(name = "x")
            public void setX(RenderableView node, String x) {
                ((ImageShadowNode) node.getShadowNode()).setX(x);
            }

            @ReactProp(name = "y")
            public void setY(RenderableView node, String y) {
                ((ImageShadowNode) node.getShadowNode()).setY(y);
            }

            @ReactProp(name = "width")
            public void setWidth(RenderableView node, String width) {
                ((ImageShadowNode) node.getShadowNode()).setWidth(width);
            }

            @ReactProp(name = "height")
            public void seHeight(RenderableView node, String height) {
                ((ImageShadowNode) node.getShadowNode()).seHeight(height);
            }

            @ReactProp(name = "src")
            public void setSrc(RenderableView node, @Nullable ReadableMap src) {
                ((ImageShadowNode) node.getShadowNode()).setSrc(src);
            }


            @ReactProp(name = "align")
            public void setAlign(RenderableView node, String align) {
                ((ImageShadowNode) node.getShadowNode()).setAlign(align);
            }

            @ReactProp(name = "meetOrSlice")
            public void setMeetOrSlice(RenderableView node, int meetOrSlice) {
                ((ImageShadowNode) node.getShadowNode()).setMeetOrSlice(meetOrSlice);
            }

            @ReactProp(name = "matrix")
            public void setMatrix(RenderableView node, @Nullable ReadableArray matrixArray) {
                ((ImageShadowNode) node.getShadowNode()).setMatrix(matrixArray);
            }
        };
    }

    static RenderableViewManager createCircleViewManager() {
        return new RenderableViewManager(CLASS_CIRCLE) {

            @ReactProp(name = "cx")
            public void setCx(RenderableView node, String cx) {
                ((CircleShadowNode) node.getShadowNode()).setCx(cx);
            }

            @ReactProp(name = "cy")
            public void setCy(RenderableView node, String cy) {
                ((CircleShadowNode) node.getShadowNode()).setCy(cy);
            }

            @ReactProp(name = "r")
            public void setR(RenderableView node, String r) {
                ((CircleShadowNode) node.getShadowNode()).setR(r);
            }
        };
    }

    static RenderableViewManager createEllipseViewManager() {
        return new RenderableViewManager(CLASS_ELLIPSE) {

            @ReactProp(name = "cx")
            public void setCx(RenderableView node, String cx) {
                ((EllipseShadowNode) node.getShadowNode()).setCx(cx);
            }

            @ReactProp(name = "cy")
            public void setCy(RenderableView node, String cy) {
                ((EllipseShadowNode) node.getShadowNode()).setCy(cy);
            }

            @ReactProp(name = "rx")
            public void setRx(RenderableView node, String rx) {
                ((EllipseShadowNode) node.getShadowNode()).setRx(rx);
            }

            @ReactProp(name = "ry")
            public void setRy(RenderableView node, String ry) {
                ((EllipseShadowNode) node.getShadowNode()).setRy(ry);
            }
        };
    }

    static RenderableViewManager createLineViewManager() {
        return new RenderableViewManager(CLASS_LINE) {

            @ReactProp(name = "x1")
            public void setX1(RenderableView node, String x1) {
                ((LineShadowNode) node.getShadowNode()).setX1(x1);
            }

            @ReactProp(name = "y1")
            public void setY1(RenderableView node, String y1) {
                ((LineShadowNode) node.getShadowNode()).setY1(y1);
            }

            @ReactProp(name = "x2")
            public void setX2(RenderableView node, String x2) {
                ((LineShadowNode) node.getShadowNode()).setX2(x2);
            }

            @ReactProp(name = "y2")
            public void setY2(RenderableView node, String y2) {
                ((LineShadowNode) node.getShadowNode()).setY2(y2);
            }

        };
    }

    static RenderableViewManager createRectViewManager() {
        return new RenderableViewManager(CLASS_RECT) {

            @ReactProp(name = "x")
            public void setX(RenderableView node, String x) {
                ((RectShadowNode) node.getShadowNode()).setX(x);
            }

            @ReactProp(name = "y")
            public void setY(RenderableView node, String y) {
                ((RectShadowNode) node.getShadowNode()).setY(y);
            }

            @ReactProp(name = "rectwidth")
            public void setWidth(RenderableView node, String width) {
                ((RectShadowNode) node.getShadowNode()).setWidth(width);
            }


            @ReactProp(name = "rectheight")
            public void setHeight(RenderableView node, String height) {
                ((RectShadowNode) node.getShadowNode()).setHeight(height);
            }


            @ReactProp(name = "rx")
            public void setRx(RenderableView node, String rx) {
                ((RectShadowNode) node.getShadowNode()).setRx(rx);
            }

            @ReactProp(name = "ry")
            public void setRy(RenderableView node, String ry) {
                ((RectShadowNode) node.getShadowNode()).setRy(ry);
            }
        };
    }

    static RenderableViewManager createClipPathViewManager() {
        return new RenderableViewManager(CLASS_CLIP_PATH);
    }

    static RenderableViewManager createDefsViewManager() {
        return new RenderableViewManager(CLASS_DEFS);
    }

    static RenderableViewManager createUseViewManager() {
        return new RenderableViewManager(CLASS_USE) {

            @ReactProp(name = "href")
            public void setHref(RenderableView node, String href) {
                ((UseShadowNode) node.getShadowNode()).setHref(href);
            }

            @ReactProp(name = "width")
            public void setWidth(RenderableView node, String width) {
                ((UseShadowNode) node.getShadowNode()).setWidth(width);
            }

            @ReactProp(name = "height")
            public void setHeight(RenderableView node, String height) {
                ((UseShadowNode) node.getShadowNode()).setHeight(height);
            }
        };
    }

    static RenderableViewManager createSymbolManager() {
        return new RenderableViewManager(CLASS_SYMBOL) {

            @ReactProp(name = "minX")
            public void setMinX(RenderableView node, float minX) {
                ((SymbolShadowNode) node.getShadowNode()).setMinX(minX);
            }

            @ReactProp(name = "minY")
            public void setMinY(RenderableView node, float minY) {
                ((SymbolShadowNode) node.getShadowNode()).setMinY(minY);
            }

            @ReactProp(name = "vbWidth")
            public void setVbWidth(RenderableView node, float vbWidth) {
                ((SymbolShadowNode) node.getShadowNode()).setVbWidth(vbWidth);
            }

            @ReactProp(name = "vbHeight")
            public void setVbHeight(RenderableView node, float vbHeight) {
                ((SymbolShadowNode) node.getShadowNode()).setVbHeight(vbHeight);
            }

            @ReactProp(name = "align")
            public void setAlign(RenderableView node, String align) {
                ((SymbolShadowNode) node.getShadowNode()).setAlign(align);
            }

            @ReactProp(name = "meetOrSlice")
            public void setMeetOrSlice(RenderableView node, int meetOrSlice) {
                ((SymbolShadowNode) node.getShadowNode()).setMeetOrSlice(meetOrSlice);
            }
        };
    }

    static RenderableViewManager createLinearGradientManager() {
        return new RenderableViewManager(CLASS_LINEAR_GRADIENT) {

            @ReactProp(name = "x1")
            public void setX1(RenderableView node, String x1) {
                ((LinearGradientShadowNode) node.getShadowNode()).setX1(x1);
            }

            @ReactProp(name = "y1")
            public void setY1(RenderableView node, String y1) {
                ((LinearGradientShadowNode) node.getShadowNode()).setY1(y1);
            }

            @ReactProp(name = "x2")
            public void setX2(RenderableView node, String x2) {
                ((LinearGradientShadowNode) node.getShadowNode()).setX2(x2);
            }

            @ReactProp(name = "y2")
            public void setY2(RenderableView node, String y2) {
                ((LinearGradientShadowNode) node.getShadowNode()).setY2(y2);
            }

            @ReactProp(name = "gradient")
            public void setGradient(RenderableView node, ReadableArray gradient) {
                ((LinearGradientShadowNode) node.getShadowNode()).setGradient(gradient);
            }

            @ReactProp(name = "gradientUnits")
            public void setGradientUnits(RenderableView node, int gradientUnits) {
                ((LinearGradientShadowNode) node.getShadowNode()).setGradientUnits(gradientUnits);
            }

            @ReactProp(name = "gradientTransform")
            public void setGradientTransform(RenderableView node, @Nullable ReadableArray matrixArray) {
                ((LinearGradientShadowNode) node.getShadowNode()).setGradientTransform(matrixArray);
            }
        };
    }

    static RenderableViewManager createRadialGradientManager() {
        return new RenderableViewManager(CLASS_RADIAL_GRADIENT) {

            @ReactProp(name = "fx")
            public void setFx(RenderableView node, String fx) {
                ((RadialGradientShadowNode) node.getShadowNode()).setFx(fx);
            }

            @ReactProp(name = "fy")
            public void setFy(RenderableView node, String fy) {
                ((RadialGradientShadowNode) node.getShadowNode()).setFy(fy);
            }

            @ReactProp(name = "rx")
            public void setRx(RenderableView node, String rx) {
                ((RadialGradientShadowNode) node.getShadowNode()).setRx(rx);
            }

            @ReactProp(name = "ry")
            public void setRy(RenderableView node, String ry) {
                ((RadialGradientShadowNode) node.getShadowNode()).setRy(ry);
            }

            @ReactProp(name = "cx")
            public void setCx(RenderableView node, String cx) {
                ((RadialGradientShadowNode) node.getShadowNode()).setCx(cx);
            }

            @ReactProp(name = "cy")
            public void setCy(RenderableView node, String cy) {
                ((RadialGradientShadowNode) node.getShadowNode()).setCy(cy);
            }

            @ReactProp(name = "gradient")
            public void setGradient(RenderableView node, ReadableArray gradient) {
                ((RadialGradientShadowNode) node.getShadowNode()).setGradient(gradient);
            }

            @ReactProp(name = "gradientUnits")
            public void setGradientUnits(RenderableView node, int gradientUnits) {
                ((RadialGradientShadowNode) node.getShadowNode()).setGradientUnits(gradientUnits);
            }

            @ReactProp(name = "gradientTransform")
            public void setGradientTransform(RenderableView node, @Nullable ReadableArray matrixArray) {
                ((RadialGradientShadowNode) node.getShadowNode()).setGradientTransform(matrixArray);
            }
        };
    }

    private RenderableViewManager(String className) {
        mClassName = className;
    }

    @Override
    public String getName() {
        return mClassName;
    }

    @Override
    public LayoutShadowNode createShadowNodeInstance() {
        switch (mClassName) {
            case CLASS_GROUP:
                return new GroupShadowNode();
            case CLASS_PATH:
                return new PathShadowNode();
            case CLASS_CIRCLE:
                return new CircleShadowNode();
            case CLASS_ELLIPSE:
                return new EllipseShadowNode();
            case CLASS_LINE:
                return new LineShadowNode();
            case CLASS_RECT:
                return new RectShadowNode();
            case CLASS_TEXT:
                return new TextShadowNode();
            case CLASS_TSPAN:
                return new TSpanShadowNode();
            case CLASS_TEXT_PATH:
                return new TextPathShadowNode();
            case CLASS_IMAGE:
                return new ImageShadowNode();
            case CLASS_CLIP_PATH:
                return new ClipPathShadowNode();
            case CLASS_DEFS:
                return new DefsShadowNode();
            case CLASS_USE:
                return new UseShadowNode();
            case CLASS_SYMBOL:
                return new SymbolShadowNode();
            case CLASS_LINEAR_GRADIENT:
                return new LinearGradientShadowNode();
            case CLASS_RADIAL_GRADIENT:
                return new RadialGradientShadowNode();
            default:
                throw new IllegalStateException("Unexpected type " + mClassName);
        }
    }

    @Override
    public Class<? extends LayoutShadowNode> getShadowNodeClass() {
        switch (mClassName) {
            case CLASS_GROUP:
                return GroupShadowNode.class;
            case CLASS_PATH:
                return PathShadowNode.class;
            case CLASS_CIRCLE:
                return CircleShadowNode.class;
            case CLASS_ELLIPSE:
                return EllipseShadowNode.class;
            case CLASS_LINE:
                return LineShadowNode.class;
            case CLASS_RECT:
                return RectShadowNode.class;
            case CLASS_TEXT:
                return TextShadowNode.class;
            case CLASS_TSPAN:
                return TSpanShadowNode.class;
            case CLASS_TEXT_PATH:
                return TextPathShadowNode.class;
            case CLASS_IMAGE:
                return ImageShadowNode.class;
            case CLASS_CLIP_PATH:
                return ClipPathShadowNode.class;
            case CLASS_DEFS:
                return DefsShadowNode.class;
            case CLASS_USE:
                return UseShadowNode.class;
            case CLASS_SYMBOL:
                return SymbolShadowNode.class;
            case CLASS_LINEAR_GRADIENT:
                return LinearGradientShadowNode.class;
            case CLASS_RADIAL_GRADIENT:
                return RadialGradientShadowNode.class;
            default:
                throw new IllegalStateException("Unexpected type " + mClassName);
        }
    }

    @ReactProp(name = "fill")
    public void setFill(RenderableView node, @Nullable ReadableArray fill) {
        ((RenderableShadowNode) node.getShadowNode()).setFill(fill);
    }

    @ReactProp(name = "fillOpacity", defaultFloat = 1f)
    public void setFillOpacity(RenderableView node, float opacity) {
        ((RenderableShadowNode) node.getShadowNode()).setFillOpacity(opacity);
    }

    @ReactProp(name = "fillRule", defaultInt = FILL_RULE_NONZERO)
    public void setFillRule(RenderableView node, int fillRule) {
        ((RenderableShadowNode) node.getShadowNode()).setFillRule(fillRule);
    }


    @ReactProp(name = "stroke")
    public void setStroke(RenderableView node, @Nullable ReadableArray strokeColors) {
        ((RenderableShadowNode) node.getShadowNode()).setStroke(strokeColors);
    }

    @ReactProp(name = "strokeOpacity", defaultFloat = 1f)
    public void setStrokeOpacity(RenderableView node, float strokeOpacity) {
        ((RenderableShadowNode) node.getShadowNode()).setStrokeOpacity(strokeOpacity);
    }

    @ReactProp(name = "strokeDasharray")
    public void setStrokeDasharray(RenderableView node, @Nullable ReadableArray strokeDasharray) {
        ((RenderableShadowNode) node.getShadowNode()).setStrokeDasharray(strokeDasharray);
    }

    @ReactProp(name = "strokeDashoffset")
    public void setStrokeDashoffset(RenderableView node, float strokeWidth) {
        ((RenderableShadowNode) node.getShadowNode()).setStrokeDashoffset(strokeWidth);
    }

    @ReactProp(name = "strokeWidth")
    public void setStrokeWidth(RenderableView node, String strokeWidth) {
        ((RenderableShadowNode) node.getShadowNode()).setStrokeWidth(strokeWidth);
    }

    @ReactProp(name = "strokeMiterlimit", defaultFloat = 4f)
    public void setStrokeMiterlimit(RenderableView node, float strokeMiterlimit) {
        ((RenderableShadowNode) node.getShadowNode()).setStrokeMiterlimit(strokeMiterlimit);
    }

    @ReactProp(name = "strokeLinecap", defaultInt = CAP_ROUND)
    public void setStrokeLinecap(RenderableView node, int strokeLinecap) {
        ((RenderableShadowNode) node.getShadowNode()).setStrokeLinecap(strokeLinecap);
    }

    @ReactProp(name = "strokeLinejoin", defaultInt = JOIN_ROUND)
    public void setStrokeLinejoin(RenderableView node, int strokeLinejoin) {
        ((RenderableShadowNode) node.getShadowNode()).setStrokeLinejoin(strokeLinejoin);
    }

    @ReactProp(name = "propList")
    public void setPropList(RenderableView node, @Nullable ReadableArray propList) {
        ((RenderableShadowNode) node.getShadowNode()).setPropList(propList);
    }

    /**
     * Callback that will be triggered after all properties are updated in current update transaction
     * (all @ReactProp handlers for properties updated in current transaction have been called). If
     * you want to override this method you should call super.onAfterUpdateTransaction from it as
     * the parent class of the ViewManager may rely on callback being executed.
     */
    protected void onAfterUpdateTransaction(RenderableView node) {
        super.onAfterUpdateTransaction(node);
        VirtualNode shadow = node.getShadowNode();
        SvgViewShadowNode view = shadow.getSvgShadowNode();
        if (view != null) view.drawOutput();
    }

    @Override
    protected RenderableView createViewInstance(ThemedReactContext reactContext) {
        return new RenderableView(reactContext);
    }

    @Override
    public void updateExtraData(RenderableView root, Object extraData) {
        throw new IllegalStateException("SVG elements does not map into a native view");
    }

    private static final SparseArray<VirtualNode> mTagToShadowNode = new SparseArray<>();

    @Override
    public void onDropViewInstance(RenderableView view) {
        mTagToShadowNode.remove(view.getId());
        view.dropView();
    }

    static void setShadowNode(VirtualNode virtualNode) {
        mTagToShadowNode.put(virtualNode.getReactTag(), virtualNode);
    }

    static VirtualNode getShadowNodeByTag(int id) {
        return mTagToShadowNode.get(id);
    }
}
