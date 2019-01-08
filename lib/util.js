export function pickNotNil(object) {
    const result = {};
    for (const [key, value] of Object.entries(object)) {
        // eslint-disable-next-line eqeqeq
        if (value != null) {
            result[key] = value;
        }
    }
    return result;
}

export const idPattern = /#([^\)]+)\)?$/;
