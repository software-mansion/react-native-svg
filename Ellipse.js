import React, {
    Component,
    PropTypes
} from 'react-native';
import {
    Surface,
    Shape
} from 'ReactNativeART';
import fillFilter from './lib/fillFilter';

let propType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired;
class Ellipse extends Component{
    static displayName = 'Polygon';
    static propTypes = {
        cx: propType,
        cy: propType,
        rx: propType,
        ry: propType
    };
    render() {
        let {cx, cy, rx, ry} = this.props;
        let d = `
            M ${cx - rx} ${cy}
            a ${rx}, ${ry} 0 1, 0 ${rx * 2}, 0
            a ${rx}, ${ry} 0 1, 0 ${-rx * 2}, 0
            Z
        `;
        return <Shape
            {...this.props}
            fill={fillFilter(this.props)}
            cx={null}
            cy={null}
            rx={null}
            ry={null}
            d={d}
        />;
    }
}

export default Ellipse;
