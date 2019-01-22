export function pickNotNil(object) {
    const result = {};
    const keys = Object.keys(object);
    const l = keys.length;
    for (let i = 0; i < l; i++) {
        const key = keys[i];
        const value = object[key];
        // eslint-disable-next-line eqeqeq
        if (value != null) {
            result[key] = value;
        }
    }
    return result;
}

export const idPattern = /#([^)]+)\)?$/;
