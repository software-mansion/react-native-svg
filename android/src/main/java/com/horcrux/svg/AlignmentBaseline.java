package com.horcrux.svg;

import com.facebook.common.internal.ImmutableMap;

import java.util.HashMap;
import java.util.Map;

/*
    https://drafts.csswg.org/css-inline/#propdef-alignment-baseline
    2.2.1. Alignment Point: alignment-baseline longhand

    Name:	alignment-baseline
    Value:	baseline | text-bottom | alphabetic | ideographic | middle | central | mathematical | text-top | bottom | center | top
    Initial:	baseline
    Applies to:	inline-level boxes, flex items, grid items, table cells
    Inherited:	no
    Percentages:	N/A
    Media:	visual
    Computed value:	as specified
    Canonical order:	per grammar
    Animation type:	discrete
*/
enum AlignmentBaseline {
    baseline("baseline"),
    textBottom("text-bottom"),
    alphabetic("alphabetic"),
    ideographic("ideographic"),
    middle("middle"),
    central("central"),
    mathematical("mathematical"),
    textTop("text-top"),
    bottom("bottom"),
    center("center"),
    top("top");

    private final String weight;

    AlignmentBaseline(String weight) {
        this.weight = weight;
    }

    public static AlignmentBaseline getEnum(String strVal) {
        if (!weightToEnum.containsKey(strVal)) {
            throw new IllegalArgumentException("Unknown String Value: " + strVal);
        }
        return weightToEnum.get(strVal);
    }

    private static final Map<String, AlignmentBaseline> weightToEnum;

    static {
        final Map<String, AlignmentBaseline> tmpMap = new HashMap<>();
        for (final AlignmentBaseline en : AlignmentBaseline.values()) {
            tmpMap.put(en.weight, en);
        }
        weightToEnum = ImmutableMap.copyOf(tmpMap);
    }

    @Override
    public String toString() {
        return weight;
    }
}
