package com.horcrux.svg;

import android.graphics.Bitmap;

public class SVGModule {
    public static void load() {
        System.loadLibrary("rnsvg");
    }
    public static native void example(Bitmap source);
}
