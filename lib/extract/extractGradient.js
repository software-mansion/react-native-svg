import {Children} from 'react';
import _ from 'lodash';
import Color from 'color';

import extractOpacity from './extractOpacity';
import extractTransform from './extractTransform';
import PATTERN_UNITS from '../PATTERN_UNITS';
import percentToFloat from '../percentToFloat';
import Stop from '../../elements/Stop';

export default function(props) {
    if (!props.id) {
        return null;
    }

    const stops = {};
    Children.forEach(props.children, child => {
        if (child.type === Stop) {
            if (child.props.stopColor && child.props.offset) {
                // convert percent to float.
                let offset = percentToFloat(child.props.offset);

                // add stop
                stops[offset] = Color(child.props.stopColor).alpha(extractOpacity(child.props.stopOpacity));
            }
        } else {
            console.warn('`Gradient` elements only accept `Stop` elements as children');
        }
    });

    const sorted = _.sortBy(_.map(stops, (stop, offset) => {
        return {stop, offset};
    }), 'offset');

    const gradient = [];

    sorted.forEach(({stop}) => {
        let channels = stop.rgbaArray();
        gradient.push(channels[0] / 255);
        gradient.push(channels[1] / 255);
        gradient.push(channels[2] / 255);
        gradient.push(channels[3]);
    });

    gradient.push(...sorted.map(({offset}) => +offset));


    let gradientTransform;
    if (props.transform) {
        gradientTransform = extractTransform(props.transform);
    } else {
        gradientTransform = extractTransform(props);
    }

    return {
        gradient,
        name: props.id,
        gradientTransform,
        gradientUnits: PATTERN_UNITS[props.gradientUnits] || 0
    };
}
