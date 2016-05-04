/**
 * Format potential percentage props
 *
 * convert somet props like those
 *   width="50%"
 *   height="500"
 *
 * to
 *   {
 *      width: {
 *          percentage: true,
 *          value: 0.5
 *      },
 *      height: {
 *          percentage: false,
 *          value: 500
 *      }
 *   }
 *
 *
 */
import percentToFloat from './percentToFloat';

function percentageTransform(value) {
    if (typeof value === 'number') {
        return {
            percentage: false,
            value
        };
    }

    let float = percentToFloat(value);

    return {
        percentage: float !== +value,
        value: float
    }
}

export default class {
    constructor(props, list) {
        this.shape = {};
        list.forEach(name => {
            if (props[name] != null) {
                this.shape[name] = percentageTransform(props[name]);
            }
        });
    }

    toJSON = () => {
        return this.shape;
    };
};

