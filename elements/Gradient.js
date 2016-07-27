import {Children, Component} from 'react';
import percentToFloat from '../lib/percentToFloat';
import Stop from './Stop';
import Color from 'color';
import extractOpacity from '../lib/extract/extractOpacity';
import _ from 'lodash';

class Gradient extends Component{
    static displayName = 'Gradient';

    getGradient = () => {
        let stops = {};
        Children.forEach(this.props.children, child => {
            if (child.type === Stop) {
                if (child.props.stopColor && child.props.offset) {
                    // convert percent to float.
                    let offset = percentToFloat(child.props.offset);

                    // add stop
                    stops[offset] = Color(child.props.stopColor).alpha(extractOpacity(child.props.stopOpacity));
                }
            } else {
                console.warn('\'Gradient\' can only receive \'Stop\' elements as children');
            }
        });

        let sorted = _.sortBy(_.map(stops, (stop, offset) => {
            return {stop, offset};
        }), 'offset');
        let gradient = [];

        sorted.forEach(({stop}) => {
            let channels = stop.rgbaArray();
            gradient.push(channels[0] / 255);
            gradient.push(channels[1] / 255);
            gradient.push(channels[2] / 255);
            gradient.push(channels[3]);
        });

        gradient.push(...sorted.map(({offset}) => +offset));
        return gradient;
    };
}

export default Gradient;

