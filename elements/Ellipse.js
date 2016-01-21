import React, {
    Component,
    PropTypes,
    ART
} from 'react-native';
import fillFilter from '../lib/fillFilter';
import strokeFilter from '../lib/strokeFilter';

let {
    Shape
} = ART;

let propType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired;
class Ellipse extends Component{
    static displayName = 'Ellipse';
    static propTypes = {
        cx: propType,
        cy: propType,
        rx: propType,
        ry: propType
    };
    render() {
        let {props} = this;
        let {cx, cy, rx, ry} = this.props;
        let d = `
            M ${cx - rx} ${cy}
            a ${rx}, ${ry} 0 1, 0 ${rx * 2}, 0
            a ${rx}, ${ry} 0 1, 0 ${-rx * 2}, 0
            Z
        `;
        return <Shape
            {...props}
            fill={fillFilter(props)}
            stroke={strokeFilter(props)}
            strokeCap={null}
            strokeJoin={null}
            cx={null}
            cy={null}
            rx={null}
            ry={null}
            d={d}
        />;
    }
}

export default Ellipse;
