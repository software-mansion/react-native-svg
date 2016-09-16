import React, { PropTypes, Component } from 'react';
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';
import {numberProp, pathProps} from '../lib/props';
import {TSpanAttributes} from '../lib/attributes';

// TSpan elements are shadow components
class TSpan extends Component {
    static displayName = 'TSpan';

    static propTypes = {
        ...pathProps,
        dx: numberProp,
        dy: numberProp,
        textAnchor: PropTypes.oneOf(['start', 'middle', 'end']),
        fontFamily: PropTypes.string,
        fontSize: numberProp,
        fontWeight: PropTypes.string,
        fontStyle: PropTypes.string,
        font: PropTypes.object
    };

    setNativeProps = (...args) => {

    };

    render() {
        return null;
    }
}

export default TSpan;
