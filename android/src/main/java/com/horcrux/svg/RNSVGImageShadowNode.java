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
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Rect;
import android.graphics.RectF;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Log;

import com.facebook.common.logging.FLog;
import com.facebook.common.util.UriUtil;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.facebook.react.views.image.ReactImageView;


import java.net.URL;

import javax.annotation.Nullable;

/**
 * Shadow node for virtual RNSVGPath view
 */
public class RNSVGImageShadowNode extends RNSVGPathShadowNode {

    private ReadableMap mLayout;
    private ReadableMap mSrc;
    private Uri mUri;

    @ReactProp(name = "layout")
    public void setLayout(@Nullable ReadableMap layout) {
        mLayout = layout;
        markUpdated();
    }

    @ReactProp(name = "src")
    public void setSrc(@Nullable ReadableMap src) {
        mSrc = src;
        boolean isLocalImage;
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
                    isLocalImage = true;
                } else {
                    isLocalImage = false;
                }

                ImageRequest imageRequest = ImageRequestBuilder.newBuilderWithSource(mUri)
                    //.setPostprocessor(postprocessor)
                    //.setResizeOptions(resizeOptions)

                    .setAutoRotateEnabled(true)
                    .setProgressiveRenderingEnabled(true)
                    .build();


//                try {
//                    Bitmap bitmap;
//                    if (isLocalImage) {
//                        ContentResolver resolver = getThemedContext().getContentResolver();
//                        bitmap = MediaStore.Images.Media.getBitmap(resolver, mUri);
//                    } else {
//                        URL url = new URL("http://imga.deyi.com/forum/201605/09/171603b00dad0aee3f82dc.jpg");//mUri.toString());
//                        Log.e("URI", "" + url);
//                        bitmap = BitmapFactory.decodeStream(url.openConnection().getInputStream());
//                    }
//                    Log.e("BITMAP", ""  + bitmap.getHeight());
//                } catch (Exception e) {
//                    Log.e("URI", "" + e);
//                }
            }
        }
        markUpdated();
    }

    @Override
    public void draw(Canvas canvas, Paint paint, float opacity) {
        getThemedContext();
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
