import React, {
    Component,
    PropTypes,
    ART
} from 'react-native';

import Path from './Path';

let propType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

function processRadius(radius) {
    radius = +radius;
    return radius || 0;
}

class Rect extends Component{
    static displayName = 'Rect';
    static propTypes = {
        x: propType,
        y: propType,
        width: propType,
        height: propType,
        rx: propType,
        ry: propType,
        strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round']),
        strokeCap: PropTypes.oneOf(['butt', 'square', 'round']),
        strokeLinejoin: PropTypes.oneOf(['miter', 'bevel', 'round']),
        strokeJoin: PropTypes.oneOf(['miter', 'bevel', 'round'])
    };
    static defaultProps = {
        x: 0,
        y: 0,
        rx: 0,
        ry: 0
    };
    render() {
        let {props} = this;
        let {
            x,
            y,
            width,
            height,
            rx,
            ry
        } = props;

        rx = processRadius(rx);
        ry = processRadius(ry);

        if ((rx && !ry) || (ry && !rx)) {
            if (rx) {
                ry = rx;
            } else {
                rx = ry;
            }
        }

        if (rx > width / 2) {
            rx = width / 2;
        }
        if (ry > height / 2) {
            ry = height / 2;
        }

        let d = (rx || ry) ? `
            M ${x}, ${y}
            h ${width - 2 * rx}
            a ${rx},${ry} 0 0 1 ${rx},${ry}
            v ${height - 2 * ry}
            a ${rx},${ry} 0 0 1 ${-rx},${ry}
            h ${2 * rx - width}
            a ${rx},${ry} 0 0 1 ${-rx},${-ry}
            v ${2 * ry - height}
            a ${rx},${ry} 0 0 1 ${rx},${-ry}
            Z
        ` : `
             M ${x}, ${y}
             h ${width}
             v ${height}
             h ${-width}
             Z
        `;
        return <Path
            {...props}
            rx={null}
            ry={null}
            width={null}
            height={null}
            x={rx || null}
            y={null}
            d={d}
        />;
    }
}

export default Rect;
