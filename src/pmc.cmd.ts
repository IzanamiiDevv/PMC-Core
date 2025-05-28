interface Command {
    name: string,
    flags?: {
        required?: string[],
        optional?: string[]
    },
    syntax_string: string,
    description: string
}

const Commands = new Set<Command>();

Commands.add({
    name: "create",
    flags: {
        required: ["git", "local", "name"],
        optional: ["language", "lang"]
    },
    syntax_string: "pmc create -name <name> <[-git <link>] or [-local]> <optional>",
    description: "Creates a new project workspace from a git repo or local environment."
});

Commands.add({
    name: "list",
    flags: {
        optional: ["language", "lang", "git", "local", "status", "name", "tag"]
    },
    syntax_string: "pmc list <optional>",
    description: "Lists all managed projects, optionally filtered by various flags."
});

Commands.add({
    name: "delete",
    flags: {
        optional: ["name", "id"]
    },
    syntax_string: "pmc delete <optional>",
    description: "Deletes a specified project using its name or ID."
});

Commands.add({
    name: "code",
    flags: {
        optional: ["name", "id"]
    },
    syntax_string: "pmc code <optional>",
    description: "Opens a project in the default code editor."
});

Commands.add({
    name: "set",
    flags: {
        required: ["name", "id"],
        optional: ["status", "language", "lang"]
    },
    syntax_string: "pmc set <[-name <name>] or [-id <id>]> <optional>",
    description: "Updates metadata for a project like status or language."
});

Commands.add({
    name: "help",
    syntax_string: "pmc help <optional>",
    description: "Displays help information for all or specific commands."
});

Commands.add({
    name: "backup",
    flags: {
        required: ["name", "id"],
        optional: ["o", "out", "zip"]
    },
    syntax_string: "pmc backup <[-name <name>] or [-id <id>]> <optional>",
    description: "Creates a backup of a project with optional output path or zip compression."
});

Commands.add({
    name: "tag",
    flags: {
        required: ["name", "id"],
        optional: ["create", "remove"]
    },
    syntax_string: "pmc tag <[-name <name>] or [-id <id>]> <[-create <tagname>] or [-remove <tagname>]>",
    description: "Adds or removes tags from a project."
});

Commands.add({
    name: "commit",
    flags: {
        optional: ["scope", "type"]
    },
    syntax_string: "pmc commit <optional>",
    description: "Commit a Project with"
});

export { Commands, Command };