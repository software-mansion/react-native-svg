import _ from 'lodash';

export default function (props, context) {
    if (context.isInGroup) {
        props = _.defaults({}, props, context, {
            isInGroup: null
        });
    }

    return props;
}
