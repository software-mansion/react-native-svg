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
class Circle extends Component{
    static displayName = 'Polygon';
    static propTypes = {
        cx: propType,
        cy: propType,
        r: propType
    };
    render() {
        let {cx, cy, r} = this.props;
        let d = `
            M ${cx} ${cy}
            m -${r}, 0
            a ${r}, ${r} 0 1, 0 ${r * 2}, 0
            a ${r}, ${r} 0 1, 0 ${-r * 2}, 0
            Z
        `;
        return <Shape
            {...this.props}
            fill={fillFilter(this.props)}
            cx={null}
            cy={null}
            r={null}
            d={d}
        />;
    }
}

export default Circle;
