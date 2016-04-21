import React, {
    Component,
    PropTypes
} from 'react-native';

import Path from './Path';

let propType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

function processRadius(radius) {
    radius = +radius;
    return radius || 0;
}

function getR(props) {
    let {
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

    return {
        rx,
        ry
    };
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
    static getPath = (props, r) => {
        let {
            x,
            y,
            width,
            height
        } = props;

        if (!r) {
            r = getR(props);

        }
        
        let {rx, ry} = r;


        return (rx || ry) ? `
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
    };

    render() {
        let r = getR(this.props);
        return <Path
            {...this.props}
            width={null}
            height={null}
            x={r.rx || null}
            y={null}
            d={Rect.getPath(this.props, r)}
        />;
    }
}

export default Rect;
