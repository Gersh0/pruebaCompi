import { TokenType } from './token'; // Assuming the path to your token module
import { Lexer } from './lexer'; // Assuming the path to your lexer module
import * as readline from 'node:readline';

export function startRepl(): void {
    console.log("Bienvenido a GershoScript");
    const readline = require("readline");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(">>> ", (source: string) => {
        while (source !== "adio") {
            const lexer = new Lexer(source);
            let token = lexer.nextToken();
            while (token.token_type !== TokenType.EOF) {
                console.log(token);
                token = lexer.nextToken();
            }
            rl.question(">>> ", (newSource: string) => {
                source = newSource;
            });
        }
        rl.close();
    });
}