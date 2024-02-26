import { startRepl } from './lenguaje/repl';

function main(): void {
    startRepl();
}

if (require.main === module) {
    main();
}

