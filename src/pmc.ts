const TypeValue = [
    "input", "number", "confirm",
    "list", "rawlist", "expand",
    "checkbox", "password", "editor"
] as const;
type PromptType = typeof TypeValue[number];

interface PromptParameter {
    type: PromptType;
    name: string;
    message: string | Function;
    default?: string | number | boolean | Array<any> |Function;
    choices?: Array<any> | Function;
}

interface Input {
    prompt: (questions: PromptParameter) => Promise<any>
}

process.removeAllListeners('warning');
const Input: Input = require("inquirer");