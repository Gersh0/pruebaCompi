import { Token } from './token';

// Abstract class for ASTNode
abstract class ASTNode {
    // Abstract method tokenLiteral
    abstract tokenLiteral(): string;
    // Abstract method string
    abstract toString(): string;
}

// Abstract class for Statement
abstract class Statement extends ASTNode {
    token: Token;
    constructor(token: Token) {
        super();
        this.token = token;
    }
    tokenLiteral(): string {
        return this.token.literal;
    }
}

// Abstract class for Expression
abstract class Expression extends ASTNode {
    token: Token;
    constructor(token: Token) {
        super();
        this.token = token;
    }
    tokenLiteral(): string {
        return this.token.literal;
    }
}

// Class for Program
class ASTProgram extends ASTNode {
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
class ASTIdentifier extends Expression {
    value: string;
    constructor(token: Token, value: string) {
        super(token);
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
class ASTLetStatement extends Statement {
    name: ASTIdentifier | null;
    value: Expression | null;
    constructor(token: Token, name: ASTIdentifier | null, value: Expression | null) {
        super(token);
        this.name = name;
        this.value = value;
    }
    tokenLiteral(): string {
        return this.token.literal;
    }
    toString(): string {
        return `${this.tokenLiteral()} ${this.name!.toString()} = ${this.value!.toString()};`;
    }
}

// Class for ReturnStatement
class ASTReturnStatement extends Statement {
    returnValue: Expression | null;
    constructor(token: Token, returnValue: Expression | null) {
        super(token);
        this.returnValue = returnValue;
    }
    tokenLiteral(): string {
        return this.token.literal;
    }
    toString(): string {
        return `${this.tokenLiteral()} ${this.returnValue!.toString()};`;
    }
}

// Class for ExpressionStatement
class ASTExpressionStatement extends Statement {
    expression: Expression;
    constructor(token: Token, expression: Expression) {
        super(token);
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
class ASTInteger extends Expression {
    value: number;
    constructor(token: Token, value: number) {
        super(token);
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
class ASTPrefix extends Expression {
    operator: string;
    right: Expression | null;
    constructor(token: Token, operator: string, right: Expression | null) {
        super(token);
        this.operator = operator;
        this.right = right;
    }
    tokenLiteral(): string {
        return this.token.literal;
    }
    toString(): string {
        return `(${this.operator}${this.right!.toString()})`;
    }
}

// Class for Infix
class ASTInfix extends Expression {
    left: Expression;
    operator: string;
    right: Expression | null;
    constructor(token: Token, left: Expression, operator: string, right: Expression | null) {
        super(token);
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    tokenLiteral(): string {
        return this.token.literal;
    }
    toString(): string {
        return `(${this.left.toString()} ${this.operator} ${this.right!.toString()})`;
    }
}

// Class for Boolean
class ASTBoolean extends Expression {
    value: boolean;
    constructor(token: Token, value: boolean) {
        super(token);
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
class ASTBlock extends Statement {
    statements: Statement[];
    constructor(token: Token, statements: Statement[]) {
        super(token);
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
class ASTIf extends Expression {
    condition: Expression | null;
    consequence: ASTBlock | null;
    alternative: ASTBlock | null;
    constructor(token: Token, condition: Expression | null, consequence: ASTBlock | null, alternative: ASTBlock | null) {
        super(token);
        this.condition = condition;
        this.consequence = consequence;
        this.alternative = alternative;
    }
    tokenLiteral(): string {
        return this.token.literal;
    }
    toString(): string {
        let str = `if${this.condition!.toString()} ${this.consequence!.toString()}`;
        if (this.alternative !== null) {
            str += `else ${this.alternative.toString()}`;
        }
        return str;
    }
}

// Class for Function
class ASTFunction extends Expression {
    parameters: ASTIdentifier[];
    body: ASTBlock;
    constructor(token: Token, parameters: ASTIdentifier[], body: ASTBlock) {
        super(token);
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
class ASTCall extends Expression {
    function: Expression;
    arguments: Expression[];
    constructor(token: Token, func: Expression, args: Expression[]) {
        super(token);
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
class ASTStringLiteral extends Expression {
    value: string;
    constructor(token: Token, value: string) {
        super(token);
        this.value = value;
    }
    tokenLiteral(): string {
        return this.token.literal;
    }
    toString(): string {
        return this.token.literal;
    }
}

export {
    ASTBlock,
    ASTBoolean,
    ASTCall,
    ASTExpressionStatement,
    ASTFunction,
    ASTIdentifier,
    ASTIf,
    ASTInteger,
    ASTInfix,
    ASTLetStatement,
    ASTProgram,
    ASTReturnStatement,
    ASTStringLiteral,
    ASTPrefix,
    Statement,
    Expression,
    ASTNode
};