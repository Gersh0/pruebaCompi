import {TokenType} from './token';
import { Lexer } from './lexer';
import * as readline from 'node:readline';

export async function startRepl(): Promise<void> {
    console.log("Bienvenido a GershoScript");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let source = '';
    while (source !== "adio") {
        source = await new Promise<string>((resolve) => {
            rl.question(">>> ", (input: string) => {
                resolve(input);
            });
        });

        const lexer = new Lexer(source);
        let token = lexer.nextToken();
        while (token.token_type !== TokenType.EOF) {
            console.log(token );
            token = lexer.nextToken();
        }
    }
    rl.close();
}