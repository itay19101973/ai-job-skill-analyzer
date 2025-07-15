
// Recursive formatter for any object entries
export const formatDatesInQueryObject = (queryObj) => {
    if (Array.isArray(queryObj)) {
        return queryObj.map(formatDatesInQueryObject);
    } else if (queryObj && typeof queryObj === 'object') {
        const newObj = {};
        for (const [key, value] of Object.entries(queryObj)) {
            if (
                typeof value === 'string' &&
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(value)
            ) {
                newObj[key] = new Date(value);
            } else if (value && typeof value === 'object') {
                newObj[key] = formatDatesInQueryObject(value);
            } else {
                newObj[key] = value;
            }
        }
        return newObj;
    }
    return queryObj;
};