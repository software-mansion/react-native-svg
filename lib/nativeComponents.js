import createReactNativeComponentClass from 'react-native/Libraries/Renderer/shims/createReactNativeComponentClass.js'
import {requireNativeComponent} from 'react-native'

export function createReactNativeComponentClass(uiViewClassName, getViewConfig) {
    return createReactNativeComponentClass.length >= 2
        ? createReactNativeComponentClass(uiViewClassName, getViewConfig)
        : createReactNativeComponentClass(getViewConfig())
}

//pass through for ios and android
export requireNativeComponent;
