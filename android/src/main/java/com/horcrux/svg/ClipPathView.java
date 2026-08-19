/*
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.horcrux.svg;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.view.View;
import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.common.ReactConstants;

@SuppressLint("ViewConstructor")
class ClipPathView extends GroupView {

  // Strategy for rendering clipPath: fast path (single path) or mask (bitmap compositing)
  private static final int STRATEGY_UNKNOWN = 0;
  private static final int STRATEGY_FAST = 1;
  private static final int STRATEGY_MASK = 2;

  private static final int CLIP_RULE_UNCACHED = -2;

  // O(n²) overlap check threshold - assume overlap for larger child counts to avoid UI thread stall
  private static final int MAX_OVERLAP_CHECK_CHILDREN = 100;

  // Max logical dimension (pre-scale) - reject malformed SVGs that would cause OOM
  private static final float MAX_LOGICAL_DIMENSION = 100000f;

  // Max bitmap dimension - 2048x2048 grayscale = 4MB, balances quality vs memory
  private static final int MAX_BITMAP_DIMENSION = 2048;

  private int mClipPathStrategy = STRATEGY_UNKNOWN;
  private int mCachedUniformClipRule = CLIP_RULE_UNCACHED;
  private Bitmap mCachedMask;
  private RectF mCachedMaskBounds;

  public ClipPathView(ReactContext reactContext) {
    super(reactContext);
  }

  /**
   * Get uniform clipRule from children. Returns the clipRule if all children have the same rule, or
   * -1 if children have mixed rules.
   */
  int getUniformClipRule() {
    if (mCachedUniformClipRule != CLIP_RULE_UNCACHED) {
      return mCachedUniformClipRule;
    }

    int uniformRule = VirtualView.CLIP_RULE_MIXED;
    for (int i = 0; i < getChildCount(); i++) {
      android.view.View child = getChildAt(i);
      if (child instanceof VirtualView && !(child instanceof MaskView)) {
        VirtualView node = (VirtualView) child;
        if (uniformRule == VirtualView.CLIP_RULE_MIXED) {
          uniformRule = node.mClipRule;
        } else if (node.mClipRule != uniformRule) {
          mCachedUniformClipRule = VirtualView.CLIP_RULE_MIXED;
          return VirtualView.CLIP_RULE_MIXED;
        }
      }
    }
    mCachedUniformClipRule = uniformRule;
    return uniformRule;
  }

  /**
   * Determines whether to use fast path (single combined path) or mask-based rendering. Fast path:
   * single child, or non-overlapping children with uniform clipRule. Mask path: overlapping
   * children or mixed clipRules (per SVG spec, children always union).
   *
   * <p>Note: Unlike iOS which passes CGContextRef for context-dependent checks, Android handles
   * context-dependent cases (e.g., TextView) by hardcoding exceptions in hasOverlappingChildren().
   * This avoids requiring a Canvas parameter for what is primarily a structural check. Functional
   * behavior is identical across platforms.
   */
  boolean canUseFastPath() {
    if (mClipPathStrategy != STRATEGY_UNKNOWN) {
      return mClipPathStrategy == STRATEGY_FAST;
    }

    int childCount = getChildCount();
    boolean isSimple = (childCount == 1) && !(getChildAt(0) instanceof GroupView);
    boolean hasOverlap = !isSimple && hasOverlappingChildren();
    boolean isUniform = getUniformClipRule() != VirtualView.CLIP_RULE_MIXED;

    boolean canUseFast = (isSimple || !hasOverlap) && isUniform;
    mClipPathStrategy = canUseFast ? STRATEGY_FAST : STRATEGY_MASK;
    return canUseFast;
  }

  /** Recursively checks if view or any descendant is a TextView (requires Canvas for getPath). */
  private boolean containsTextView(View view) {
    if (view instanceof TextView) {
      return true;
    }
    if (view instanceof GroupView) {
      GroupView group = (GroupView) view;
      for (int i = 0; i < group.getChildCount(); i++) {
        if (containsTextView(group.getChildAt(i))) {
          return true;
        }
      }
    }
    return false;
  }

  /** O(n²) pairwise bounding box overlap check. Acceptable for typical clipPaths (<20 children). */
  private boolean hasOverlappingChildren() {
    int childCount = getChildCount();
    if (childCount <= 1) {
      return false;
    }

    // Collect bounds for all children
    RectF[] bounds = new RectF[childCount];
    int validCount = 0;

    for (int i = 0; i < childCount; i++) {
      View child = getChildAt(i);
      if (child instanceof VirtualView && !(child instanceof MaskView)) {
        VirtualView node = (VirtualView) child;
        // Text nodes require Canvas context (setupGlyphContext calls canvas.getClipBounds)
        // Check recursively since Groups may contain nested Text
        if (containsTextView(node)) {
          return true; // Assume overlap for text, use mask path
        }
        Path path = node.getPath(null, null);
        if (path != null) {
          RectF childBounds = new RectF();
          path.computeBounds(childBounds, true);
          // Apply child's transform
          if (node.mMatrix != null) {
            node.mMatrix.mapRect(childBounds);
          }
          bounds[validCount++] = childBounds;
        }
      }
    }

    // Guard against pathological cases - assume overlap for large child counts
    if (validCount > MAX_OVERLAP_CHECK_CHILDREN) {
      return true;
    }

    // O(n²) pairwise intersection check
    for (int i = 0; i < validCount; i++) {
      for (int j = i + 1; j < validCount; j++) {
        if (RectF.intersects(bounds[i], bounds[j])) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Creates a grayscale bitmap mask for complex clipPaths (overlapping children or mixed
   * clipRules). Each child is rendered with white using its own clipRule (evenodd/nonzero). White
   * fills naturally union via source-over compositing.
   *
   * <p>The bitmap is cached and reused until invalidate() is called. Caller must NOT recycle the
   * returned bitmap - ClipPathView owns its lifecycle.
   *
   * @param canvas Parent canvas (for context, not drawn to)
   * @param paint Paint to use for path operations
   * @param outBounds Output: bounds of the mask in parent coordinates
   * @return Bitmap mask, or null if empty.
   */
  Bitmap createMask(Canvas canvas, Paint paint, RectF outBounds) {
    // Return cached mask if available
    if (mCachedMask != null && mCachedMaskBounds != null) {
      if (outBounds != null) {
        outBounds.set(mCachedMaskBounds);
      }
      return mCachedMask;
    }
    // Calculate bounds of all children in clipPath coordinate space
    RectF clipBounds = new RectF();

    for (int i = 0; i < getChildCount(); i++) {
      View child = getChildAt(i);
      if (child instanceof VirtualView && !(child instanceof MaskView)) {
        VirtualView node = (VirtualView) child;
        Path path = node.getPath(canvas, paint);
        if (path != null) {
          RectF childBounds = new RectF();
          path.computeBounds(childBounds, true);
          // Apply child's transform
          if (node.mMatrix != null) {
            node.mMatrix.mapRect(childBounds);
          }
          clipBounds.union(childBounds);
        }
      }
    }

    // Apply clipPath's own transform
    if (mMatrix != null) {
      mMatrix.mapRect(clipBounds);
    }

    if (outBounds != null) {
      outBounds.set(clipBounds);
    }

    if (clipBounds.isEmpty()) {
      FLog.w(ReactConstants.TAG, "RNSVG: ClipPath bounds are empty, element will be fully clipped");
      return null;
    }

    // Reject absurdly large bounds (likely malformed SVG, would cause OOM or overflow)
    if (clipBounds.width() > MAX_LOGICAL_DIMENSION || clipBounds.height() > MAX_LOGICAL_DIMENSION) {
      FLog.w(ReactConstants.TAG, "RNSVG: ClipPath bounds too large, element will be fully clipped");
      return null;
    }

    // Account for screen density to avoid blocky edges on high-DPI displays
    float screenScale = getResources().getDisplayMetrics().density;

    // Limit to MAX_BITMAP_DIMENSION max dimension (~4MB grayscale)
    int width = (int) Math.ceil(clipBounds.width() * screenScale);
    int height = (int) Math.ceil(clipBounds.height() * screenScale);
    float scale = screenScale;

    if (width > MAX_BITMAP_DIMENSION || height > MAX_BITMAP_DIMENSION) {
      float scaleX = (float) MAX_BITMAP_DIMENSION / width;
      float scaleY = (float) MAX_BITMAP_DIMENSION / height;
      scale = screenScale * Math.min(scaleX, scaleY);
      width = (int) Math.ceil(clipBounds.width() * scale);
      height = (int) Math.ceil(clipBounds.height() * scale);
    }

    if (width <= 0 || height <= 0) {
      FLog.w(
          ReactConstants.TAG,
          "RNSVG: ClipPath mask dimensions invalid (%dx%d), element will be fully clipped",
          width,
          height);
      return null;
    }

    // Create alpha-only bitmap for mask
    Bitmap mask;
    try {
      mask = Bitmap.createBitmap(width, height, Bitmap.Config.ALPHA_8);
    } catch (OutOfMemoryError e) {
      FLog.e(
          ReactConstants.TAG,
          "RNSVG: Failed to allocate ClipPath mask bitmap (%dx%d): out of memory",
          width,
          height);
      return null;
    }
    Canvas maskCanvas = new Canvas(mask);

    // Set up coordinate system: scale and translate so clipBounds maps to bitmap
    maskCanvas.scale(scale, scale);
    maskCanvas.translate(-clipBounds.left, -clipBounds.top);

    // Render each child with white, using its clipRule
    Paint fillPaint = new Paint();
    fillPaint.setColor(Color.WHITE);
    fillPaint.setStyle(Paint.Style.FILL);
    fillPaint.setAntiAlias(true);

    for (int i = 0; i < getChildCount(); i++) {
      View child = getChildAt(i);
      if (child instanceof VirtualView && !(child instanceof MaskView)) {
        VirtualView node = (VirtualView) child;
        Path path = node.getPath(canvas, paint);
        if (path != null) {
          maskCanvas.save();

          // Apply clipPath's transform, then child's transform
          if (mMatrix != null) {
            maskCanvas.concat(mMatrix);
          }
          if (node.mMatrix != null) {
            maskCanvas.concat(node.mMatrix);
          }

          // Set fill type based on child's clipRule
          Path.FillType fillType =
              (node.mClipRule == VirtualView.CLIP_RULE_EVENODD)
                  ? Path.FillType.EVEN_ODD
                  : Path.FillType.WINDING;
          path.setFillType(fillType);

          maskCanvas.drawPath(path, fillPaint);
          maskCanvas.restore();
        }
      }
    }

    // Cache the mask for reuse until invalidate() is called
    mCachedMask = mask;
    mCachedMaskBounds = new RectF(clipBounds);

    return mask;
  }

  @Override
  public void invalidate() {
    mClipPathStrategy = STRATEGY_UNKNOWN;
    mCachedUniformClipRule = CLIP_RULE_UNCACHED;
    if (mCachedMask != null) {
      mCachedMask.recycle();
      mCachedMask = null;
    }
    mCachedMaskBounds = null;
    super.invalidate();
  }

  @Override
  void clearCache() {
    super.clearCache();
    mClipPathStrategy = STRATEGY_UNKNOWN;
    mCachedUniformClipRule = CLIP_RULE_UNCACHED;
    // Null but don't recycle - bitmap may still be in use by RenderableView during render.
    // Reference released; GC will collect it. (onDetachedFromWindow recycles if still cached.)
    mCachedMask = null;
    mCachedMaskBounds = null;
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    if (mCachedMask != null) {
      mCachedMask.recycle();
      mCachedMask = null;
    }
    mCachedMaskBounds = null;
  }

  @Override
  void draw(Canvas canvas, Paint paint, float opacity) {
    FLog.w(
        ReactConstants.TAG,
        "RNSVG: ClipPath can't be drawn, it should be defined as a child component for `Defs` ");
  }

  @Override
  void saveDefinition() {
    getSvgView().defineClipPath(this, mName);
  }

  @Override
  boolean isResponsible() {
    return false;
  }

  @Override
  int hitTest(float[] src) {
    return -1;
  }

  @Override
  void mergeProperties(RenderableView target) {}

  @Override
  void resetProperties() {}
}
