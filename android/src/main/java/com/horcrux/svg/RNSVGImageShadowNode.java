/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.Rect;
import android.net.Uri;
import android.util.Log;
import com.facebook.common.executors.UiThreadImmediateExecutorService;
import com.facebook.common.logging.FLog;
import com.facebook.common.executors.CallerThreadExecutor;
import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.DataSource;
import com.facebook.common.logging.FLog;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.imagepipeline.core.ImagePipeline;
import com.facebook.imagepipeline.datasource.BaseBitmapDataSubscriber;
import com.facebook.imagepipeline.image.CloseableBitmap;
import com.facebook.imagepipeline.image.CloseableImage;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.uimanager.annotations.ReactProp;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * Shadow node for virtual RNSVGPath view
 */
public class RNSVGImageShadowNode extends RNSVGPathShadowNode {

    private String mX;
    private String mY;
    private String mW;
    private String mH;
    private Uri mUri;
    private boolean mLoading;

    @ReactProp(name = "x")
    public void setX(String x) {
        mX = x;
        markUpdated();
    }

    @ReactProp(name = "y")
    public void setY(String y) {
        mY = y;
        markUpdated();
    }

    @ReactProp(name = "width")
    public void setWidth(String width) {
        mW = width;
        markUpdated();
    }

    @ReactProp(name = "height")
    public void seHeight(String height) {
        mH = height;
        markUpdated();
    }

    @ReactProp(name = "src")
    public void setSrc(@Nullable ReadableMap src) {
        if (src != null) {
            String uriString = src.getString("uri");

            if (uriString == null || uriString.isEmpty()) {
                //TODO: give warning about this
                return;
            }

            mUri = Uri.parse(uriString);
        }
    }

    @Override
    public void draw(final Canvas canvas, final Paint paint, final float opacity) {
        final ImageRequest request = ImageRequestBuilder.newBuilderWithSource(mUri).build();
        final boolean inMemoryCache = Fresco.getImagePipeline().isInBitmapMemoryCache(request);


        if (inMemoryCache) {
            tryRender(request, canvas, paint, opacity * mOpacity);
        } else if (!mLoading) {
            loadBitmap(request, canvas, paint);
        }
    }

    private void loadBitmap(@Nonnull final ImageRequest request, @Nonnull final Canvas canvas, @Nonnull final Paint paint) {
        final DataSource<CloseableReference<CloseableImage>> dataSource
            = Fresco.getImagePipeline().fetchDecodedImage(request, getThemedContext());

        dataSource.subscribe(new BaseBitmapDataSubscriber() {
                                 @Override
                                 public void onNewResultImpl(@Nullable Bitmap bitmap) {
                                     if (bitmap != null) {
                                         canvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR);
                                         paint.reset();
                                         mLoading = false;
                                         getSvgShadowNode().drawChildren(canvas, paint);
                                     }
                                 }

                                 @Override
                                 public void onFailureImpl(DataSource dataSource) {
                                     // No cleanup required here.
                                     // TODO: more details about this failure
                                     mLoading = false;
                                     FLog.w(ReactConstants.TAG, dataSource.getFailureCause(), "RNSVG: fetchDecodedImage failed!");
                                 }
                             },
            UiThreadImmediateExecutorService.getInstance()
        );
    }

    private void doRender(@Nonnull final Canvas canvas, @Nonnull final Paint paint, @Nonnull final Bitmap bitmap, final float opacity) {
        final int count = saveAndSetupCanvas(canvas);

        clip(canvas, paint);
        float x = PropHelper.fromPercentageToFloat(mX, mCanvasWidth, 0, mScale);
        float y = PropHelper.fromPercentageToFloat(mY, mCanvasHeight, 0, mScale);
        float w = PropHelper.fromPercentageToFloat(mW, mCanvasWidth, 0, mScale);
        float h = PropHelper.fromPercentageToFloat(mH, mCanvasHeight, 0, mScale);
        Paint alphaPaint = new Paint();

        alphaPaint.setAlpha((int) (opacity * 255));
        canvas.drawBitmap(bitmap, null, new Rect((int) x, (int) y, (int) (x + w), (int) (y + h)), alphaPaint);

        restoreCanvas(canvas, count);
    }

    private void tryRender(@Nonnull final ImageRequest request, @Nonnull final Canvas canvas, @Nonnull final Paint paint, final float opacity) {
        final DataSource<CloseableReference<CloseableImage>> dataSource
            = Fresco.getImagePipeline().fetchImageFromBitmapCache(request, getThemedContext());

        try {
            final CloseableReference<CloseableImage> imageReference = dataSource.getResult();
            if (imageReference != null) {
                try {
                    if (imageReference.get() instanceof CloseableBitmap) {
                        final Bitmap bitmap = ((CloseableBitmap) imageReference.get()).getUnderlyingBitmap();

                        if (bitmap != null) {
                            doRender(canvas, paint, bitmap, opacity);
                        }
                    }
                } finally {
                    CloseableReference.closeSafely(imageReference);
                }
            }
        } finally {
            dataSource.close();
        }
    }
}
