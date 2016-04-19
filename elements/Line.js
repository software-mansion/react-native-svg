import React, {
    Component,
    PropTypes,
    ReactNativeBaseComponent,
    ART
} from 'react-native';
let {
    Shape,
    Path
    } = ART;

import strokeFilter from '../lib/strokeFilter';
import transformFilter from '../lib/transformFilter';
let propType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

class Line extends Component{
    static displayName = 'Line';
    static propTypes = {
        x1: propType,
        x2: propType,
        y1: propType,
        y2: propType,
        strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round']),
        strokeCap: PropTypes.oneOf(['butt', 'square', 'round'])
    };


    _convertPath = (props = this.props) => {
        return `M${props.x1},${props.y1}L${props.x2},${props.y2}Z`;
    };

    setNativeProps = (props) => {
        let nativeProps = {};
        if (props.x1 || props.x2 || props.y1 || props.y2) {
            let path = this._convertPath(Object.assign({}, this.props, props));
            nativeProps.d = new Path(path).toJSON();
        } else if (props.strokeLinecap || props.strokeCap) {
            // TODO:
        }

        this.refs.shape.setNativeProps(nativeProps);
    };

    render() {
        return <Shape
            {...this.props}
            ref="shape"
            {...strokeFilter(this.props)}
            {...transformFilter(this.props)}
            x1={null}
            y1={null}
            x2={null}
            y2={null}
            fill={null}
            d={this._convertPath()}
        />;
    }
}

export default Line;
