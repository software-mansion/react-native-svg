import {responderProps} from '../props';
import _ from 'lodash';

export default function (props) {
    let touchable;

    return _.reduce(props, (prev, value, key) => {
        if (value && responderProps[key]) {
            prev[key] = value;

            if (!touchable) {
                touchable = true;
                prev.touchable = true;
            }
        }

        return prev;
    }, {});
}
