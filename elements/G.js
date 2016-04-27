import React, {
    Component,
    Children,
    cloneElement,
    PropTypes,
    requireNativeComponent
} from 'react-native';
import createReactNativeComponentClass from 'react-native/Libraries/ReactNative/createReactNativeComponentClass';
import Defs from './Defs';
import _ from 'lodash';
import {GroupAttributes} from '../lib/attributes';
import {numberProp, contextProps, textProps} from '../lib/props';

import extractProps from '../lib/extract/extractProps';

class G extends Component{
    static displayName = 'G';

    static childContextTypes = {
        svgId: numberProp,
        isInGroup: PropTypes.bool,
        ...contextProps
    };

    getChildContext = () => {
        return _.reduce(contextProps, (props, value, key) => {
            props[key] = this.props[key];
            return props;
        }, {
            svgId: this.props.svgId,
            isInGroup: true
        });
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
                asClipPath={this.props.asClipPath}
            >
                {this.props.children}
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
