import React, {
    Component,
    PropTypes,
    ART,
    Children
} from 'react-native';
let {
    RadialGradient: ARTRadialGradient
} = ART;
import stopsOpacity from '../lib/stopsOpacity';
import Gradient from './Gradient';
let propType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
class RadialGradient extends Gradient{
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

        if (r) {
            rx = ry = +r;
        }
        let gradientProps = [fx, fy, rx, ry, cx, cy];
        return super.render(
            gradientProps,
            function (factories, stops, boundingBox, opacity) {
                let {x1,y1,width, height} = boundingBox;
                return new ARTRadialGradient(
                    stopsOpacity(stops, opacity),
                    x1 + factories[0](width),
                    y1 + factories[1](height),
                    factories[2](width),
                    factories[3](height),
                    x1 + factories[4](width),
                    y1 + factories[5](height)
                );
            },
            function (stops, opacity) {
                return new ARTRadialGradient(stopsOpacity(stops, opacity), ...gradientProps);
            }
        );
    }
}

export default RadialGradient;

