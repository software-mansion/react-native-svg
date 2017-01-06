import React, {PropTypes} from 'react';
import createReactNativeComponentClass from 'react-native/Libraries/Renderer/src/renderers/native/createReactNativeComponentClass';
import {PathAttributes} from '../lib/attributes';
import Shape from './Shape';
import {pathProps} from '../lib/props';

class Path extends Shape {
    static displayName = 'Path';

    static propTypes = {
        ...pathProps,
        d: PropTypes.string.isRequired
    };

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        let props = this.props;

        return (
            <RNSVGPath
                ref={ele => {this.root = ele;}}
                {...this.extractProps(props)}
                d={props.d}
            />
        );
    }
}

const RNSVGPath = createReactNativeComponentClass({
    validAttributes: PathAttributes,
    uiViewClassName: 'RNSVGPath'
});

export default Path;
