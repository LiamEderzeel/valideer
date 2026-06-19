import expand from '@inquirer/expand';
import input from '@inquirer/input';
import select from '@inquirer/select';
import { log } from '@lerna-lite/npmlog';
export async function promptConfirmation(message) {
    log.pause();
    const answers = await expand({
        message,
        default: 'h',
        choices: [
            { key: 'y', name: 'Yes', value: true },
            { key: 'n', name: 'No', value: false },
        ],
    });
    log.resume();
    return answers;
}
export async function promptSelectOne(message, { choices } = {}) {
    log.pause();
    const answers = await select({
        message,
        choices: choices,
        pageSize: choices.length,
    });
    log.resume();
    return answers;
}
export async function promptTextInput(message, { filter, validate }) {
    log.pause();
    const promptResult = await input({
        message,
        validate,
    });
    const finalResult = promptResult && typeof filter === 'function' ? filter(promptResult) : promptResult;
    log.resume();
    return finalResult;
}
//# sourceMappingURL=prompt.js.map