"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repl_1 = require("./lenguaje/repl");
function imprimirBienvenida() {
    const bienvenida = [
        "  ***     *   *   ***   *   *     *** ",
        " *   *   *   *  *   *  *   *    *   *",
        " *       *****  *      *****    *",
        " *       *   *  *      *   *     *",
        " *   *   *   *  *   *  *   *    *   *",
        "  ***    *   *   ***   *   *     *** "
    ];
    for (const linea of bienvenida) {
        console.log(linea.padStart(40, "*").padEnd(80, "*"));
    }
}
function main() {
    imprimirBienvenida();
    (0, repl_1.startRepl)();
}
if (require.main === module) {
    main();
}
/*
from lpp.repl import start_repl
def imprimir_bienvenida():
    bienvenida = [
        "  ***     *   *   ***   *   *     *** ",
        " *   *   *   *  *   *  *   *    *   *",
        " *       *****  *      *****    *",
        " *       *   *  *      *   *     *",
        " *   *   *   *  *   *  *   *    *   *",
        "  ***    *   *   ***   *   *     *** "
    ]
    for linea in bienvenida:
        print(linea.center(40, "*"))

imprimir_bienvenida()
def main()->None:
    imprimir_bienvenida()
    start_repl()
if __name__=='__main__':
    main()

 */ 
