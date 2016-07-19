import React, {PropTypes} from 'react';
import SerializablePath from '../lib/SerializablePath';
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';
import {PathAttributes} from '../lib/attributes';
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
        ...pathProps
    };


    _dimensions = null;

    componentWillReceiveProps = nextProps => {
        if (nextProps.d !== this.props.d) {
            this._dimensions = null;
        }
    };

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        let props = mergeContext(this.props, this.context);

        let d = new SerializablePath(props.d).toJSON();
        return (
            <RNSVGPath
                ref={ele => this.root = ele}
                {...this.extractProps(props)}
                d={d}
            />
        );
    }
}

const RNSVGPath = createReactNativeComponentClass({
    validAttributes: PathAttributes,
    uiViewClassName: 'RNSVGPath'
});

export default Path;
