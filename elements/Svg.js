import React, {
    ART,
    Component,
    PropTypes,
    Children,
    cloneElement
} from 'react-native';

import _ from 'lodash';
let {
    Surface,
    Group
} = ART;

function extractViewbox({viewbox, width, height, preserveAspectRatio}) {
    if (!viewbox || !width || !height) {
        return false;
    }

    if (typeof viewbox === 'string') {
        let parts = viewbox.trim().split(/\s+/);
        let vw = +parts[2];
        let vh = +parts[3];

        // width or height can`t be negative
        if (vw < 0 || vh < 0 || parts.length !== 4) {
            return false;
        }

        // width or height equals zero disable render
        if (!vw || !vh) {
            return {
                x: 0,
                y: 0,
                scaleX: 0,
                scaleY: 0
            }
        }

        let vx = +parts[0] || 0;
        let vy = +parts[1] || 0;
        let preserve = preserveAspectRatio !== 'none';
        let scaleX = 1;
        let scaleY = 1;
        let x = 0;
        let y = 0;
        let sx = width / vw;
        let sy = height / vh;

        if (preserve) {
            scaleX = sx;
            scaleY = sy;
            x = -vx * sx;
            y = -vy * sy;
        } else {
            scaleX = scaleY = Math.min(sx, sy);
            x = width / 2 - Math.min(vw, vh) * scaleX / 2 - vx * scaleX;
            y = 0 - vy * scaleX;

            if (sx < sy) {
                [x, y] = [y, x];
            }
        }


        return {
            x,
            y,
            scaleX,
            scaleY
        };
    }
    return false;
}

let id = 0;

class Svg extends Component{
    static displayName = 'Svg';
    static propType = {
        opacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        viewbox: PropTypes.string,
        // TODO: complete other values of preserveAspectRatio
        // http://www.justinmccandless.com/demos/viewbox/index.html
        // http://tutorials.jenkov.com/svg/svg-viewport-view-box.html
        preserveAspectRatio: PropTypes.string // preserveAspectRatio only supports 'none' for now
    };

    constructor() {
        super(...arguments);
        id++;
        this.id = id;
    }

    getChildren = () => {
        return Children.map(this.props.children, child => {
            return cloneElement(child, {
                svgId: this.id
            });
        });
    };

    render() {
        let opacity = +this.props.opacity;
        let viewbox = extractViewbox(this.props);
        if (viewbox) {
            let {scaleX, scaleY} = viewbox;

            return <Surface
                {...this.props}
                style={[
                this.props.style,
                !isNaN(opacity) && {
                    opacity: opacity
                }
            ]}
            >
                {(!scaleX || !scaleY) ? null :
                <Group
                    x={viewbox.x}
                    y={viewbox.y}
                    scaleX={scaleX}
                    scaleY={scaleY}
                >
                    {this.getChildren()}
                </Group>}
            </Surface>;
        }

        return <Surface
            {...this.props}
            style={[
                this.props.style,
                !isNaN(opacity) && {
                    opacity: opacity
                }
            ]}
        >
            {this.getChildren()}
        </Surface>;
    }
}

export default Svg;
