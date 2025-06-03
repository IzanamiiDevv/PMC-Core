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

export interface KeyValue {
    flag: string,
    value: string | undefined,
}

export interface StructuredToken {
    command: string;
    required: KeyValue[];
    optional: KeyValue[];
}

interface GitType {
    type: string;
    desc: string;
}

export interface GITCONFIGJSON {
    location: string | null;
    types: GitType[];
    git_cmd: string | null;
}

export interface PROJECTLISTJSON {
    printedName: string;
    id: string;
    path: string;
    langauge: string[];
    author: string;
    type: "git" | "local";
}