import React, {
    Component,
    PropTypes,
    requireNativeComponent,
    cloneElement
} from 'react-native';

import Defs from './Defs';
import createReactNativeComponentClass from 'react-native/Libraries/ReactNative/createReactNativeComponentClass';
import calculateBoundingBox from '../lib/calculateBoundingBox';
import extractProps from '../lib/extractProps';
import SerializablePath from 'react-native/Libraries/ART/ARTSerializablePath';
import {PathAttributes} from '../lib/attributes';


let propType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
class Path extends Component{
    static displayName = 'Path';
    static propTypes = {
        visible: PropTypes.bool,
        d: PropTypes.string,
        x: propType,
        y: propType,
        strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round']),
        strokeCap: PropTypes.oneOf(['butt', 'square', 'round']),
        strokeLinejoin: PropTypes.oneOf(['miter', 'bevel', 'round']),
        strokeJoin: PropTypes.oneOf(['miter', 'bevel', 'round']),
        strokeDasharray: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.number)])
    };

    _dimensions = null;

    componentWillReceiveProps = nextProps => {
        if (nextProps.d !== this.props.d) {
            this._dimensions = null;
        }
    };

    getBoundingBox = () => {
        if (!this._dimensions) {
            this._dimensions =  calculateBoundingBox(this.props.d);
        }

        return this._dimensions;
    };

    render() {
        let {props} = this;
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
            <NativePath
                {...extractProps.call(this, props)}
                d={d}
            />
        );
    }
}

let NativePath = createReactNativeComponentClass({
    validAttributes: PathAttributes,
    uiViewClassName: 'RNSVGPath'
});

export default Path;
