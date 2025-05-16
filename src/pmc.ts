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
    const methods = ["mark","scan","del","code","new", "create"] as const;
    const Tokenized: Token[] = [];
    (methods.includes(args[2] as typeof methods[number])) ? Tokenized.push({
        token: args[2],
        type: TokenType.Argument
    }) : PMC_Error.Syntax(`Cant find ${args[2]} in methods`);
    args.splice(0, 3);
    const patterns: [RegExp, TokenType][] = [
        
    ];

    args.forEach((token: string, index: number) => {
    });

    if(Tokenized.length == 0) PMC_Error.Syntax("Invalid Syntax.");
    return Tokenized;
}