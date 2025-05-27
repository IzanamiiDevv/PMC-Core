process.removeAllListeners('warning');
import PMC_Error from "./pmc.error";
import os from "os";
if(os.platform() != 'win32') PMC_Error.RunTime("Invalid OS");

import { readFileSync } from "fs";
import path from "path";
import { parse } from "dotenv";
const envPath = path.join(__dirname, ".env");
const envBuffer = readFileSync(envPath);
const parsedEnv = parse(envBuffer);
for (const key in parsedEnv) process.env[key] = parsedEnv[key];
if(process.env.PORT == undefined) PMC_Error.RunTime("Undefined Server Port");

import { CLI, Token, TokenType, StructuredToken, KeyValue } from "./pmc.types";
import { Commands } from "./pmc.cmd";

async function Main(args: Token[]): Promise<void> {
    const s_token: StructuredToken = args_parse(args);

    const cli: CLI = require("inquirer");
    /*
    const fs = await import("fs");
    
    fs.readFile('./git.config.json', 'utf8', (err, jsonString) => {
        if (err) PMC_Error.RunTime("");
        try {
            const data = JSON.parse(jsonString);
        } catch (err) {
            console.error('Error parsing JSON:', err);
        }
    });
    */

    

    console.log(s_token);
}
Main(args_lexer(process.argv));

function args_lexer(args: string[]): Token[] {
    if(args.length == 2) PMC_Error.Syntax("Invalid Syntax.");
    args.splice(0, 2);
    const methods = new Set<string>();
    const required_token = new Set<string>();
    const optional_token = new Set<string>();
    Commands.forEach(({ name, flags }) => {
        methods.add(name);

        flags?.required?.forEach(flag => required_token.add(flag));
        flags?.optional?.forEach(flag => optional_token.add(flag));
    });

    (methods.has(args[0])) ? (args as unknown as Token[])[0] = {
        token: args[0],
        type: TokenType.Argument
    } as Token : PMC_Error.Syntax(`Cant find ${args[0]} in methods`);

    args.forEach((_token: string, index: number) => {
        if(index == 0) return;

        if(_token.startsWith("--")) {
            const token: string[] = [...required_token];
            const vlop = (token.map(t => `--${t}`)) as readonly string[];
            const svlop = new Set(vlop);
            (svlop.has(_token as (typeof vlop)[number])) ? (args as unknown as Token[])[index] = {
                token: _token,
                type: TokenType.LOption
            } as Token : PMC_Error.Syntax(`Cant find ${_token} in valid global flag`);
            return;
        }

        if(_token.startsWith("-")) {
            const token: string[] = [...optional_token];
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

function args_parse(args: Token[]): StructuredToken {
    const temp: StructuredToken = {
        command: args[0].token,
        required: [],
        optional: [],
    };

    const flags = new Set<string>();
    for(const command of Commands) {
        if(command.name == args[0].token) {
            const required = command.flags?.required ?? [];
            const optional = command.flags?.optional ?? [];
            required.forEach(item => flags.add(item));
            optional.forEach(item => flags.add(item));
        }
    }

    for (let i = 1; i < args.length; i++) {
        const buffer = args[i].token.replace(/-/g,'');
        if(!flags.has(buffer)) PMC_Error.Syntax(`Command "${args[0].token}" has no flags called "${buffer}"`);
        (args[i].type === TokenType.LOption ? temp.required : temp.optional).push({
            flag: buffer,
            value: (i + 1 < args.length && args[i + 1].type === TokenType.Value) ? args[++i].token : undefined
        });
    }
            
    return temp;
}