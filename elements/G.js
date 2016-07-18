import React, {Component, PropTypes} from 'react';
import Defs from './Defs';
import _ from 'lodash';
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';
import {numberProp, contextProps} from '../lib/props';
import {GroupAttributes} from '../lib/attributes';
import extractProps from '../lib/extract/extractProps';

class G extends Component{
    static displayName = 'G';

    static contextTypes = {
        svgId: numberProp,
        ...contextProps
    };

    static childContextTypes = {
        svgId: numberProp,
        isInGroup: PropTypes.bool,
        ...contextProps
    };

    getChildContext = () => {
        let context = _.reduce(contextProps, (props, value, key) => {
            if (!_.isNil(this.props[key])) {
                props[key] = this.props[key];
            }
            return props;
        }, {
            svgId: this.props.svgId || this.context.svgId,
            isInGroup: true
        });
        return _.defaults({}, this.context, context);
    };

    setNativeProps = (...args) => {
        this.getNativeElement().setNativeProps(...args);
    };

    getNativeElement = () => {
        return this.refs.root || this.root;
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
                    ref={ele => this.root = ele.refs.root}
                    id={null}
                />
            </Defs.Item>;
        } else {
            return <RNSVGGroup
                {...extractProps(this.props, {transform: true})}
                ref="root"
                asClipPath={this.props.asClipPath}
            >
                {this.props.children}
            </RNSVGGroup>;
        }
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
