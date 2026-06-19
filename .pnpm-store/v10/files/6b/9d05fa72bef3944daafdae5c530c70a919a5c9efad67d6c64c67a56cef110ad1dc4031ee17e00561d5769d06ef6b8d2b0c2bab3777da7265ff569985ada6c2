import validate from 'aproba';
import align from 'wide-align';
import { Internal, MissingTemplateValue } from './error.js';
import { TemplateItem } from './template-item.js';
import { wideTruncate } from './wide-truncate.js';
function renderValueWithValues(values) {
    return function (item) {
        return renderValue(item, values);
    };
}
const renderTemplate = function (width, template, values) {
    const items = prepareItems(width, template, values);
    const rendered = items.map(renderValueWithValues(values)).join('');
    return align.left(wideTruncate(rendered, width), width);
};
function preType(item) {
    const cappedTypeName = item.type[0].toUpperCase() + item.type.slice(1);
    return 'pre' + cappedTypeName;
}
function postType(item) {
    const cappedTypeName = item.type[0].toUpperCase() + item.type.slice(1);
    return 'post' + cappedTypeName;
}
function hasPreOrPost(item, values) {
    if (!item.type) {
        return;
    }
    return values[preType(item)] || values[postType(item)];
}
function generatePreAndPost(baseItem, parentValues) {
    const item = Object.assign({}, baseItem);
    const values = Object.create(parentValues);
    const template = [];
    const pre = preType(item);
    const post = postType(item);
    if (values[pre]) {
        template.push({ value: values[pre] });
        values[pre] = null;
    }
    item.minLength = null;
    item.length = null;
    item.maxLength = null;
    template.push(item);
    values[item.type] = values[item.type];
    if (values[post]) {
        template.push({ value: values[post] });
        values[post] = null;
    }
    return function ($1, $2, length) {
        return renderTemplate(length, template, values);
    };
}
function prepareItems(width, template, values) {
    function cloneAndObjectify(item, index, arr) {
        const cloned = new TemplateItem(item, width);
        const type = cloned.type;
        if (cloned.value == null) {
            if (!(type in values)) {
                if (cloned == null) {
                    throw MissingTemplateValue(cloned, values);
                }
                else {
                    cloned.value = cloned;
                }
            }
            else {
                cloned.value = values[type];
            }
        }
        if (cloned.value == null || cloned.value === '') {
            return null;
        }
        cloned.index = index;
        cloned.first = index === 0;
        cloned.last = index === arr.length - 1;
        if (hasPreOrPost(cloned, values)) {
            cloned.value = generatePreAndPost(cloned, values);
        }
        return cloned;
    }
    const output = template.map(cloneAndObjectify).filter(function (item) {
        return item != null;
    });
    let remainingSpace = width;
    let variableCount = output.length;
    function consumeSpace(length) {
        if (length > remainingSpace) {
            length = remainingSpace;
        }
        remainingSpace -= length;
    }
    function finishSizing(item, length) {
        if (item.finished) {
            throw Internal('Tried to finish template item that was already finished');
        }
        if (length === Infinity) {
            throw Internal('Length of template item cannot be infinity');
        }
        if (length != null) {
            item.length = length;
        }
        item.minLength = null;
        item.maxLength = null;
        --variableCount;
        item.finished = true;
        if (item.length == null) {
            item.length = item.getBaseLength();
        }
        if (item.length == null) {
            throw Internal('Finished template items must have a length');
        }
        consumeSpace(item.getLength());
    }
    output.forEach(function (item) {
        if (!item.kerning) {
            return;
        }
        const prevPadRight = item.first ? 0 : output[item.index - 1].padRight;
        if (!item.first && prevPadRight < item.kerning) {
            item.padLeft = item.kerning - prevPadRight;
        }
        if (!item.last) {
            item.padRight = item.kerning;
        }
    });
    output.forEach(function (item) {
        if (item.getBaseLength() == null) {
            return;
        }
        finishSizing(item);
    });
    let resized = 0;
    let resizing;
    let hunkSize;
    do {
        resizing = false;
        hunkSize = Math.round(remainingSpace / variableCount);
        output.forEach(function (item) {
            if (item.finished) {
                return;
            }
            if (!item.maxLength) {
                return;
            }
            if (item.getMaxLength() < hunkSize) {
                finishSizing(item, item.maxLength);
                resizing = true;
            }
        });
    } while (resizing && resized++ < output.length);
    if (resizing) {
        throw Internal('Resize loop iterated too many times while determining maxLength');
    }
    resized = 0;
    do {
        resizing = false;
        hunkSize = Math.round(remainingSpace / variableCount);
        output.forEach(function (item) {
            if (item.finished) {
                return;
            }
            if (!item.minLength) {
                return;
            }
            if (item.getMinLength() >= hunkSize) {
                finishSizing(item, item.minLength);
                resizing = true;
            }
        });
    } while (resizing && resized++ < output.length);
    if (resizing) {
        throw Internal('Resize loop iterated too many times while determining minLength');
    }
    hunkSize = Math.round(remainingSpace / variableCount);
    output.forEach(function (item) {
        if (item.finished) {
            return;
        }
        finishSizing(item, hunkSize);
    });
    return output;
}
function renderFunction(item, values, length) {
    validate('OON', arguments);
    if (item.type) {
        return item.value(values, values[item.type + 'Theme'] || {}, length);
    }
    else {
        return item.value(values, {}, length);
    }
}
function renderValue(item, values) {
    const length = item.getBaseLength();
    const value = typeof item.value === 'function' ? renderFunction(item, values, length) : item.value;
    if (value == null || value === '') {
        return '';
    }
    const alignWith = align[item.align] || align.left;
    const leftPadding = item.padLeft ? align.left('', item.padLeft) : '';
    const rightPadding = item.padRight ? align.right('', item.padRight) : '';
    const truncated = wideTruncate(String(value), length);
    const aligned = alignWith(truncated, length);
    return leftPadding + aligned + rightPadding;
}
export default renderTemplate;
//# sourceMappingURL=render-template.js.map