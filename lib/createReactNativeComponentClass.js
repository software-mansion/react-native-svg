import createReactNativeComponentClass from 'react-native/Libraries/Renderer/shims/createReactNativeComponentClass.js'

export default (uiViewClassName, getViewConfig) =>
  createReactNativeComponentClass.length >= 2
    ? createReactNativeComponentClass(uiViewClassName, getViewConfig)
    : createReactNativeComponentClass(getViewConfig())
