/*
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.horcrux.svg;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.graphics.DashPathEffect;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.Region;
import android.view.ViewParent;
import com.facebook.react.bridge.ColorPropConverter;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.JavaOnlyArray;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.touch.ReactHitSlopView;
import com.facebook.react.uimanager.PointerEvents;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.annotation.Nullable;

@SuppressWarnings({"WeakerAccess", "RedundantSuppression"})
public abstract class RenderableView extends VirtualView implements ReactHitSlopView {

  RenderableView(ReactContext reactContext) {
    super(reactContext);
    setPivotX(0);
    setPivotY(0);
  }

  static RenderableView contextElement;
  // strokeLinecap
  private static final int CAP_BUTT = 0;
  static final int CAP_ROUND = 1;
  private static final int CAP_SQUARE = 2;

  // strokeLinejoin
  private static final int JOIN_BEVEL = 2;
  private static final int JOIN_MITER = 0;
  static final int JOIN_ROUND = 1;

  // fillRule
  private static final int FILL_RULE_EVENODD = 0;
  static final int FILL_RULE_NONZERO = 1;

  // vectorEffect
  private static final int VECTOR_EFFECT_DEFAULT = 0;
  private static final int VECTOR_EFFECT_NON_SCALING_STROKE = 1;
  // static final int VECTOR_EFFECT_INHERIT = 2;
  // static final int VECTOR_EFFECT_URI = 3;

  /*
  Used in mergeProperties, keep public
  */

  public int vectorEffect = VECTOR_EFFECT_DEFAULT;
  public @Nullable ReadableArray stroke;
  public @Nullable SVGLength[] strokeDasharray;

  public SVGLength strokeWidth = new SVGLength(1);
  public float strokeOpacity = 1;
  public float strokeMiterlimit = 4;
  public float strokeDashoffset = 0;

  public Paint.Cap strokeLinecap = Paint.Cap.BUTT;
  public Paint.Join strokeLinejoin = Paint.Join.MITER;

  private int mCurrentColor = 0;
  public @Nullable ReadableArray fill;
  public float fillOpacity = 1;
  public Path.FillType fillRule = Path.FillType.WINDING;

  /*
  End merged properties
  */
  private @Nullable ArrayList<String> mLastMergedList;
  private @Nullable ArrayList<Object> mOriginProperties;
  private @Nullable ArrayList<String> mPropList;
  private @Nullable ArrayList<String> mAttributeList;
  private @Nullable RenderableView mCaller;

  @Nullable String mFilter;

  private static final Pattern regex = Pattern.compile("[0-9.-]+");

  @Nullable
  public Rect getHitSlopRect() {
    /*
     * In order to make the isTouchPointInView fail we need to return a very improbable Rect for the View
     * This way an SVG with box_none carrying its last descendent with box_none will have the expected behavior of just having events on the actual painted area
     */
    if (mPointerEvents == PointerEvents.BOX_NONE) {
      return new Rect(Integer.MIN_VALUE, Integer.MIN_VALUE, Integer.MIN_VALUE, Integer.MIN_VALUE);
    }
    return null;
  }

  @Override
  public void setId(int id) {
    super.setId(id);
    RenderableViewManager.setRenderableView(id, this);
  }

  public void setVectorEffect(int vectorEffect) {
    this.vectorEffect = vectorEffect;
    invalidate();
  }

  public void setCurrentColor(Integer color) {
    mCurrentColor = color != null ? color : 0;
    invalidate();
    clearChildCache();
  }

  int getCurrentColor() {
    if (this.mCurrentColor != 0) {
      return this.mCurrentColor;
    }
    if (this.mCaller != null) {
      return this.mCaller.getCurrentColor();
    }
    ViewParent parent = this.getParent();
    if (parent instanceof VirtualView) {
      return ((RenderableView) parent).getCurrentColor();
    } else if (parent instanceof SvgView) {
      return ((SvgView) parent).mCurrentColor;
    }
    return 0;
  }

  public void setFill(@Nullable Dynamic fill) {
    if (fill == null || fill.isNull()) {
      this.fill = null;
      invalidate();
      return;
    }

    ReadableType fillType = fill.getType();
    if (fillType.equals(ReadableType.Map)) {
      ReadableMap fillMap = fill.asMap();
      setFill(fillMap);
      return;
    }

    // This code will probably never be reached with current changes
    if (fillType.equals(ReadableType.Number)) {
      this.fill = JavaOnlyArray.of(0, fill.asInt());
    } else if (fillType.equals(ReadableType.Array)) {
      this.fill = fill.asArray();
    } else {
      JavaOnlyArray arr = new JavaOnlyArray();
      arr.pushInt(0);
      Matcher m = regex.matcher(fill.asString());
      int i = 0;
      while (m.find()) {
        double parsed = Double.parseDouble(m.group());
        arr.pushDouble(i++ < 3 ? parsed / 255 : parsed);
      }
      this.fill = arr;
    }
    invalidate();
  }

  public void setFill(ReadableMap fill) {
    if (fill == null) {
      this.fill = null;
      invalidate();
      return;
    }
    int type = fill.getInt("type");
    if (type == 0) {
      ReadableType valueType = fill.getType("payload");
      if (valueType.equals(ReadableType.Number)) {
        this.fill = JavaOnlyArray.of(0, fill.getInt("payload"));
      } else if (valueType.equals(ReadableType.Map)) {
        this.fill = JavaOnlyArray.of(0, fill.getMap("payload"));
      }
    } else if (type == 1) {
      this.fill = JavaOnlyArray.of(1, fill.getString("brushRef"));
    } else {
      this.fill = JavaOnlyArray.of(type);
    }
    invalidate();
  }

  public void setFillOpacity(@Nullable Dynamic fillOpacity) {
    if (fillOpacity == null || fillOpacity.isNull()) {
      this.fillOpacity = 1f;
      invalidate();
      return;
    }
    ReadableType opacityType = fillOpacity.getType();
    if (opacityType == ReadableType.Number) {
      this.fillOpacity = (float) fillOpacity.asDouble();
    } else if (opacityType == ReadableType.String) {
      this.fillOpacity = Float.parseFloat(fillOpacity.asString().replace("%", "")) / 100f;
    }
    invalidate();
  }

 public void setFillOpacity(float fillOpacity) {
   this.fillOpacity = fillOpacity;
   invalidate();
 }

 public void setFillOpacity(String fillOpacity) {
   this.fillOpacity = Float.parseFloat(fillOpacity.replace("%", "")) / 100f;
   invalidate();
 }

  public void setFillRule(int fillRule) {
    switch (fillRule) {
      case FILL_RULE_EVENODD:
        this.fillRule = Path.FillType.EVEN_ODD;
        break;
      case FILL_RULE_NONZERO:
        break;
      default:
        throw new JSApplicationIllegalArgumentException("fillRule " + fillRule + " unrecognized");
    }

    invalidate();
  }

  public void setStroke(@Nullable Dynamic strokeColors) {
    if (strokeColors == null || strokeColors.isNull()) {
      stroke = null;
      invalidate();
      return;
    }

    ReadableType strokeType = strokeColors.getType();
    if (strokeType.equals(ReadableType.Map)) {
      ReadableMap strokeMap = strokeColors.asMap();
      setStroke(strokeMap);
      return;
    }

    // This code will probably never be reached with current changes
    ReadableType type = strokeColors.getType();
    if (type.equals(ReadableType.Number)) {
      stroke = JavaOnlyArray.of(0, strokeColors.asInt());
    } else if (type.equals(ReadableType.Array)) {
      stroke = strokeColors.asArray();
    } else {
      JavaOnlyArray arr = new JavaOnlyArray();
      arr.pushInt(0);
      Matcher m = regex.matcher(strokeColors.asString());
      int i = 0;
      while (m.find()) {
        double parsed = Double.parseDouble(m.group());
        arr.pushDouble(i++ < 3 ? parsed / 255 : parsed);
      }
      stroke = arr;
    }
    invalidate();
  }

  public void setStroke(@Nullable ReadableMap stroke) {
    if (stroke == null) {
      this.stroke = null;
      invalidate();
      return;
    }
    int type = stroke.getInt("type");
    if (type == 0) {
      ReadableType payloadType = stroke.getType("payload");
      if (payloadType.equals(ReadableType.Number)) {
        this.stroke = JavaOnlyArray.of(0, stroke.getInt("payload"));
      } else if (payloadType.equals(ReadableType.Map)) {
        this.stroke = JavaOnlyArray.of(0, stroke.getMap("payload"));
      }
    } else if (type == 1) {
      this.stroke = JavaOnlyArray.of(1, stroke.getString("brushRef"));
    } else {
      this.stroke = JavaOnlyArray.of(type);
    }
    invalidate();
  }

  public void setStrokeOpacity(@Nullable Dynamic strokeOpacity) {
    if (strokeOpacity == null || strokeOpacity.isNull()) {
      this.strokeOpacity = 1f;
      invalidate();
      return;
    }
    ReadableType opacityType = strokeOpacity.getType();
    if (opacityType == ReadableType.Number) {
      this.strokeOpacity = (float) strokeOpacity.asDouble();
    } else if (opacityType == ReadableType.String) {
      this.strokeOpacity = Float.parseFloat(strokeOpacity.asString().replace("%", "")) / 100f;
    }
    invalidate();
  }
  public void setStrokeOpacity(float strokeOpacity) {
    this.strokeOpacity = strokeOpacity;
    invalidate();
  }
  public void setStrokeOpacity(String strokeOpacity) {
    this.strokeOpacity = Float.parseFloat(strokeOpacity.replace("%", "")) / 100f;
    invalidate();
  }

  public void setStrokeDasharray(Dynamic dynamicStrokeDasharray) {
    ArrayList<SVGLength> arrayList = SVGLength.arrayFrom(dynamicStrokeDasharray);
    if (arrayList != null) {
      if (arrayList.size() % 2 == 1) {
        arrayList.addAll(arrayList);
      }
      this.strokeDasharray = arrayList.toArray(new SVGLength[0]);
    } else {
      this.strokeDasharray = null;
    }
    invalidate();
  }

  public void setStrokeDashoffset(float strokeDashoffset) {
    this.strokeDashoffset = strokeDashoffset * mScale;
    invalidate();
  }

  public void setStrokeWidth(Dynamic strokeWidth) {
    this.strokeWidth = strokeWidth.isNull() ? new SVGLength(1) : SVGLength.from(strokeWidth);
    invalidate();
  }

  public void setStrokeMiterlimit(float strokeMiterlimit) {
    this.strokeMiterlimit = strokeMiterlimit;
    invalidate();
  }

  public void setStrokeLinecap(int strokeLinecap) {
    switch (strokeLinecap) {
      case CAP_BUTT:
        this.strokeLinecap = Paint.Cap.BUTT;
        break;
      case CAP_SQUARE:
        this.strokeLinecap = Paint.Cap.SQUARE;
        break;
      case CAP_ROUND:
        this.strokeLinecap = Paint.Cap.ROUND;
        break;
      default:
        throw new JSApplicationIllegalArgumentException(
            "strokeLinecap " + strokeLinecap + " unrecognized");
    }
    invalidate();
  }

  public void setStrokeLinejoin(int strokeLinejoin) {
    switch (strokeLinejoin) {
      case JOIN_MITER:
        this.strokeLinejoin = Paint.Join.MITER;
        break;
      case JOIN_BEVEL:
        this.strokeLinejoin = Paint.Join.BEVEL;
        break;
      case JOIN_ROUND:
        this.strokeLinejoin = Paint.Join.ROUND;
        break;
      default:
        throw new JSApplicationIllegalArgumentException(
            "strokeLinejoin " + strokeLinejoin + " unrecognized");
    }
    invalidate();
  }

  public void setPropList(@Nullable ReadableArray propList) {
    if (propList != null) {
      mPropList = mAttributeList = new ArrayList<>();
      for (int i = 0; i < propList.size(); i++) {
        mPropList.add(propList.getString(i));
      }
    }

    invalidate();
  }

  public void setFilter(String filter) {
    mFilter = filter;
    invalidate();
  }

  void render(Canvas canvas, Paint paint, float opacity) {
    MaskView mask = null;
    FilterView filter = null;

    if (mMask != null) {
      SvgView root = getSvgView();
      mask = (MaskView) root.getDefinedMask(mMask);
    }
    if (mFilter != null) {
      SvgView root = getSvgView();
      filter = (FilterView) root.getDefinedFilter(mFilter);
    }

    if (mask != null || filter != null) {
      if (filter != null) {
        Paint bitmapPaint = new Paint(Paint.FILTER_BITMAP_FLAG);
        canvas.saveLayer(null, bitmapPaint);

        Bitmap backgroundBitmap = this.getSvgView().getCurrentBitmap();

        // draw element to self bitmap
        Bitmap elementBitmap =
            Bitmap.createBitmap(canvas.getWidth(), canvas.getHeight(), Bitmap.Config.ARGB_8888);
        Canvas elementCanvas = new Canvas(elementBitmap);
        elementCanvas.setMatrix(canvas.getMatrix());

        draw(elementCanvas, paint, opacity);

        // get renderableBounds
        this.initBounds();
        RectF clientRect = this.getClientRect();
        if (this instanceof ImageView && clientRect == null) {
          return;
        }
        // apply filters
        elementBitmap = filter.applyFilter(elementBitmap, backgroundBitmap, clientRect);

        // draw bitmap 1:1 to canvas
        int saveCount = canvas.save();
        canvas.setMatrix(null);
        canvas.drawBitmap(elementBitmap, 0, 0, bitmapPaint);
        canvas.restoreToCount(saveCount);
      } else {
        canvas.saveLayer(null, new Paint());
        draw(canvas, paint, opacity);
      }

      if (mask != null) {
        // https://www.w3.org/TR/SVG11/masking.html
        // Adding a mask involves several steps
        // 1. applying luminanceToAlpha to the mask element
        // 2. merging the alpha channel of the element with the alpha channel from the previous step
        // 3. applying the result from step 2 to the target element

        Paint dstInPaint = new Paint();
        dstInPaint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.DST_IN));

        // prepare step 3 - combined layer
        canvas.saveLayer(null, dstInPaint);

        if (mask.getMaskType() == MaskView.MaskType.LUMINANCE) {
          // step 1 - luminance layer
          // prepare maskPaint with luminanceToAlpha
          // https://www.w3.org/TR/SVG11/filters.html#InterfaceSVGFEMergeElement:~:text=not%20applicable.%20A-,luminanceToAlpha,-operation%20is%20equivalent
          Paint luminancePaint = new Paint();
          ColorMatrix luminanceToAlpha =
              new ColorMatrix(
                  new float[] {
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2125f, 0.7154f, 0.0721f, 0, 0
                  });
          luminancePaint.setColorFilter(new ColorMatrixColorFilter(luminanceToAlpha));
          canvas.saveLayer(null, luminancePaint);
        } else {
          canvas.saveLayer(null, paint);
        }

        // calculate mask bounds
        RectF maskBounds;
        if (mask.getMaskUnits() == Brush.BrushUnits.USER_SPACE_ON_USE) {
          float maskX = (float) relativeOnWidth(mask.mX);
          float maskY = (float) relativeOnHeight(mask.mY);
          float maskWidth = (float) relativeOnWidth(mask.mW);
          float maskHeight = (float) relativeOnHeight(mask.mH);
          maskBounds = new RectF(maskX, maskY, maskX + maskWidth, maskY + maskHeight);
        } else { // Brush.BrushUnits.OBJECT_BOUNDING_BOX
          RectF clientRect = this.getClientRect();
          if (this instanceof ImageView && clientRect == null) {
            return;
          }
          mInvCTM.mapRect(clientRect);
          float maskX = (float) relativeOnFraction(mask.mX, clientRect.width());
          float maskY = (float) relativeOnFraction(mask.mY, clientRect.height());
          float maskWidth = (float) relativeOnFraction(mask.mW, clientRect.width());
          float maskHeight = (float) relativeOnFraction(mask.mH, clientRect.height());
          maskBounds =
              new RectF(
                  clientRect.left + maskX,
                  clientRect.top + maskY,
                  clientRect.left + maskX + maskWidth,
                  clientRect.top + maskY + maskHeight);
        }
        // clip to mask bounds
        canvas.clipRect(maskBounds);

        mask.draw(canvas, paint, 1f);

        // close luminance layer
        canvas.restore();

        // step 2 - alpha layer
        canvas.saveLayer(null, dstInPaint);
        // clip to mask bounds
        canvas.clipRect(maskBounds);

        mask.draw(canvas, paint, 1f);

        // close alpha layer
        canvas.restore();

        // close combined layer
        canvas.restore();
      }
      // close element layer
      canvas.restore();
    } else {
      draw(canvas, paint, opacity);
    }
  }

  @Override
  void draw(Canvas canvas, Paint paint, float opacity) {
    opacity *= mOpacity;

    boolean computePaths = mPath == null;
    if (computePaths) {
      mPath = getPath(canvas, paint);
      mPath.setFillType(fillRule);
    }
    boolean nonScalingStroke = vectorEffect == VECTOR_EFFECT_NON_SCALING_STROKE;
    Path path = mPath;
    if (nonScalingStroke) {
      Path scaled = new Path();
      //noinspection deprecation
      mPath.transform(mCTM, scaled);
      canvas.setMatrix(null);
      path = scaled;
    }

    if (computePaths || path != mPath) {
      mBox = new RectF();
      path.computeBounds(mBox, true);
    }

    RectF clientRect = new RectF(mBox);
    mCTM.mapRect(clientRect);
    this.setClientRect(clientRect);

    clip(canvas, paint);

    if (setupFillPaint(paint, opacity * fillOpacity)) {
      if (computePaths) {
        mFillPath = new Path();
        paint.getFillPath(path, mFillPath);
      }
      canvas.drawPath(path, paint);
    }
    if (setupStrokePaint(paint, opacity * strokeOpacity)) {
      if (computePaths) {
        mStrokePath = new Path();
        paint.getFillPath(path, mStrokePath);
      }
      canvas.drawPath(path, paint);
    }
    renderMarkers(canvas, paint, opacity);
  }

  void renderMarkers(Canvas canvas, Paint paint, float opacity) {
    MarkerView markerStart = (MarkerView) getSvgView().getDefinedMarker(mMarkerStart);
    MarkerView markerMid = (MarkerView) getSvgView().getDefinedMarker(mMarkerMid);
    MarkerView markerEnd = (MarkerView) getSvgView().getDefinedMarker(mMarkerEnd);
    if (elements != null && (markerStart != null || markerMid != null || markerEnd != null)) {
      contextElement = this;
      ArrayList<RNSVGMarkerPosition> positions = RNSVGMarkerPosition.fromPath(elements);
      float width = (float) (this.strokeWidth != null ? relativeOnOther(this.strokeWidth) : 1);
      mMarkerPath = new Path();
      for (RNSVGMarkerPosition position : positions) {
        RNSVGMarkerType type = position.type;
        MarkerView marker = null;
        switch (type) {
          case kStartMarker:
            marker = markerStart;
            break;

          case kMidMarker:
            marker = markerMid;
            break;

          case kEndMarker:
            marker = markerEnd;
            break;
        }
        if (marker == null) {
          continue;
        }
        marker.renderMarker(canvas, paint, opacity, position, width);
        Matrix transform = marker.markerTransform;
        mMarkerPath.addPath(marker.getPath(canvas, paint), transform);
      }
      contextElement = null;
    }
  }

  /**
   * Sets up paint according to the props set on a view. Returns {@code true} if the fill should be
   * drawn, {@code false} if not.
   */
  boolean setupFillPaint(Paint paint, float opacity) {
    if (fill != null && fill.size() > 0) {
      paint.reset();
      paint.setFlags(Paint.ANTI_ALIAS_FLAG | Paint.DEV_KERN_TEXT_FLAG | Paint.SUBPIXEL_TEXT_FLAG);
      paint.setStyle(Paint.Style.FILL);
      setupPaint(paint, opacity, fill);
      return true;
    }
    return false;
  }

  /**
   * Sets up paint according to the props set on a view. Returns {@code true} if the stroke should
   * be drawn, {@code false} if not.
   */
  boolean setupStrokePaint(Paint paint, float opacity) {
    paint.reset();
    double strokeWidth = relativeOnOther(this.strokeWidth);
    if (strokeWidth == 0 || stroke == null || stroke.size() == 0) {
      return false;
    }

    paint.setFlags(Paint.ANTI_ALIAS_FLAG | Paint.DEV_KERN_TEXT_FLAG | Paint.SUBPIXEL_TEXT_FLAG);
    paint.setStyle(Paint.Style.STROKE);
    paint.setStrokeCap(strokeLinecap);
    paint.setStrokeJoin(strokeLinejoin);
    paint.setStrokeMiter(strokeMiterlimit * mScale);
    paint.setStrokeWidth((float) strokeWidth);
    setupPaint(paint, opacity, stroke);

    if (strokeDasharray != null) {
      int length = strokeDasharray.length;
      float[] intervals = new float[length];
      for (int i = 0; i < length; i++) {
        intervals[i] = (float) relativeOnOther(strokeDasharray[i]);
      }
      paint.setPathEffect(new DashPathEffect(intervals, strokeDashoffset));
    }

    return true;
  }

  private void setupPaint(Paint paint, float opacity, ReadableArray colors) {
    int colorType = colors.getInt(0);
    switch (colorType) {
      case 0:
        if (colors.size() == 2) {
          int color;
          if (colors.getType(1) == ReadableType.Map) {
            color = ColorPropConverter.getColor(colors.getMap(1), getContext());
          } else {
            color = colors.getInt(1);
          }
          int alpha = color >>> 24;
          int combined = Math.round((float) alpha * opacity);
          paint.setColor(combined << 24 | (color & 0x00ffffff));
        } else {
          // solid color
          paint.setARGB(
              (int) (colors.size() > 4 ? colors.getDouble(4) * opacity * 255 : opacity * 255),
              (int) (colors.getDouble(1) * 255),
              (int) (colors.getDouble(2) * 255),
              (int) (colors.getDouble(3) * 255));
        }
        break;
      case 1:
        {
          Brush brush = getSvgView().getDefinedBrush(colors.getString(1));
          if (brush != null) {
            brush.setupPaint(paint, mBox, mScale, opacity);
          }
          break;
        }
      case 2:
        {
          int color = this.getCurrentColor();
          int alpha = color >>> 24;
          alpha = Math.round((float) alpha * opacity);
          paint.setColor(alpha << 24 | (color & 0x00ffffff));
          break;
        }
      case 3:
        {
          if (contextElement != null && contextElement.fill != null) {
            setupPaint(paint, opacity, contextElement.fill);
          }
          break;
        }
      case 4:
        {
          if (contextElement != null && contextElement.stroke != null) {
            setupPaint(paint, opacity, contextElement.stroke);
          }
          break;
        }
    }
  }

  abstract Path getPath(Canvas canvas, Paint paint);

  @Override
  int hitTest(final float[] src) {
    if (mPath == null || !mInvertible) {
      return -1;
    }

    if (mPointerEvents == PointerEvents.NONE) {
      return -1;
    }

    float[] dst = new float[2];
    mInvMatrix.mapPoints(dst, src);
    mInvTransform.mapPoints(dst);
    int x = Math.round(dst[0]);
    int y = Math.round(dst[1]);

    initBounds();

    if ((mRegion == null || !mRegion.contains(x, y))
        && (mStrokeRegion == null
            || !mStrokeRegion.contains(x, y)
                && (mMarkerRegion == null || !mMarkerRegion.contains(x, y)))) {
      return -1;
    }

    Path clipPath = getClipPath();
    if (clipPath != null) {
      if (!mClipRegion.contains(x, y)) {
        return -1;
      }
    }

    return getId();
  }

  void initBounds() {
    if (mRegion == null && mFillPath != null) {
      mFillBounds = new RectF();
      mFillPath.computeBounds(mFillBounds, true);
      mRegion = getRegion(mFillPath, mFillBounds);
    }
    if (mRegion == null && mPath != null) {
      mFillBounds = new RectF();
      mPath.computeBounds(mFillBounds, true);
      mRegion = getRegion(mPath, mFillBounds);
    }
    if (mStrokeRegion == null && mStrokePath != null) {
      mStrokeBounds = new RectF();
      mStrokePath.computeBounds(mStrokeBounds, true);
      mStrokeRegion = getRegion(mStrokePath, mStrokeBounds);
    }
    if (mMarkerRegion == null && mMarkerPath != null) {
      mMarkerBounds = new RectF();
      mMarkerPath.computeBounds(mMarkerBounds, true);
      mMarkerRegion = getRegion(mMarkerPath, mMarkerBounds);
    }
    Path clipPath = getClipPath();
    if (clipPath != null) {
      if (mClipRegionPath != clipPath) {
        mClipRegionPath = clipPath;
        mClipBounds = new RectF();
        clipPath.computeBounds(mClipBounds, true);
        mClipRegion = getRegion(clipPath, mClipBounds);
      }
    }
  }

  Region getRegion(Path path, RectF rectF) {
    Region region = new Region();
    region.setPath(
        path,
        new Region(
            (int) Math.floor(rectF.left),
            (int) Math.floor(rectF.top),
            (int) Math.ceil(rectF.right),
            (int) Math.ceil(rectF.bottom)));

    return region;
  }

  private ArrayList<String> getAttributeList() {
    return mAttributeList;
  }

  void mergeProperties(RenderableView target) {
    mCaller = target;
    ArrayList<String> targetAttributeList = target.getAttributeList();

    if (targetAttributeList == null || targetAttributeList.size() == 0) {
      return;
    }

    mOriginProperties = new ArrayList<>();
    mAttributeList = mPropList == null ? new ArrayList<String>() : new ArrayList<>(mPropList);

    for (int i = 0, size = targetAttributeList.size(); i < size; i++) {
      try {
        String fieldName = targetAttributeList.get(i);
        Field field = getClass().getField(fieldName);
        Object value = field.get(target);
        mOriginProperties.add(field.get(this));

        if (!hasOwnProperty(fieldName)) {
          mAttributeList.add(fieldName);
          field.set(this, value);
        }
      } catch (Exception e) {
        throw new IllegalStateException(e);
      }
    }

    mLastMergedList = targetAttributeList;
  }

  void resetProperties() {
    if (mLastMergedList != null && mOriginProperties != null) {
      try {
        for (int i = mLastMergedList.size() - 1; i >= 0; i--) {
          Field field = getClass().getField(mLastMergedList.get(i));
          field.set(this, mOriginProperties.get(i));
        }
      } catch (Exception e) {
        throw new IllegalStateException(e);
      }

      mLastMergedList = null;
      mOriginProperties = null;
      mAttributeList = mPropList;
      mCaller = null;
    }
  }

  private boolean hasOwnProperty(String propName) {
    return mAttributeList != null && mAttributeList.contains(propName);
  }
}
