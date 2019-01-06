export function pick(object, keys) {
    const result = {};
    for (let key of keys) {
        result[key] = object[key];
    }
    return result;
}

export function pickNotNil(object) {
    const result = {};
    for (let [key, value] of Object.entries(object)) {
        // eslint-disable-next-line eqeqeq
        if (value != null) {
            result[key] = value;
        }
    }
    return result;
}
