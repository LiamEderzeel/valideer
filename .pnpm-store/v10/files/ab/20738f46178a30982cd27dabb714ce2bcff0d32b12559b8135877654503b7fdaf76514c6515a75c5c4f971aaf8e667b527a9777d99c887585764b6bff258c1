import input from '@inquirer/input';
import select from '@inquirer/select';
export declare function promptConfirmation(message: string): Promise<boolean>;
type SelectConfigChoices = Partial<Parameters<typeof select>[0]>;
export declare function promptSelectOne(message: string, { choices }?: SelectConfigChoices): Promise<string>;
type InputConfig = Parameters<typeof input>[0];
export declare function promptTextInput(message: string, { filter, validate }: Partial<Pick<InputConfig, 'validate'> & {
    filter?: (value: string) => string | null;
}>): Promise<string>;
export {};
