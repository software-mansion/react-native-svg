import _ from 'lodash';
export default function (stops, opacity) {
    if (isNaN(opacity)) {
        opacity = 1;
    }

    return _.reduce(stops, (ret, color, key) => {
        ret[key] = color.alpha(color.alpha() * opacity).rgbaString();
        return ret;
    }, {});
}
