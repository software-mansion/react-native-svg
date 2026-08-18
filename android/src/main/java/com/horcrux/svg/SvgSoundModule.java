package com.horcrux.svg;

import android.content.Context;
import android.media.AudioManager;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

/**
 * {@link NativeModule} that allows playing device sounds from JS.
 * https://github.com/react/react-native/blob/2ce2c0794b9e7550d1b62bf049860155a5244a31/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/sound/SoundManagerModule.kt
 */
@ReactModule(name = SvgSoundModule.NAME)
class SvgSoundModule extends NativeSvgSoundModuleSpec {
  public static final String NAME = NativeSvgSoundModuleSpec.NAME;

  SvgSoundModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @ReactMethod
  @Override
  public void playTouchSound() {
    AudioManager audioManager =
        (AudioManager) getReactApplicationContext().getSystemService(Context.AUDIO_SERVICE);
    audioManager.playSoundEffect(AudioManager.FX_KEY_CLICK);
  }
}
