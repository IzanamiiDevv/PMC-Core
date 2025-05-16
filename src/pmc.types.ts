const TypeValue = [
    "input", "number", "confirm",
    "list", "rawlist", "expand",
    "checkbox", "password", "editor"
] as const;
export type PromptType = typeof TypeValue[number];

export interface PromptParameter {
    type: PromptType;
    name: string;
    message: string | Function;
    default?: string | number | boolean | Array<any> |Function;
    choices?: Array<any> | Function;
}

export interface CLI {
    prompt: (questions: PromptParameter) => Promise<any>
}

export enum TokenType {
    Option,
    LOption,
    Argument,
    Value,
}

export interface Token {
    token: string;
    type: TokenType;
}