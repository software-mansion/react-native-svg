
// eslint-disable-next-line eqeqeq
export const notNil = a => a != null;

export function pick(object, props) {
    const result = {};
    for (let prop of props) {
        result[prop] = object[prop];
    }
    return result;
}

export function pickBy(object, pred) {
    const result = {};
    for (let prop of Object.keys(object)) {
        const val = object[prop];
        if (pred(val)) {
            result[prop] = val;
        }
    }
    return result;
}
