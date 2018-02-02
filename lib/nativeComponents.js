import nativeCreateReactNativeComponentClass from 'react-native/Libraries/Renderer/shims/createReactNativeComponentClass.js'
import {requireNativeComponent as nativeRequireNativeComponent} from 'react-native'

export function createReactNativeComponentClass (uiViewClassName, getViewConfig) {
    return nativeCreateReactNativeComponentClass.length >= 2
        ? nativeCreateReactNativeComponentClass(uiViewClassName, getViewConfig)
        : nativeCreateReactNativeComponentClass(getViewConfig());
}

export let requireNativeComponent = nativeRequireNativeComponent;
