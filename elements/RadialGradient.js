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
                let matched = child.props.offset.match(percentReg);
                let offset = matched[2] ? matched[1] / 100 : matched[1];

                // add stop
                stops[offset] = Color(child.props.stopColor).alpha(+child.props.stopOpacity).rgbaString();

                // TODO: convert percent to float.
                set(this.id, new ARTRadialGradient(stops, fx, fy, rx, ry, cx, cy));

            } else {
                console.warn(`'RadialGradient' can only receive 'Stop' elements as children`);
            }
        });
        return <Group />;
    }
}

export default RadialGradient;

