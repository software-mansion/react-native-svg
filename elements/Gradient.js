import React, {
    Component,
    Children
} from 'react-native';
import {NativeGroup} from './G';
import {set, remove} from '../lib/extract/patterns';
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

    render(generator) {
        let stops = {};
        Children.forEach(this.props.children, child => {
            if (child.type === Stop && child.props.stopColor && child.props.offset) {
                // convert percent to float.
                let offset = percentToFloat(child.props.offset);

                // add stop
                stops[offset] = Color(child.props.stopColor).alpha(+child.props.stopOpacity);
                set(this.id, generator.bind(null, stops));
            } else {
                console.warn(`'RadialGradient' can only receive 'Stop' elements as children`);
            }
        });
        return <NativeGroup />;
    }
}

export default RadialGradient;

