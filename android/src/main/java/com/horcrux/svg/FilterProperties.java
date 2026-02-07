package com.horcrux.svg;

import com.facebook.common.logging.FLog;
import com.facebook.react.common.ReactConstants;
import java.util.HashMap;
import java.util.Map;
import javax.annotation.Nonnull;

class FilterProperties {
  enum Units {
    OBJECT_BOUNDING_BOX("objectBoundingBox"),
    USER_SPACE_ON_USE("userSpaceOnUse"),
    ;

    private final String units;

    Units(String units) {
      this.units = units;
    }

    static Units getEnum(String strVal) {
      if (!unitsToEnum.containsKey(strVal)) {
        FLog.w(ReactConstants.TAG, "RNSVG: Unknown 'Unit' value: " + strVal);
        return OBJECT_BOUNDING_BOX;
      }
      return unitsToEnum.get(strVal);
    }

    private static final Map<String, Units> unitsToEnum = new HashMap<>();

    static {
      for (final Units en : Units.values()) {
        unitsToEnum.put(en.units, en);
      }
    }

    @Nonnull
    @Override
    public String toString() {
      return units;
    }
  }

  enum EdgeMode {
    UNKNOWN("unknown"),
    DUPLICATE("duplicate"),
    WRAP("wrap"),
    NONE("none"),
    ;

    private final String edgeMode;

    EdgeMode(String edgeMode) {
      this.edgeMode = edgeMode;
    }

    static EdgeMode getEnum(String strVal) {
      if (!edgeModeToEnum.containsKey(strVal)) {
        FLog.w(ReactConstants.TAG, "RNSVG: Unknown 'edgeMode' value: " + strVal);
        return UNKNOWN;
      }
      return edgeModeToEnum.get(strVal);
    }

    private static final Map<String, EdgeMode> edgeModeToEnum = new HashMap<>();

    static {
      for (final EdgeMode en : EdgeMode.values()) {
        edgeModeToEnum.put(en.edgeMode, en);
      }
    }

    @Nonnull
    @Override
    public String toString() {
      return edgeMode;
    }
  }

  enum FeBlendMode {
    UNKNOWN("unknown"),
    NORMAL("normal"),
    MULTIPLY("multiply"),
    SCREEN("screen"),
    DARKEN("darken"),
    LIGHTEN("lighten"),
    ;

    private final String mode;

    FeBlendMode(String mode) {
      this.mode = mode;
    }

    static FeBlendMode getEnum(String strVal) {
      if (!typeToEnum.containsKey(strVal)) {
        FLog.w(ReactConstants.TAG, "RNSVG: Unknown 'feBlendMode' value: " + strVal);
        return UNKNOWN;
      }
      return typeToEnum.get(strVal);
    }

    private static final Map<String, FeBlendMode> typeToEnum = new HashMap<>();

    static {
      for (final FeBlendMode en : FeBlendMode.values()) {
        typeToEnum.put(en.mode, en);
      }
    }

    @Nonnull
    @Override
    public String toString() {
      return mode;
    }
  }

  enum FeColorMatrixType {
    MATRIX("matrix"),
    SATURATE("saturate"),
    HUE_ROTATE("hueRotate"),
    LUMINANCE_TO_ALPHA("luminanceToAlpha"),
    ;

    private final String type;

    FeColorMatrixType(String type) {
      this.type = type;
    }

    static FeColorMatrixType getEnum(String strVal) {
      if (!typeToEnum.containsKey(strVal)) {
        FLog.w(ReactConstants.TAG, "RNSVG: Unknown 'feColorMatrixType' value: " + strVal);
        return MATRIX;
      }
      return typeToEnum.get(strVal);
    }

    private static final Map<String, FeColorMatrixType> typeToEnum = new HashMap<>();

    static {
      for (final FeColorMatrixType en : FeColorMatrixType.values()) {
        typeToEnum.put(en.type, en);
      }
    }

    @Nonnull
    @Override
    public String toString() {
      return type;
    }
  }

  enum FeCompositeOperator {
    OVER("over"),
    IN("in"),
    OUT("out"),
    ATOP("atop"),
    XOR("xor"),
    ARITHMETIC("arithmetic"),
    ;

    private final String type;

    FeCompositeOperator(String type) {
      this.type = type;
    }

    static FeCompositeOperator getEnum(String strVal) {
      if (!typeToEnum.containsKey(strVal)) {
        FLog.w(ReactConstants.TAG, "RNSVG: Unknown 'feCompositeOperator' value: " + strVal);
        return OVER;
      }
      return typeToEnum.get(strVal);
    }

    private static final Map<String, FeCompositeOperator> typeToEnum = new HashMap<>();

    static {
      for (final FeCompositeOperator en : FeCompositeOperator.values()) {
        typeToEnum.put(en.type, en);
      }
    }

    @Nonnull
    @Override
    public String toString() {
      return type;
    }
  }
}
