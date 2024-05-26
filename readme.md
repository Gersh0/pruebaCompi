
# GershoScript

## Advertencia
Por favor, ten en cuenta que este intérprete solo funciona correctamente cuando escribes la expresión con espacios entre cada token. Por ejemplo, en lugar de escribir `2+2`, debes escribir `2 + 2`; y en vez de escribir `let x=function(x){return x*2}` debes escribir `let x = function ( x ) { return x * 2 }`.

## Introducción

Este proyecto es un intérprete simple desarrollado en TypeScript. Contiene los siguientes archivos:


## ast.ts
Este archivo define la estructura del Árbol de Sintaxis Abstracta (AST) que se utiliza para representar el código fuente.

## evaluator.ts
Este archivo contiene la lógica para evaluar el AST y producir un resultado.

## lexer.ts
El archivo `lexer.ts` se encarga de dividir el código fuente en tokens, que son las unidades más pequeñas de significado en el código.

## object.ts
Este archivo define los objetos que el intérprete puede manejar, como números, cadenas y funciones.

## parser.ts
El archivo `parser.ts` toma los tokens producidos por el lexer y los organiza en un AST.

## repl.ts
El archivo `repl.ts` proporciona un bucle de lectura-evaluación-impresión (REPL) para interactuar con el intérprete.

## text.ts
Este archivo puede contener funciones auxiliares para trabajar con texto, como funciones de formato o de escape.

## token.ts
El archivo `token.ts` define los tipos de tokens que el lexer puede producir.

## Cómo usar
### Configuración inicial
Para usar este intérprete, primero instala las dependencias con `npm install`. Luego, puedes iniciar el REPL con `npm start`.
### Comandos

`mostrar`: para ver los comandos indicados anteriormente.

`borrar`: para borrar el código escaneado hasta ahora.

`adio`: para cerrar el REPL.

## Contribuir
Las contribuciones son bienvenidas. Por favor, abre un problema para discutir los cambios propuestos antes de hacer un pull request.

## Licencia
Este proyecto está licenciado bajo los términos de la licencia MIT.

