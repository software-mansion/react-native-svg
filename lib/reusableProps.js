import {RenderableOnlyAttributes} from '../lib/attributes';
import _ from 'lodash';

export default function (extractedProps, originProps) {
    let reusableProps = [];
    Object.keys(RenderableOnlyAttributes).forEach(name => {
        if (!_.isNil(originProps[name])) {
            // clipPath prop may provide `clipPathRef` as native prop
            if (name === 'clipPath') {
                if (extractedProps[name]) {
                    reusableProps.push(name);
                } else if (extractedProps.clipPathRef) {
                    reusableProps.push('clipPathRef');
                }
            } else {
                reusableProps.push(name);
            }
        }
    });

    return reusableProps;
}
