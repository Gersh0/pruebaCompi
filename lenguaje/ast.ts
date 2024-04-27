import { Token, TokenType } from './token';

// Abstract class for ASTNode
abstract class ASTNode {
    // Abstract method tokenLiteral
    abstract tokenLiteral(): string;
    // Abstract method string
    abstract toString(): string;
}

// Abstract class for Statement
abstract class Statement extends ASTNode {}

// Abstract class for Expression
abstract class Expression extends ASTNode {}

// Class for Program
class Program extends ASTNode {
    statements: Statement[];
    constructor(statements: Statement[]) {
        super();
        this.statements = statements;
    }
    tokenLiteral(): string {
        if (this.statements.length > 0) {
            return this.statements[0].tokenLiteral();
        } else {
            return '';
        }
    }
    toString(): string {
        return this.statements.map(s => s.toString()).join('');
    }
}

// Class for Identifier
export class Identifier extends Expression {
    token: Token;
    value: string;
    constructor(token: Token, value: string) {
        super();
        this.token = token;
        this.value = value;
    }
    tokenLiteral(): string {
        return this.token.literal;
    }
    toString(): string {
        return this.value;
    }
}

// Class for LetStatement
class LetStatement extends Statement {
    token: Token;
    name: Identifier;
    value: Expression;
    constructor(token: Token, name: Identifier, value: Expression) {
        super();
        this.token = token;
        this.name = name;
        this.value = value;
    }
    tokenLiteral(): string {
        return this.token.literal;
    }
    toString(): string {
        return `${this.tokenLiteral()} ${this.name.toString()} = ${this.value.toString()};`;
    }
}

// Class for ReturnStatement
class ReturnStatement extends Statement {
    token: Token;
    returnValue: Expression;
    constructor(token: Token, returnValue: Expression) {
        super();
        this.token = token;
        this.returnValue = returnValue;
    }
    tokenLiteral(): string {
        return this.token.literal;
    }
    toString(): string {
        return `${this.tokenLiteral()} ${this.returnValue.toString()};`;
    }
}

// Class for ExpressionStatement
class ExpressionStatement extends Statement {
    token: Token;
    expression: Expression;
    constructor(token: Token, expression: Expression) {
        super();
        this.token = token;
        this.expression = expression;
    }
    tokenLiteral(): string {
        return this.token.literal;
    }
    toString(): string {
        return this.expression.toString();
    }
}

// Class for Integer
class Integer extends Expression {
    token: Token;
    value: number;
    constructor(token: Token, value: number) {
        super();
        this.token = token;
        this.value = value;
    }
    tokenLiteral(): string {
        return this.token.literal;
    }
    toString(): string {
        return this.token.literal;
    }
}

// Class for Prefix
class Prefix extends Expression {
    token: Token;
    operator: string;
    right: Expression;
    constructor(token: Token, operator: string, right: Expression) {
        super();
        this.token = token;
        this.operator = operator;
        this.right = right;
    }
    tokenLiteral(): string {
        return this.token.literal;
    }
    toString(): string {
        return `(${this.operator}${this.right.toString()})`;
    }
}

// Class for Infix
class Infix extends Expression {
    token: Token;
    left: Expression;
    operator: string;
    right: Expression;
    constructor(token: Token, left: Expression, operator: string, right: Expression) {
        super();
        this.token = token;
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    tokenLiteral(): string {
        return this.token.literal;
    }
    toString(): string {
        return `(${this.left.toString()} ${this.operator} ${this.right.toString()})`;
    }
}

// Class for Boolean
class Boolean extends Expression {
    token: Token;
    value: boolean;
    constructor(token: Token, value: boolean) {
        super();
        this.token = token;
        this.value = value;
    }
    tokenLiteral(): string {
        return this.token.literal;
    }
    toString(): string {
        return this.token.literal;
    }
}

// Class for Block
export class Block extends Statement {
    token: Token;
    statements: Statement[];
    constructor(token: Token, statements: Statement[]) {
        super();
        this.token = token;
        this.statements = statements;
    }
    tokenLiteral(): string {
        return this.token.literal;
    }
    toString(): string {
        return this.statements.map(s => s.toString()).join('');
    }
}

// Class for If
class If extends Expression {
    token: Token;
    condition: Expression;
    consequence: Block;
    alternative: Block | null;
    constructor(token: Token, condition: Expression, consequence: Block, alternative: Block | null) {
        super();
        this.token = token;
        this.condition = condition;
        this.consequence = consequence;
        this.alternative = alternative;
    }
    tokenLiteral(): string {
        return this.token.literal;
    }
    toString(): string {
        let str = `if${this.condition.toString()} ${this.consequence.toString()}`;
        if (this.alternative !== null) {
            str += `else ${this.alternative.toString()}`;
        }
        return str;
    }
}

// Class for Function
class Function extends Expression {
    token: Token;
    parameters: Identifier[];
    body: Block;
    constructor(token: Token, parameters: Identifier[], body: Block) {
        super();
        this.token = token;
        this.parameters = parameters;
        this.body = body;
    }
    tokenLiteral(): string {
        return this.token.literal;
    }
    toString(): string {
        const params = this.parameters.map(p => p.toString()).join(', ');
        return `${this.tokenLiteral()}(${params}) ${this.body.toString()}`;
    }
}

// Class for Call
class Call extends Expression {
    token: Token;
    function: Expression;
    arguments: Expression[];
    constructor(token: Token, func: Expression, args: Expression[]) {
        super();
        this.token = token;
        this.function = func;
        this.arguments = args;
    }
    tokenLiteral(): string {
        return this.token.literal;
    }
    toString(): string {
        const args = this.arguments.map(a => a.toString()).join(', ');
        return `${this.function.toString()}(${args})`;
    }
}

// Class for StringLiteral
class StringLiteral extends Expression {
    token: Token;
    value: string;
    constructor(token: Token, value: string) {
        super();
        this.token = token;
        this.value = value;
    }
    tokenLiteral(): string {
        return this.token.literal;
    }
    toString(): string {
        return this.token.literal;
    }
}