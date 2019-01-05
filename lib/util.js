// eslint-disable-next-line eqeqeq
export const notNil = a => a != null;

export function pick(object, keys) {
    const result = {};
    for (let key of keys) {
        result[key] = object[key];
    }
    return result;
}

export function pickBy(object, predicate) {
    const result = {};
    for (let [key, value] of Object.entries(object)) {
        if (predicate(value)) {
            result[key] = value;
        }
    }
    return result;
}
