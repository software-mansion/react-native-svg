import React, {PropTypes} from 'react';
import Defs from './Defs';
import SerializablePath from '../lib/SerializablePath';
import createNativeComponent from '../lib/createNativeComponent';
import mergeContext from '../lib/mergeContext';
import Shape from './Shape';
import {pathProps, numberProp} from '../lib/props';

class Path extends Shape {
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
        let props = mergeContext(this.props, this.context);

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
                {...this.extractProps(props)}
                d={d}
            />
        );
    }
}

const RNSVGPath = createNativeComponent('RNSVGPath');

export default Path;
