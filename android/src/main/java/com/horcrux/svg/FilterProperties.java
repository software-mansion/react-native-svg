package com.horcrux.svg;

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
        throw new IllegalArgumentException("Unknown 'Unit' Value: " + strVal);
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
        throw new IllegalArgumentException("Unknown 'edgeMode' Value: " + strVal);
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
        throw new IllegalArgumentException("Unknown String Value: " + strVal);
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
}
