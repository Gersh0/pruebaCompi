import { Token, TokenType } from './token'; // Adjust the path according to your project structure
import { Lexer } from './lexer'; // Adjust the path according to your project structure
import * as readline from 'readline'; // For reading input in Node.js
import { Parser } from './parser'; // Adjust the path according to your project structure
import { Environment } from './object'; // Adjust the path according to your project structure
import { evaluate } from './evaluator'; // Adjust the path according to your project structure
import { ASTProgram } from './ast';


export function startRepl(): void {
    console.log("Bienvenido a GershoScript");

    const EOF_TOKEN: Token = new Token(TokenType.EOF, '');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    //para que sea multilinea, se usa scanned como una lista de Strings
    let scanned: string[] = [];
    
    const promptForInput = (): void => {
        rl.question(">>> ", (source: string) => {
            if (source === "adio") {
                rl.close();
            } else if (source === "borrar") {
                scanned = [];
                promptForInput();
            } else if (source === "mostrar") {
                console.log(scanned.join("\n"));
                promptForInput();
            } else {
                scanned.push(source);
                const lexer = new Lexer(" "+scanned);
                let token = lexer.nextToken();
                
                let parser: Parser = new Parser(lexer);
                let program = parser.parseProgram();
                let env: Environment = new Environment();
                if (parser.getErrors().length > 0) {
                    printParseErrors(parser.getErrors());
                    promptForInput(); // Recursively prompt for input again
                    return;
                }
                
                let evaluated = evaluate(program, env);

                if (evaluated !== null) {
                   console.log(evaluated.inspect());
                }
                /*
                while (token.token_type !== TokenType.EOF) {
                    console.log(token);
                    token = lexer.nextToken();
                }
                */
                
                promptForInput(); // Recursively prompt for input again
            }
        });
    };

    promptForInput(); // Start the REPL loop
}


function printParseErrors(errors: string[]): void {
    for (let error of errors) {
        console.log(error);
    }
}


