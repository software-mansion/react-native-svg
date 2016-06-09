import {responderProps, touchableProps} from '../props';
import _ from 'lodash';

export default function (props) {
    let responsible;
    let touchable;

    return _.reduce(props, (prev, value, key) => {
        if (value && (responderProps[key] || touchableProps[key])) {
            prev[key] = value;
            if (!responsible) {
                responsible = true;
                prev.responsible = true;
            }
            if (!touchable && touchableProps[key]) {
                touchable = true;
                prev.touchable = true;
            }
        }

        return prev;
    }, {
        responsible: false,
        touchable: false
    });
}
