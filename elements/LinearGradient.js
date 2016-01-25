import React, {
    Component,
    PropTypes,
    ART,
    Children
} from 'react-native';
let {
    Group,
    LinearGradient: ARTLinearGradient
} = ART;
import {set, remove} from '../lib/fillFilter';
import Stop from './Stop';
import Color from 'color';
let percentReg = /^(\-?\d+(?:\.\d+)?)(%?)$/;
let propType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
class LinearGradient extends Component{
    static displayName = 'LinearGradient';
    static propTypes = {
        x1: propType,
        x2: propType,
        y1: propType,
        y2: propType,
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
            x1,
            y1,
            x2,
            y2
        } = this.props;
        let stops = {};
        Children.forEach(this.props.children, child => {
            if (child.type === Stop && child.props.stopColor && child.props.offset) {

                // convert percent to float.
                let matched = child.props.offset.match(percentReg);
                let offset = matched[2] ? matched[1] / 100 : matched[1];

                // add stop
                stops[offset] = Color(child.props.stopColor).alpha(+child.props.stopOpacity).rgbaString();

                // TODO:  convert percent to float.
                set(this.id, new ARTLinearGradient(stops, x1, y1, x2, y2));
            } else {
                console.warn(`'LinearGradient' can only receive 'Stop' elements as children`);
            }
        });
        return <Group />;
    }
}

export default LinearGradient;

