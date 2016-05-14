import {responderPropsKeys} from '../props';
import _ from 'lodash';

export default function (props) {
    return _.pick(props, responderPropsKeys);
}
