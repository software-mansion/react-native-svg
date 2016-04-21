import React, {
    Component,
    PropTypes
} from 'react-native';
import Path from './Path';
let propType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
class Ellipse extends Component{
    static displayName = 'Ellipse';
    static propTypes = {
        cx: propType,
        cy: propType,
        rx: propType,
        ry: propType
    };

    static getPath = props => {
        let {cx, cy, rx, ry} = props;
        return `
            M ${cx - rx} ${cy}
            a ${rx}, ${ry} 0 1, 0 ${rx * 2}, 0
            a ${rx}, ${ry} 0 1, 0 ${-rx * 2}, 0
            Z
        `;
    };

    render() {
        let {props} = this;
        let d = Ellipse.getPath(this.props);
        return <Path
            {...props}
            d={d}
        />;
    }
}

export default Ellipse;
