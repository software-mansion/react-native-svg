/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.util.Log;

import javax.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Contains static helper methods for accessing props.
 */
/* package */ class PropHelper {

    /**
     * Converts {@link ReadableArray} to an array of {@code float}. Returns newly created array.
     *
     * @return a {@code float[]} if converted successfully, or {@code null} if {@param value} was
     * {@code null}.
     */
  /*package*/ static @Nullable float[] toFloatArray(@Nullable ReadableArray value) {
        if (value != null) {
            float[] result = new float[value.size()];
            toFloatArray(value, result);
            return result;
        }
        return null;
    }

    /**
     * Converts given {@link ReadableArray} to an array of {@code float}. Writes result to the array
     * passed in {@param into}. This method will write to the output array up to the number of items
     * from the input array. If the input array is longer than output the remaining part of the input
     * will not be converted.
     *
     * @param value input array
     * @param into output array
     * @return number of items copied from input to the output array
     */
  /*package*/ static int toFloatArray(ReadableArray value, float[] into) {
        int length = value.size() > into.length ? into.length : value.size();
        for (int i = 0; i < length; i++) {
            into[i] = (float) value.getDouble(i);
        }
        return value.size();

    }


    /**
     * Converts percentage string into actual based on a relative number
     *
     * @param percentage percentage string
     * @param relative relative number
     * @param offset offset number
     * @return actual float based on relative number
     */
  /*package*/ static float fromPercentageToFloat(String percentage, float relative, float offset, float scale) {
        Matcher matched =  Pattern.compile("^(\\-?\\d+(?:\\.\\d+)?)%$").matcher(percentage);
        if (matched.matches()) {
            return Float.valueOf(matched.group(1)) / 100 * relative + offset;
        } else {
            return Float.valueOf(percentage) * scale;
        }
    }
    /**
     * Judge given string is a percentage-like string or not.
     *
     * @param string percentage string
     * @return string is percentage-like or not.
     */

  /*package*/ static boolean isPercentage(String string) {
        Pattern pattern = Pattern.compile("^(\\-?\\d+(?:\\.\\d+)?)%$");
        return pattern.matcher(string).matches();
    }
}
