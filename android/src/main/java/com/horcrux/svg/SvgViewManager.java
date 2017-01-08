/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


package com.horcrux.svg;

import android.graphics.Bitmap;

import com.facebook.yoga.YogaMeasureMode;
import com.facebook.yoga.YogaMeasureFunction;
import com.facebook.yoga.YogaNodeAPI;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.BaseViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * ViewManager for RNSVGSvgView React views. Renders as a {@link SvgView} and handles
 * invalidating the native view on shadow view updates happening in the underlying tree.
 */
public class SvgViewManager extends BaseViewManager<SvgView, SvgViewShadowNode> {

    private static final String REACT_CLASS = "RNSVGSvgView";
    private static final int COMMAND_TO_DATA_URL = 100;
    private static final YogaMeasureFunction MEASURE_FUNCTION = new YogaMeasureFunction() {
        @Override
        public long measure(
                YogaNodeAPI node,
                float width,
                YogaMeasureMode widthMode,
                float height,
                YogaMeasureMode heightMode) {
            throw new IllegalStateException("SurfaceView should have explicit width and height set");
        }
    };

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public Class<SvgViewShadowNode> getShadowNodeClass() {
        return SvgViewShadowNode.class;
    }

    @Override
    public SvgViewShadowNode createShadowNodeInstance() {
        SvgViewShadowNode node = new SvgViewShadowNode();
        node.setMeasureFunction(MEASURE_FUNCTION);
        return node;
    }

    @Override
    public void onDropViewInstance(SvgView view) {
        SvgInstancesManager.unregisterInstance(view.getId());
    }

    @Override
    protected SvgView createViewInstance(ThemedReactContext reactContext) {
        return new SvgView(reactContext);
    }

    @Override
    public void updateExtraData(SvgView root, Object extraData) {
        root.setBitmap((Bitmap) extraData);
    }

    @Override
    public @Nullable Map<String, Integer> getCommandsMap() {
        Map<String, Integer> commandsMap = super.getCommandsMap();
        if (commandsMap == null) {
            commandsMap = new HashMap<>();
        }

        commandsMap.put("toDataURL", COMMAND_TO_DATA_URL);
        return commandsMap;
    }

    @Override
    @Nullable
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        MapBuilder.Builder<String, Object> builder = MapBuilder.builder();

        for (SvgView.Events event : SvgView.Events.values()) {
            builder.put(event.toString(), MapBuilder.of("registrationName", event.toString()));
        }
        return builder.build();
    }

    @Override
    public void receiveCommand(SvgView root, int commandId, @Nullable ReadableArray args) {
        super.receiveCommand(root, commandId, args);

        switch (commandId) {
            case COMMAND_TO_DATA_URL:
                root.onDataURL();
                break;
        }
    }
}
