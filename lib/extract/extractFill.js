import extractBrush from './extractBrush';
import extractOpacity from './extractOpacity';
import _ from 'lodash';

const fillRules = {
    evenodd: 0,
    nonzero: 1
};

export default function(props) {
    return {
        // default fill is black
        fill: extractBrush(_.isNil(props.fill) ? '#000' : props.fill),
        fillOpacity: extractOpacity(props.fillOpacity),
        fillRule: fillRules[props.fillRule] === 0 ? 0 : 1
    };
}
