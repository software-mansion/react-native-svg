import React, {
    Component,
    PropTypes,
    ART,
    Children
} from 'react-native';
let {
    Group
} = ART;
import {set, remove} from '../lib/fillFilter';
import percentFactory from '../lib/percentFactory';
import percentToFloat from '../lib/percentToFloat';
import Stop from './Stop';
import Color from 'color';
class RadialGradient extends Component{
    static displayName = 'Gradient';

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

    render(distanceProps, fromPercent, fromNumber) {
        let stops = {};
        Children.forEach(this.props.children, child => {
            if (child.type === Stop && child.props.stopColor && child.props.offset) {
                // convert percent to float.
                let offset = percentToFloat(child.props.offset);

                // add stop
                stops[offset] = Color(child.props.stopColor).alpha(+child.props.stopOpacity);

                let factories = percentFactory(...distanceProps);
                if (factories) {
                    set(this.id, fromPercent.bind(null, factories, stops));
                } else {
                    set(this.id, fromNumber.bind(null, stops));
                }
            } else {
                console.warn(`'RadialGradient' can only receive 'Stop' elements as children`);
            }
        });
        return <Group />;
    }
}

export default RadialGradient;

