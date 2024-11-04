#include <android/bitmap.h>
#include <jni.h>
#include <array>
#include <mutex>

jobject globalThis;

extern "C" JNIEXPORT void JNICALL Java_com_horcrux_svg_SVGModule_example(
    JNIEnv *env,
    jclass thiz,
    jobject bitmap) {
  AndroidBitmapInfo info;
  void *pixels;
  AndroidBitmap_getInfo(env, bitmap, &info);
  AndroidBitmap_lockPixels(env, bitmap, &pixels);

  uint32_t *pixelData = (uint32_t *)pixels;
  int width = info.width;
  int height = info.height;

  for (int y = 0; y < height; y++) {
    for (int x = 0; x < width; x++) {
      int index = y * width + x;
      uint32_t pixel = pixelData[index];

      uint8_t alpha = (pixel >> 24) & 0xFF;
      uint8_t red = (pixel >> 16) & 0xFF;
      uint8_t green = (pixel >> 8) & 0xFF;
      uint8_t blue = pixel & 0xFF;

      pixelData[index] = (alpha << 24) | (red << 16) | (green << 8) | blue;
    }
  }
}

void JNICALL JNI_OnUnload(JavaVM *jvm, void *) {
  JNIEnv *env;
  if (jvm->GetEnv(reinterpret_cast<void **>(&env), JNI_VERSION_1_6) != JNI_OK) {
    return;
  }
  if (globalThis != nullptr) {
    env->DeleteGlobalRef(globalThis);
    globalThis = nullptr;
  }
}