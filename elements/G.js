import React, {
    Component,
    Children,
    cloneElement,
    requireNativeComponent
} from 'react-native';
import createReactNativeComponentClass from 'react-native/Libraries/ReactNative/createReactNativeComponentClass';
import Defs from './Defs';
import {GroupAttributes} from '../lib/attributes';

const transformProps = {
    scale: null,
    scaleX: null,
    scaleY: null,
    rotate: null,
    transform: null,
    x: null,
    y: null,
    originX: null,
    originY: null
};

const clipProps = {
    clipPath: null,
    clipRule: null
};

import extractProps from '../lib/extract/extractProps';

class G extends Component{
    static displayName = 'G';

    getChildren = () => {
        return Children.map(this.props.children, child => cloneElement(child, {
            ...this.props,
            ...transformProps,
            ...clipProps,
            ...child.props,
            id: null
        }));
    };

    render() {
        if (this.props.id) {
            return <Defs.Item
                id={this.props.id}
                svgId={this.props.svgId}
                visible={true}
            >
                <G
                    {...this.props}
                    id={null}
                />
            </Defs.Item>;
        } else {
            return <NativeGroup
                {...extractProps(this.props, {transform: true})}
            >
                {this.getChildren()}
            </NativeGroup>;
        }
    }
}

var NativeGroup = createReactNativeComponentClass({
    validAttributes: GroupAttributes,
    uiViewClassName: 'RNSVGGroup'
});

export default G;
export {
    NativeGroup
}
