import React, {
    Component,
    PropTypes
} from 'react-native';
import Path from './Path';
import strokeFilter from '../lib/strokeFilter';
let propType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
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
        return <Path
            {...props}
            cx={null}
            cy={null}
            rx={null}
            ry={null}
            d={d}
        />;
    }
}

export default Ellipse;
