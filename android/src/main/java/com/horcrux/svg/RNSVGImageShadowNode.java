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
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.BitmapShader;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.Shader;
import android.net.Uri;
import android.os.AsyncTask;
import android.provider.MediaStore;
import android.util.Log;

import com.facebook.common.logging.FLog;
import com.facebook.common.util.UriUtil;
import com.facebook.drawee.interfaces.DraweeController;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import android.graphics.drawable.Drawable;
import android.widget.ImageView;


import java.lang.ref.WeakReference;
import java.net.URL;

import javax.annotation.Nullable;

/**
 * Shadow node for virtual RNSVGPath view
 */
public class RNSVGImageShadowNode extends RNSVGPathShadowNode {

    private ReadableMap mLayout;
    private ReadableMap mSrc;
    private Uri mUri;
    private boolean mLocalImage;
    private class BitmapWorkerTask extends AsyncTask<Integer, Void, Bitmap> {
        private final Canvas mCanvas;
        private final Paint mPaint;
        private int data = 0;

        public BitmapWorkerTask(Canvas canvas, Paint paint) {
            // Use a WeakReference to ensure the ImageView can be garbage collected
            mCanvas = canvas;
            mPaint = paint;
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
                Log.e("URI", "" + e);
            }

            return bitmap;
        }

        // Once complete, see if ImageView is still around and set bitmap.
        @Override
        protected void onPostExecute(@Nullable Bitmap bitmap) {

            if (bitmap != null) {
                mCanvas.restoreToCount(1);
                mCanvas.drawBitmap(bitmap, 0f, 0f, mPaint);
                mCanvas.restoreToCount(2);
            }
        }
    }

    @ReactProp(name = "layout")
    public void setLayout(@Nullable ReadableMap layout) {
        mLayout = layout;
        markUpdated();
    }

    @ReactProp(name = "src")
    public void setSrc(@Nullable ReadableMap src) {
        mSrc = src;

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
        canvas.saveLayer(0f, 0f, 0f, 0f, paint, Canvas.ALL_SAVE_FLAG);
        Log.e("Count", "" + canvas.getSaveCount());
        loadBitmap(getResourceDrawableId(getThemedContext(), null), canvas, paint);
    }

    public void loadBitmap(int resId, Canvas canvas, Paint paint) {
        BitmapWorkerTask task = new BitmapWorkerTask(canvas, paint);
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
