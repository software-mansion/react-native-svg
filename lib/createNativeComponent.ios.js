/**
 * This is a hack to to create a native component of RNSVG.
 * Because importing `createReactNativeComponentClass` is a pain in the ass after `0.25.1` is released
 * and changed lots of dependencies of many modules.
 * So this is just a work around to create a native component of RNSVG.
 * If there is a better way to do this,
 * PLEASE override this module.
 */
import {requireNativeComponent, UIManager} from 'react-native';

// inherited native props
const RenderableNativeProps = {
    ...UIManager.RNSVGRenderable.NativeProps,
    ...UIManager.RNSVGNode.NativeProps
};

export default function (componentName) {
    let originNativeProps = UIManager[componentName].NativeProps;
    let originViewProps = UIManager.RCTView.NativeProps;

    // override native component`s NativeProps
    UIManager[componentName].NativeProps = {
        ...RenderableNativeProps,
        ...originNativeProps
    };

    // clear RCTView`s NativeProps
    UIManager.RCTView.NativeProps = null;
    const RNSVGNativeComponent = requireNativeComponent(componentName, null);

    // reset all
    UIManager.RCTView.NativeProps = originViewProps;
    UIManager[componentName].NativeProps = originNativeProps;

    return RNSVGNativeComponent;
}
