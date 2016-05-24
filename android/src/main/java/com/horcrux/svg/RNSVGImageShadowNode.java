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

import com.facebook.common.executors.CallerThreadExecutor;
import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.DataSource;
import com.facebook.common.logging.FLog;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.imagepipeline.core.ImagePipeline;
import com.facebook.imagepipeline.datasource.BaseBitmapDataSubscriber;
import com.facebook.imagepipeline.image.CloseableImage;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.uimanager.annotations.ReactProp;
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
    private Bitmap mBitmap;
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
    public void draw(Canvas canvas, Paint paint, float opacity) {
        RNSVGSvgViewShadowNode node = getSvgShadowNode();
        if (mBitmap != null) {
            int count = saveAndSetupCanvas(canvas);

            clip(canvas, paint);
            float x = PropHelper.fromPercentageToFloat(mX, mWidth, 0, mScale);
            float y = PropHelper.fromPercentageToFloat(mY, mHeight, 0, mScale);
            float w = PropHelper.fromPercentageToFloat(mW, mWidth, 0, mScale);
            float h = PropHelper.fromPercentageToFloat(mH, mHeight, 0, mScale);
            canvas.drawBitmap(mBitmap, null, new Rect((int) x, (int) y, (int) (x + w), (int)(y + h)), null);

            restoreCanvas(canvas, count);
            markUpdateSeen();
        } else if (!mLoading) {
            mLoading = true;
            loadBitmap(canvas, paint, node);
        }
    }

    public void loadBitmap(final Canvas canvas, final Paint paint, final RNSVGSvgViewShadowNode node) {
        ImageRequest request = ImageRequestBuilder.newBuilderWithSource(mUri).build();

        ImagePipeline imagePipeline = Fresco.getImagePipeline();
        DataSource<CloseableReference<CloseableImage>>
            dataSource = imagePipeline.fetchDecodedImage(request, getThemedContext());
        dataSource.subscribe(new BaseBitmapDataSubscriber() {
                                 @Override
                                 public void onNewResultImpl(@Nullable Bitmap bitmap) {
                                     if (bitmap != null) {
                                         mBitmap = bitmap;
                                         canvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR);
                                         paint.reset();
                                         node.drawChildren(canvas, paint);
                                     }
                                 }

                                 @Override
                                 public void onFailureImpl(DataSource dataSource) {
                                     // No cleanup required here.
                                     // TODO: more details about this failure
                                     FLog.w(ReactConstants.TAG, "RNSVG: load Image load failed!:");
                                 }
                             },
            CallerThreadExecutor.getInstance());
    }
}
