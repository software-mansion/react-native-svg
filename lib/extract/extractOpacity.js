import _ from 'lodash';

export default function (opacity) {
    let value = +opacity;
    return (_.isNil(opacity) || isNaN(value)) ? 1 : value;
}
