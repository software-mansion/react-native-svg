import _ from 'lodash';
export default function (stops, opacity) {
    return _.reduce(stops, (ret, color, key) => {
        ret[key] = color.alpha(opacity).rgbaString();
        return ret;
    }, {});
}
