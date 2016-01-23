import React, {
    ART,
    Component,
    PropTypes
} from 'react-native';

import _ from 'lodash';
let {
    Surface,
    ClippingRectangle
} = ART;

function extractViewbox({viewbox, width, height}) {
    let x = 0;
    let y = 0;
    if (typeof viewbox === 'string') {
        let parts = viewbox.trim().split(/\s+/);
        if (parts.length === 4) {
            return {
                x: parts[0],
                y: parts[1],
                width: parts[2],
                height: parts[3]
            }
        }
    }
    return {
        x,
        y,
        width,
        height
    };
}

class Svg extends Component{
    static displayName = 'Svg';
    static propType = {
        opacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        viewbox: PropTypes.string
    };

    render() {
        let opacity = +this.props.opacity;
        let {
            x,
            y,
            width,
            height
        } = extractViewbox(this.props);
        return <Surface
            {...this.props}
            style={[
                this.props.style,
                !isNaN(opacity) && {
                    opacity: opacity
                }
            ]}
        >
            <ClippingRectangle
                x={x}
                y={y}
                width={width}
                height={height}
            >
                {this.props.children}
            </ClippingRectangle>
        </Surface>;
    }
}

export default Svg;
