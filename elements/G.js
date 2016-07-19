import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';
import {numberProp, contextProps} from '../lib/props';
import {GroupAttributes} from '../lib/attributes';
import extractProps from '../lib/extract/extractProps';

class G extends Component{
    static displayName = 'G';

    static contextTypes = {
        ...contextProps
    };

    static childContextTypes = {
        ...contextProps
    };

    getChildContext = () => {
        let context = _.reduce(contextProps, (props, value, key) => {
            if (!_.isNil(this.props[key])) {
                props[key] = this.props[key];
            }
            return props;
        }, {});

        return _.defaults({}, this.context, context);
    };

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        return <RNSVGGroup
            {...extractProps(this.props, {transform: true})}
            ref={ele => this.root = ele}
            asClipPath={this.props.asClipPath}
        >
            {this.props.children}
        </RNSVGGroup>;
    }
}

const RNSVGGroup = createReactNativeComponentClass({
    validAttributes: GroupAttributes,
    uiViewClassName: 'RNSVGGroup'
});

export default G;
export {
    RNSVGGroup as NativeGroup
};
