import React, {Component, PropTypes} from 'react';
import Defs from './Defs';
import _ from 'lodash';
import createNativeComponent from '../lib/createNativeComponent';
import {numberProp, contextProps} from '../lib/props';

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
            return <RNSVGGroup
                {...extractProps(this.props, {transform: true})}
                asClipPath={this.props.asClipPath}
            >
                {this.props.children}
            </RNSVGGroup>;
        }
    }
}

const RNSVGGroup = createNativeComponent('RNSVGGroup');

export default G;
export {
    RNSVGGroup as NativeGroup
};
