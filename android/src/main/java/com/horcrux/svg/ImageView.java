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
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.net.Uri;
import com.facebook.common.executors.UiThreadImmediateExecutorService;
import com.facebook.common.logging.FLog;
import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.DataSource;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.imagepipeline.core.ImagePipeline;
import com.facebook.imagepipeline.datasource.BaseBitmapDataSubscriber;
import com.facebook.imagepipeline.image.CloseableBitmap;
import com.facebook.imagepipeline.image.CloseableImage;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.views.imagehelper.ImageSource;
import com.facebook.react.views.imagehelper.ResourceDrawableIdHelper;
import com.horcrux.svg.events.SvgLoadEvent;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

@SuppressLint("ViewConstructor")
class ImageView extends RenderableView {
  private SVGLength mX;
  private SVGLength mY;
  private SVGLength mW;
  private SVGLength mH;
  private String uriString;
  private int mImageWidth;
  private int mImageHeight;
  private String mAlign;
  private int mMeetOrSlice;
  private int mSourceId;
  private @Nullable DataSource<CloseableReference<CloseableImage>> mDataSource;
  private final AtomicBoolean mLoading = new AtomicBoolean(false);

  public ImageView(ReactContext reactContext) {
    super(reactContext);
  }

  public void setX(Dynamic x) {
    mX = SVGLength.from(x);
    invalidate();
  }

  public void setY(Dynamic y) {
    mY = SVGLength.from(y);
    invalidate();
  }

  public void setWidth(Dynamic width) {
    mW = SVGLength.from(width);
    invalidate();
  }

  public void setHeight(Dynamic height) {
    mH = SVGLength.from(height);
    invalidate();
  }

  public void setSrc(@Nullable ReadableMap src) {
    String newUri = src == null ? null : src.getString("uri");
    if (newUri != null && newUri.isEmpty()) {
      newUri = null;
    }
    if (!Objects.equals(uriString, newUri)) {
      mSourceId += 1;
      cancelPendingRequest();
      uriString = newUri;
    }

    if (src == null || uriString == null) {
      mImageWidth = 0;
      mImageHeight = 0;
      invalidate();
      return;
    }

    if (src.hasKey("width") && src.hasKey("height")) {
      mImageWidth = src.getInt("width");
      mImageHeight = src.getInt("height");
    } else {
      mImageWidth = 0;
      mImageHeight = 0;
    }
    Uri mUri = Uri.parse(uriString);
    if (mUri.getScheme() == null) {
      ResourceDrawableIdHelper.getInstance().getResourceDrawableUri(mContext, uriString);
    }
    invalidate();
  }

  public void setAlign(String align) {
    mAlign = align;
    invalidate();
  }

  public void setMeetOrSlice(int meetOrSlice) {
    mMeetOrSlice = meetOrSlice;
    invalidate();
  }

  @Override
  protected void onDetachedFromWindow() {
    mSourceId += 1;
    cancelPendingRequest();
    super.onDetachedFromWindow();
  }

  @Override
  void draw(final Canvas canvas, final Paint paint, final float opacity) {
    if (uriString == null || uriString.isEmpty()) {
      return;
    }
    if (!mLoading.get()) {
      ImagePipeline imagePipeline = Fresco.getImagePipeline();
      ImageSource imageSource = new ImageSource(mContext, uriString);
      ImageRequest request = ImageRequest.fromUri(imageSource.getUri());
      boolean inMemoryCache = imagePipeline.isInBitmapMemoryCache(request);

      if (inMemoryCache) {
        tryRenderFromBitmapCache(imagePipeline, request, canvas, paint, opacity * mOpacity);
      } else {
        loadBitmap(imagePipeline, request, uriString, mSourceId);
      }
    }
  }

  @Override
  Path getPath(Canvas canvas, Paint paint) {
    mPath = new Path();
    mPath.addRect(getRect(), Path.Direction.CW);
    return mPath;
  }

  private void loadBitmap(
      final ImagePipeline imagePipeline,
      final ImageRequest request,
      final String requestUri,
      final int sourceId) {
    mLoading.set(true);
    final DataSource<CloseableReference<CloseableImage>> dataSource =
        imagePipeline.fetchDecodedImage(request, mContext);
    mDataSource = dataSource;
    BaseBitmapDataSubscriber subscriber =
        new BaseBitmapDataSubscriber() {
          @Override
          public void onNewResultImpl(Bitmap bitmap) {
            if (sourceId != mSourceId) {
              return;
            }
            clearPendingRequest(dataSource);
            final EventDispatcher mEventDispatcher =
                UIManagerHelper.getEventDispatcherForReactTag(mContext, getId());
            mEventDispatcher.dispatchEvent(
                new SvgLoadEvent(
                    UIManagerHelper.getSurfaceId(ImageView.this),
                    getId(),
                    mContext,
                    requestUri,
                    bitmap.getWidth(),
                    bitmap.getHeight()));
            mLoading.set(false);
            SvgView view = getSvgView();
            if (view != null) {
              view.invalidate();
            }
          }

          @Override
          public void onFailureImpl(DataSource dataSource) {
            if (sourceId != mSourceId) {
              return;
            }
            clearPendingRequest(dataSource);
            // No cleanup required here.
            // TODO: more details about this failure
            mLoading.set(false);
            FLog.w(
                ReactConstants.TAG,
                dataSource.getFailureCause(),
                "RNSVG: fetchDecodedImage failed!");
          }
        };
    dataSource.subscribe(subscriber, UiThreadImmediateExecutorService.getInstance());
  }

  private void clearPendingRequest(DataSource<CloseableReference<CloseableImage>> dataSource) {
    if (mDataSource == dataSource) {
      mDataSource = null;
    }
  }

  private void cancelPendingRequest() {
    if (mDataSource != null) {
      mDataSource.close();
      mDataSource = null;
    }
    mLoading.set(false);
  }

  @Nonnull
  private RectF getRect() {
    double x = relativeOnWidth(mX);
    double y = relativeOnHeight(mY);
    double w = relativeOnWidth(mW);
    double h = relativeOnHeight(mH);
    if (w == 0) {
      w = mImageWidth * mScale;
    }
    if (h == 0) {
      h = mImageHeight * mScale;
    }

    return new RectF((float) x, (float) y, (float) (x + w), (float) (y + h));
  }

  private void doRender(Canvas canvas, Paint paint, Bitmap bitmap, float opacity) {
    if (mImageWidth == 0 || mImageHeight == 0) {
      mImageWidth = bitmap.getWidth();
      mImageHeight = bitmap.getHeight();
    }

    RectF renderRect = getRect();
    RectF vbRect = new RectF(0, 0, mImageWidth, mImageHeight);
    Matrix transform = ViewBox.getTransform(vbRect, renderRect, mAlign, mMeetOrSlice);
    transform.mapRect(vbRect);

    canvas.clipPath(getPath(canvas, paint));

    Path clipPath = getClipPath(canvas, paint);
    if (clipPath != null) {
      canvas.clipPath(clipPath);
    }

    Paint alphaPaint = new Paint();
    alphaPaint.setAlpha((int) (opacity * 255));
    canvas.drawBitmap(bitmap, null, vbRect, alphaPaint);
    mCTM.mapRect(vbRect);
    this.setClientRect(vbRect);
  }

  private void tryRenderFromBitmapCache(
      ImagePipeline imagePipeline,
      ImageRequest request,
      Canvas canvas,
      Paint paint,
      float opacity) {
    final DataSource<CloseableReference<CloseableImage>> dataSource =
        imagePipeline.fetchImageFromBitmapCache(request, mContext);

    try {
      final CloseableReference<CloseableImage> imageReference = dataSource.getResult();
      if (imageReference == null) {
        return;
      }

      try {
        CloseableImage closeableImage = imageReference.get();
        if (!(closeableImage instanceof CloseableBitmap)) {
          return;
        }

        CloseableBitmap closeableBitmap = (CloseableBitmap) closeableImage;
        final Bitmap bitmap = closeableBitmap.getUnderlyingBitmap();

        if (bitmap == null) {
          return;
        }

        doRender(canvas, paint, bitmap, opacity);

      } catch (Exception e) {
        throw new IllegalStateException(e);
      } finally {
        CloseableReference.closeSafely(imageReference);
      }

    } catch (Exception e) {
      throw new IllegalStateException(e);
    } finally {
      dataSource.close();
    }
  }
}
