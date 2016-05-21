/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import javax.annotation.Nullable;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Point;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.common.SystemClock;
import com.facebook.react.touch.OnInterceptTouchEventListener;
import com.facebook.react.touch.ReactInterceptingViewGroup;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.TouchTargetHelper;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.TouchEvent;
import com.facebook.react.uimanager.events.TouchEventType;
import com.facebook.react.views.view.ReactClippingViewGroup;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.NativeGestureUtil;

// NativeGestureUtil.notifyNativeGestureStarted
/**
 * Custom {@link View} implementation that draws an RNSVGSvg React view and its \children.
 */
public class RNSVGSvgView extends ViewGroup {

    private @Nullable Bitmap mBitmap;

    private RNSVGSvgViewShadowNode mSvgViewShadowNode;

    private int mTargetTag;

    public RNSVGSvgView(Context context, RNSVGSvgViewShadowNode shadowNode) {
        super(context);
        mSvgViewShadowNode = shadowNode;
    }

    public RNSVGSvgView(Context context) {
        super(context);
    }

    public void setBitmap(Bitmap bitmap) {
        if (mBitmap != null) {
            mBitmap.recycle();
        }
        mBitmap = bitmap;
        invalidate();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        if (mBitmap != null) {
            canvas.drawBitmap(mBitmap, 0, 0, null);
        }
    }

    @Override
    public boolean dispatchTouchEvent(MotionEvent event) {
        mTargetTag = mSvgViewShadowNode.hitTest(new Point((int) event.getX(), (int) event.getY()), this);
        if (mTargetTag != -1) {
            EventDispatcher eventDispatcher = ((ThemedReactContext) this.getContext()).getNativeModule(UIManagerModule.class).getEventDispatcher();
            handleTouchEvent(event, eventDispatcher);
            return true;
        }

        return super.dispatchTouchEvent(event);
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {

    }

    public void handleTouchEvent(MotionEvent ev, EventDispatcher eventDispatcher) {
        int action = ev.getAction() & MotionEvent.ACTION_MASK;
        if (action == MotionEvent.ACTION_DOWN) {
            eventDispatcher.dispatchEvent(
                TouchEvent.obtain(
                    mTargetTag,
                    SystemClock.nanoTime(),
                    TouchEventType.START,
                    ev,
                    ev.getX(),
                    ev.getX()));
        } else if (mTargetTag == -1) {
            // All the subsequent action types are expected to be called after ACTION_DOWN thus target
            // is supposed to be set for them.
            Log.e(
                "error",
                "Unexpected state: received touch event but didn't get starting ACTION_DOWN for this " +
                    "gesture before");
        } else if (action == MotionEvent.ACTION_UP) {
            // End of the gesture. We reset target tag to -1 and expect no further event associated with
            // this gesture.
            eventDispatcher.dispatchEvent(
                TouchEvent.obtain(
                    mTargetTag,
                    SystemClock.nanoTime(),
                    TouchEventType.END,
                    ev,
                    ev.getX(),
                   ev.getY()));
            mTargetTag = -1;
        } else if (action == MotionEvent.ACTION_MOVE) {
            // Update pointer position for current gesture
            eventDispatcher.dispatchEvent(
                TouchEvent.obtain(
                    mTargetTag,
                    SystemClock.nanoTime(),
                    TouchEventType.MOVE,
                    ev,
                    ev.getX(),
                    ev.getY()));
        } else if (action == MotionEvent.ACTION_POINTER_DOWN) {
            // New pointer goes down, this can only happen after ACTION_DOWN is sent for the first pointer
            eventDispatcher.dispatchEvent(
                TouchEvent.obtain(
                    mTargetTag,
                    SystemClock.nanoTime(),
                    TouchEventType.START,
                    ev,
                    ev.getX(),
                    ev.getY()));
        } else if (action == MotionEvent.ACTION_POINTER_UP) {
            // Exactly onw of the pointers goes up
            eventDispatcher.dispatchEvent(
                TouchEvent.obtain(
                    mTargetTag,
                    SystemClock.nanoTime(),
                    TouchEventType.END,
                    ev,
                    ev.getX(),
                    ev.getY()));
        } else if (action == MotionEvent.ACTION_CANCEL) {
            dispatchCancelEvent(ev, eventDispatcher);
            mTargetTag = -1;
        } else {
            Log.w(
                "IGNORE",
                "Warning : touch event was ignored. Action=" + action + " Target=" + mTargetTag);
        }
    }

    private void dispatchCancelEvent(MotionEvent androidEvent, EventDispatcher eventDispatcher) {
        // This means the gesture has already ended, via some other CANCEL or UP event. This is not
        // expected to happen very often as it would mean some child View has decided to intercept the
        // touch stream and start a native gesture only upon receiving the UP/CANCEL event.
        if (mTargetTag == -1) {
            Log.w(
                "error",
                "Can't cancel already finished gesture. Is a child View trying to start a gesture from " +
                    "an UP/CANCEL event?");
            return;
        }

        Assertions.assertNotNull(eventDispatcher).dispatchEvent(
            TouchEvent.obtain(
                mTargetTag,
                SystemClock.nanoTime(),
                TouchEventType.CANCEL,
                androidEvent,
                androidEvent.getX(),
                androidEvent.getY()));
    }
}
