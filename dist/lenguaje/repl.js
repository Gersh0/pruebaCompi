"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startRepl = void 0;
const token_1 = require("./token"); // Adjust the path according to your project structure
const lexer_1 = require("./lexer"); // Adjust the path according to your project structure
const readline = require("readline"); // For reading input in Node.js
const parser_1 = require("./parser"); // Adjust the path according to your project structure
const object_1 = require("./object"); // Adjust the path according to your project structure
const evaluator_1 = require("./evaluator"); // Adjust the path according to your project structure
function startRepl() {
    console.log("Bienvenido a GershoScript");
    const EOF_TOKEN = new token_1.Token(token_1.TokenType.EOF, '');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    //para que sea multilinea, se usa scanned como una lista de Strings
    let scanned = [];
    const promptForInput = () => {
        rl.question(">>> ", (source) => {
            if (source === "adio") {
                rl.close();
            }
            else if (source === "borrar") {
                scanned = [];
                promptForInput();
            }
            else if (source === "mostrar") {
                console.log(scanned.join("\n"));
                promptForInput();
            }
            else {
                scanned.push(source);
                const lexer = new lexer_1.Lexer(" " + scanned);
                let token = lexer.nextToken();
                let parser = new parser_1.Parser(lexer);
                let program = parser.parseProgram();
                let env = new object_1.Environment();
                if (parser.getErrors().length > 0) {
                    printParseErrors(parser.getErrors());
                    promptForInput(); // Recursively prompt for input again
                    return;
                }
                let evaluated = (0, evaluator_1.evaluate)(program, env);
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
exports.startRepl = startRepl;
function printParseErrors(errors) {
    for (let error of errors) {
        console.log(error);
    }
}
