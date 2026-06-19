import { format } from 'node:util';
const User = (msg) => {
    const err = new Error(msg);
    Error.captureStackTrace(err, User);
    err.code = 'EGAUGE';
    return err;
};
export function MissingTemplateValue(item, values) {
    const err = User(format('Missing template value "%s"', item.type));
    Error.captureStackTrace(err, MissingTemplateValue);
    err.template = item;
    err.values = values;
    return err;
}
export function Internal(msg) {
    const err = new Error(msg);
    Error.captureStackTrace(err, Internal);
    err.code = 'EGAUGEINTERNAL';
    return err;
}
export default { User, MissingTemplateValue, Internal };
//# sourceMappingURL=error.js.map