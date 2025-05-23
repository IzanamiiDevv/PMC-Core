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

import { CLI, Token, TokenType } from "./pmc.types";
import { Commands } from "./pmc.cmd";

async function Main(args: Token[]): Promise<void> {
    //TODO: FIX Server Startup
    try {
        const response = await fetch(`http://localhost:${process.env.PORT}/`);
        console.log(`Server is running on port ${process.env.PORT}. Status code: ${response.status}`);
    } catch (error) {
        const { execFile } = await import("child_process");
        const { createSpinner } = await import("nanospinner");

        const spinner = createSpinner(`Starting pmc_server.exe...`).start()
        execFile('pmc_server.exe', (err) => {
            if (err) PMC_Error.RunTime("Failed to start pmc_server.exe");
            spinner.success({
                text: "pmc_server.exe started successfully."
            });
        });
    }

    const cli: CLI = require("inquirer");
    args.forEach((token: Token) => {
        console.log(token);
    });
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