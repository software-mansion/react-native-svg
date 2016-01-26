import React, {
    Component,
    PropTypes,
    ART,
    Children
} from 'react-native';
let {
    Group,
    RadialGradient: ARTRadialGradient
} = ART;
import {set, remove} from '../lib/fillFilter';
import percentFactory from '../lib/percentFactory';
import percentToFloat from '../lib/percentToFloat';
import Stop from './Stop';
import Color from 'color';
let percentReg = /^(\-?\d+(?:\.\d+)?)(%?)$/;
let propType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
class RadialGradient extends Component{
    static displayName = 'RadialGradient';
    static propTypes = {
        fx: propType,
        fy: propType,
        rx: propType,
        ry: propType,
        cx: propType,
        cy: propType,
        r: propType,
        id: PropTypes.string
    };

    constructor() {
        super(...arguments);
        this.id = this.props.id + ':' + this.props.svgId;
    }

    componentWillReceiveProps = nextProps => {
        let id = nextProps.id + ':' + nextProps.svgId;
        if (id !== this.id) {
            remove(this.id);
        }
    };

    componentWillUnmount = () => {
        remove(this.id);
    };

    render() {
        let {
            fx,
            fy,
            rx,
            ry,
            cx,
            cy,
            r
        } = this.props;

        // TODO: render differently from svg in html
        if (r) {
            rx = ry = +r;
        }
        let stops = {};
        Children.forEach(this.props.children, child => {
            if (child.type === Stop && child.props.stopColor && child.props.offset) {
                // convert percent to float.
                let offset = percentToFloat(child.props.offset);

                // add stop
                stops[offset] = Color(child.props.stopColor).alpha(+child.props.stopOpacity).rgbaString();


                let factories = percentFactory(fx, fy, rx, ry, cx, cy);
                if (factories) {
                    set(this.id, function (boundingBox) {
                        let {x1,y1,width, height} = boundingBox;
                        return new ARTRadialGradient(
                            stops,
                            x1 + factories[0](width),
                            y1 + factories[1](height),
                            factories[2](width),
                            factories[3](height),
                            x1 + factories[4](width),
                            y1 + factories[5](height)
                        );
                    });
                } else {
                    set(this.id, new ARTRadialGradient(stops, fx, fy, rx, ry, cx, cy));
                }
            } else {
                console.warn(`'RadialGradient' can only receive 'Stop' elements as children`);
            }
        });
        return <Group />;
    }
}

export default RadialGradient;

