/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.content.ContentResolver;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PorterDuff;
import android.graphics.Rect;
import android.graphics.RectF;
import android.net.Uri;
import android.os.AsyncTask;
import android.provider.MediaStore;
import android.util.Log;

import com.facebook.common.logging.FLog;
import com.facebook.common.util.UriUtil;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.uimanager.annotations.ReactProp;
import java.net.URL;

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
    private boolean mLocalImage;
    private boolean mLoading;

    private class BitmapWorkerTask extends AsyncTask<Integer, Void, Bitmap> {
        private final Canvas mCanvas;
        private final Paint mPaint;
        private RNSVGSvgViewShadowNode mSvgShadowNode;
        public BitmapWorkerTask(Canvas canvas, Paint paint, RNSVGSvgViewShadowNode node) {
            // Use a WeakReference to ensure the ImageView can be garbage collected
            mCanvas = canvas;
            mPaint = paint;
            mSvgShadowNode = node;
            mSvgShadowNode.increaseCounter();
        }

        // Decode image in background.
        @Override
        protected Bitmap doInBackground(Integer... params) {
            Bitmap bitmap= null;

            try {
                if (mLocalImage) {
                    ContentResolver resolver = getThemedContext().getContentResolver();
                    bitmap = MediaStore.Images.Media.getBitmap(resolver, mUri);
                } else {
                    URL url = new URL(mUri.toString());
                    bitmap = BitmapFactory.decodeStream(url.openConnection().getInputStream());
                }
            } catch (Exception e) {
                FLog.w(ReactConstants.TAG, "RNSVG: load Image load failed!:" + e.getMessage());
            }

            return bitmap;
        }

        // Once complete, see if ImageView is still around and set bitmap.
        @Override
        protected void onPostExecute(@Nullable Bitmap bitmap) {
            if (bitmap != null) {
                mBitmap = bitmap;
                mSvgShadowNode.decreaseCounter();
                mCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR);
                mPaint.reset();
                mSvgShadowNode.drawChildren(mCanvas, mPaint);
            }
        }
    }

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
            String uri = src.getString("uri");
            if (uri != null) {
                try {
                    mUri = Uri.parse(uri);
                    // Verify scheme is set, so that relative uri (used by static resources) are not handled.
                    if (mUri.getScheme() == null) {
                        mUri = null;
                    }
                } catch (Exception e) {
                    // ignore malformed uri, then attempt to extract resource ID.
                }
                if (mUri == null) {
                    mUri = getResourceDrawableUri(getThemedContext(), uri);
                    mLocalImage = true;
                } else {
                    mLocalImage = false;
                }
            }
        }
        markUpdated();
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

            if (node.isCounterEmpty()) {
                mBitmap.recycle();
            }
        } else if (!mLoading) {
            mLoading = true;
            loadBitmap(getResourceDrawableId(getThemedContext(), null), canvas, paint, node);
        }
    }

    public void loadBitmap(int resId, Canvas canvas, Paint paint, RNSVGSvgViewShadowNode node) {
        BitmapWorkerTask task = new BitmapWorkerTask(canvas, paint, node);
        task.execute(resId);
    }

    private static int getResourceDrawableId(Context context, @Nullable String name) {
        if (name == null || name.isEmpty()) {
            return 0;
        }
        return context.getResources().getIdentifier(
            name.toLowerCase().replace("-", "_"),
            "drawable",
            context.getPackageName());
    }


    private static Uri getResourceDrawableUri(Context context, @Nullable String name) {
        int resId = getResourceDrawableId(context, name);
        return resId > 0 ? new Uri.Builder()
            .scheme(UriUtil.LOCAL_RESOURCE_SCHEME)
            .path(String.valueOf(resId))
            .build() : Uri.EMPTY;
    }
}
