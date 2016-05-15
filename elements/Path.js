import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import Defs from './Defs';
import extractProps from '../lib/extract/extractProps';
import SerializablePath from '../lib/SerializablePath';
import createNativeComponent from '../lib/createNativeComponent';
import {pathProps, numberProp} from '../lib/props';

class Path extends Component{
    static displayName = 'Path';

    static propTypes = {
        d: PropTypes.string,
        ...pathProps
    };

    static contextTypes = {
        ...pathProps,
        isInGroup: PropTypes.bool,
        svgId: numberProp
    };


    _dimensions = null;

    componentWillReceiveProps = nextProps => {
        if (nextProps.d !== this.props.d) {
            this._dimensions = null;
        }
    };

    render() {
        let {props} = this;

        if (this.context.isInGroup) {
            props = _.defaults(this.context, props, {
                isInGroup: null
            });
        }

        if (props.id) {
            return <Defs.Item
                id={props.id}
                svgId={props.svgId}
                visible={true}
            >
                <Path {...props} id={null} />
            </Defs.Item>;
        }

        let d = new SerializablePath(props.d).toJSON();

        return (
            <RNSVGPath
                {...extractProps(props)}
                d={d}
            />
        );
    }
}

const RNSVGPath = createNativeComponent('RNSVGPath');

export default Path;
