import { Token, TokenType } from './token'; // Adjust the path according to your project structure
import { Lexer } from './lexer'; // Adjust the path according to your project structure
import * as readline from 'readline'; // For reading input in Node.js

export function startRepl(): void {
    console.log("Bienvenido a GershoScript");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const promptForInput = (): void => {
        rl.question(">>> ", (source: string) => {
            if (source === "adio") {
                rl.close();
            } else {
                const lexer = new Lexer(source);
                let token = lexer.nextToken();
                while (token.token_type !== TokenType.EOF) {
                    console.log(token);
                    token = lexer.nextToken();
                }
                promptForInput(); // Recursively prompt for input again
            }
        });
    };

    promptForInput(); // Start the REPL loop
}
