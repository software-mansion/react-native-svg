import extractBrush from './extractBrush';
import extractOpacity from './extractOpacity';

const fillRules = {
    evenodd: 0,
    nonzero: 1
};

export default function(props) {
    return {
        fill: extractBrush(props.fill),
        fillOpacity: extractOpacity(props.fillOpacity),
        fillRule: fillRules[props.fillRule] === 0 ? 0 : 1
    };
}
