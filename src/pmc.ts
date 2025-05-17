process.removeAllListeners('warning');
//import { createSpinner } from "nanospinner";
import { CLI, Token, TokenType } from "./pmc.types";
import PMC_Error from "./pmc.error";

async function Main(args: Token[]): Promise<void> {
    const cli: CLI = require("inquirer");
    args.forEach((token: Token) => {
        console.log(token);
    });
}
Main(args_lexer(process.argv));

function args_lexer(args: string[]): Token[] {
    if(args.length == 2) PMC_Error.Syntax("Invalid Syntax.");
    args.splice(0, 2);
    const validMethod = ["mark","scan","del","code","new", "create"] as const;
    const methods = new Set(validMethod);

    (methods.has(args[0] as (typeof validMethod)[number])) ? (args as unknown as Token[])[0] = {
        token: args[0],
        type: TokenType.Argument
    } as Token : PMC_Error.Syntax(`Cant find ${args[0]} in methods`);

    args.forEach((_token: string, index: number) => {
        if(index == 0) return;

        if(_token.startsWith("--")) {
            const token: string[] = ["test"];
            const vlop = (token.map(t => `--${t}`)) as readonly string[];
            const svlop = new Set(vlop);
            (svlop.has(_token as (typeof vlop)[number])) ? (args as unknown as Token[])[index] = {
                token: _token,
                type: TokenType.LOption
            } as Token : PMC_Error.Syntax(`Cant find ${_token} in valid global flag`);
            return;
        }

        if(_token.startsWith("-")) {
            const token: string[] = ["test"];
            const vop = (token.map(t => `-${t}`)) as readonly string[];
            const svop = new Set(vop);
            (svop.has(_token as (typeof vop)[number])) ? (args as unknown as Token[])[index] = {
                token: _token,
                type: TokenType.Option
            } as Token : PMC_Error.Syntax(`Cant find ${_token} in valid flag`);
            return;
        }

        (args as unknown as Token[])[index] = {
            token: _token,
            type: TokenType.Value
        } as Token;
    });

    return (args as unknown as Token[]);
}