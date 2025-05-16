class PMC_Error {
    public static Syntax(message: string): void {
        console.error(`Syntax Error: ${message}`);
        process.exit(1);
    }
}

export default PMC_Error;