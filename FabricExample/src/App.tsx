import { Button, Platform, View } from 'react-native';

const components = [
  [ 'RNSVGCircle', require('../../lib/module/fabric/CircleNativeComponent')],
  [ 'RNSVGClipPath' , require('../../lib/module/fabric/ClipPathNativeComponent')],
  [ 'RNSVGDefs', require('../../lib/module/fabric/DefsNativeComponent')],
  [ 'RNSVGEllipse', require('../../lib/module/fabric/EllipseNativeComponent')],
  [ 'RNSVGForeignObject', require('../../lib/module/fabric/ForeignObjectNativeComponent')],
  [ 'RNSVGGroup', require('../../lib/module/fabric/GroupNativeComponent')],
  [ 'RNSVGImage', require('../../lib/module/fabric/ImageNativeComponent')],
  [ 'RNSVGLine', require('../../lib/module/fabric/LineNativeComponent')],
  [ 'RNSVGLinearGradient', require('../../lib/module/fabric/LinearGradientNativeComponent')],
  [ 'RNSVGMarker', require('../../lib/module/fabric/MarkerNativeComponent')],
  [ 'RNSVGMask', require('../../lib/module/fabric/MaskNativeComponent')],
  [ 'RNSVGPath', require('../../lib/module/fabric/PathNativeComponent')],
  [ 'RNSVGPattern', require('../../lib/module/fabric/PatternNativeComponent')],
  [ 'RNSVGRadialGradient', require('../../lib/module/fabric/RadialGradientNativeComponent')],
  [ 'RNSVGRect', require('../../lib/module/fabric/RectNativeComponent')],
  [ 'RNSVGSymbol', require('../../lib/module/fabric/SymbolNativeComponent')],
  [ 'RNSVGTSpan', require('../../lib/module/fabric/TSpanNativeComponent')],
  [ 'RNSVGText', require('../../lib/module/fabric/TextNativeComponent')],
  [ 'RNSVGTextPath', require('../../lib/module/fabric/TextPathNativeComponent')],
  [ 'RNSVGUse', require('../../lib/module/fabric/UseNativeComponent')],
];

components.push(
  Platform.OS === 'android' 
    ? [ 'RNSVGSvgViewAndroid', require('../../lib/module/fabric/AndroidSvgViewNativeComponent')] 
    : [ 'RNSVGSvgView', require('../../lib/module/fabric/IOSSvgViewNativeComponent')] 
)

const StaticViewConfigValidator = require('react-native/Libraries/NativeComponent/StaticViewConfigValidator');
const {createViewConfig} = require('react-native/Libraries/NativeComponent/ViewConfig');
const getNativeComponentAttributes = require('react-native/Libraries/ReactNative/getNativeComponentAttributes');

function validate() {
  for (const component of components) {
      const [componentName, {__INTERNAL_VIEW_CONFIG: partialStaticViewConfig}] = component;
      const staticViewConfig = createViewConfig(partialStaticViewConfig);
      const nativeViewConfig = getNativeComponentAttributes(componentName);
      const result = StaticViewConfigValidator.validate(componentName, nativeViewConfig, staticViewConfig);
      // console.log(result);
      if (result.type === "invalid") {
          console.log(StaticViewConfigValidator.stringifyValidationResult(componentName, result));
      }

  }
}

export default function Playground() {
  return (
  <View style={{justifyContent: 'center', alignContent: 'center', padding: 100}}>
  <Button onPress={() => validate()} title="Validate ViewConfigs"/>
  </View>);
}