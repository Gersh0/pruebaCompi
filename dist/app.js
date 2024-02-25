import { startRepl } from './lenguaje/repl.js';
function main() {
    startRepl();
}
if (require.main === module) {
    main();
}
