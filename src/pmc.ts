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

import { CLI, Token, TokenType, StructuredToken, KeyValue, GITCONFIGJSON } from "./pmc.types";
import { Commands } from "./pmc.cmd";

async function Main(args: Token[]): Promise<void> {
    const s_token: StructuredToken = args_parse(args);

    const cli: CLI = require("inquirer");
    switch (s_token.command) {
        case "new": {

        }

        case "commit": {
            const fs = await import("fs/promises");
            
            try {
                const json_data = await fs.readFile('./git.config.json', 'utf8');
                const data: GITCONFIGJSON = JSON.parse(json_data);
                const commitbuffer: {
                    [key: string]: string | undefined,
                } = {"scope": undefined, "type": undefined};
                if(data.git_cmd == null || !run_git(data.git_cmd)) {
                    const { exec } = await import("child_process");
                    const { promisify } = await import("util");
                    const execPromise = promisify(exec);

                    const shellscript = `powershell -command "& { Add-Type -AssemblyName System.Windows.Forms; $f = New-Object System.Windows.Forms.FolderBrowserDialog; $f.Description = 'Select Git Folder'; $f.ShowNewFolderButton = $false; if ($f.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { $f.SelectedPath }}"`;
                    const { stdout, stderr } = await execPromise(shellscript);
                    if(stderr) throw new Error("Cant execute file selector");
                    const folderPath = stdout.trim();
                    const isValid = await run_git(`${folderPath}/cmd`);
                    if(!isValid) throw new Error("Invalid git path");
                    data.git_cmd = `${folderPath}\\cmd`;
                    await fs.writeFile('./git.config.json', JSON.stringify(data));
                }

                s_token.optional.forEach(({flag, value}) => {
                    if(value == undefined) PMC_Error.RunTime(`Undefined value of ${flag}`);
                    if(flag == "type" && !data.types.map(({type}) => type).includes(value as string)) PMC_Error.Syntax(`"${value}" is not a commit type`);
                    commitbuffer[flag] = value;
                });
                const entries = Object.entries(commitbuffer);
                for (const [key, value] of entries) {
                    if(value != undefined) continue;
                    const response = await cli.prompt({
                        name: "data",
                        message: (key == "scope") ? "Scope:" : "Select Commit Type:",
                        type: (key == "scope") ? "input" : "list",
                        default: (key == "scope") ? "Project" : undefined,
                        choices: (key == "type") ? data.types.map(({type, desc}) => `${type}: ${desc}`) : undefined
                    });

                    commitbuffer[key] = (key == "type") ? (response.data as string).split(":")[0].trim() : response.data;
                }

                const request_message = await cli.prompt({
                    name: "data",
                    message: "Commit Message:",
                    type: "input"
                });
                let message: string = request_message.data;

                const request_argv = await cli.prompt({
                    name: "data",
                    message: "Git Flag:",
                    type: "input",
                });
                let argv: string = request_argv.data;

                console.log(`git commit -m "${commitbuffer["type"]}(${commitbuffer["scope"]}): ${message}" ${argv}`);


                
            } catch(err) {
                PMC_Error.RunTime(`${err}`);
            }

            break;
        }
        default: {
            const response = await fetch(`http://localhost:${process.env.PORT}/cmd_${s_token.command}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(s_token),
            });

            if(response.status != 200) PMC_Error.RunTime(`Error on executing "${s_token.command}"`);
            const data = await response.text();
            console.log(data);

            break;
        }
    }
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

async function run_git(gitpath: string): Promise<boolean> {
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const execPromise = promisify(exec);

    const { stderr } = await execPromise(`"${gitpath}\\git.exe" --version`);
    return !stderr;
}