"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASTNode = exports.Expression = exports.Statement = exports.ASTPrefix = exports.ASTStringLiteral = exports.ASTReturnStatement = exports.ASTProgram = exports.ASTLetStatement = exports.ASTInfix = exports.ASTInteger = exports.ASTIf = exports.ASTIdentifier = exports.ASTFunction = exports.ASTExpressionStatement = exports.ASTCall = exports.ASTBoolean = exports.ASTBlock = void 0;
// Abstract class for ASTNode
class ASTNode {
}
exports.ASTNode = ASTNode;
// Abstract class for Statement
class Statement extends ASTNode {
    constructor(token) {
        super();
        this.token = token;
    }
    tokenLiteral() {
        return this.token.literal;
    }
}
exports.Statement = Statement;
// Abstract class for Expression
class Expression extends ASTNode {
    constructor(token) {
        super();
        this.token = token;
    }
    tokenLiteral() {
        return this.token.literal;
    }
}
exports.Expression = Expression;
// Class for Program
class ASTProgram extends ASTNode {
    constructor(statements) {
        super();
        this.statements = statements;
    }
    tokenLiteral() {
        if (this.statements.length > 0) {
            return this.statements[0].tokenLiteral();
        }
        else {
            return '';
        }
    }
    toString() {
        return this.statements.map(s => s.toString()).join('');
    }
}
exports.ASTProgram = ASTProgram;
// Class for Identifier
class ASTIdentifier extends Expression {
    constructor(token, value) {
        super(token);
        this.value = value;
    }
    tokenLiteral() {
        return this.token.literal;
    }
    toString() {
        return this.value;
    }
}
exports.ASTIdentifier = ASTIdentifier;
// Class for LetStatement
class ASTLetStatement extends Statement {
    constructor(token, name, value) {
        super(token);
        this.name = name;
        this.value = value;
    }
    tokenLiteral() {
        return this.token.literal;
    }
    toString() {
        return `${this.tokenLiteral()} ${this.name.toString()} = ${this.value.toString()};`;
    }
}
exports.ASTLetStatement = ASTLetStatement;
// Class for ReturnStatement
class ASTReturnStatement extends Statement {
    constructor(token, returnValue) {
        super(token);
        this.returnValue = returnValue;
    }
    tokenLiteral() {
        return this.token.literal;
    }
    toString() {
        return `${this.tokenLiteral()} ${this.returnValue.toString()};`;
    }
}
exports.ASTReturnStatement = ASTReturnStatement;
// Class for ExpressionStatement
class ASTExpressionStatement extends Statement {
    constructor(token, expression) {
        super(token);
        this.expression = expression;
    }
    tokenLiteral() {
        return this.token.literal;
    }
    toString() {
        return this.expression.toString();
    }
}
exports.ASTExpressionStatement = ASTExpressionStatement;
// Class for Integer
class ASTInteger extends Expression {
    constructor(token, value) {
        super(token);
        this.value = value;
    }
    tokenLiteral() {
        return this.token.literal;
    }
    toString() {
        return this.token.literal;
    }
}
exports.ASTInteger = ASTInteger;
// Class for Prefix
class ASTPrefix extends Expression {
    constructor(token, operator, right) {
        super(token);
        this.operator = operator;
        this.right = right;
    }
    tokenLiteral() {
        return this.token.literal;
    }
    toString() {
        return `(${this.operator}${this.right.toString()})`;
    }
}
exports.ASTPrefix = ASTPrefix;
// Class for Infix
class ASTInfix extends Expression {
    constructor(token, left, operator, right) {
        super(token);
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    tokenLiteral() {
        return this.token.literal;
    }
    toString() {
        return `(${this.left.toString()} ${this.operator} ${this.right.toString()})`;
    }
}
exports.ASTInfix = ASTInfix;
// Class for Boolean
class ASTBoolean extends Expression {
    constructor(token, value) {
        super(token);
        this.value = value;
    }
    tokenLiteral() {
        return this.token.literal;
    }
    toString() {
        return this.token.literal;
    }
}
exports.ASTBoolean = ASTBoolean;
// Class for Block
class ASTBlock extends Statement {
    constructor(token, statements) {
        super(token);
        this.statements = statements;
    }
    tokenLiteral() {
        return this.token.literal;
    }
    toString() {
        return this.statements.map(s => s.toString()).join('');
    }
}
exports.ASTBlock = ASTBlock;
// Class for If
class ASTIf extends Expression {
    constructor(token, condition, consequence, alternative) {
        super(token);
        this.condition = condition;
        this.consequence = consequence;
        this.alternative = alternative;
    }
    tokenLiteral() {
        return this.token.literal;
    }
    toString() {
        let str = `if${this.condition.toString()} ${this.consequence.toString()}`;
        if (this.alternative !== null) {
            str += `else ${this.alternative.toString()}`;
        }
        return str;
    }
}
exports.ASTIf = ASTIf;
// Class for Function
class ASTFunction extends Expression {
    constructor(token, parameters, body) {
        super(token);
        this.parameters = parameters;
        this.body = body;
    }
    tokenLiteral() {
        return this.token.literal;
    }
    toString() {
        const params = this.parameters.map(p => p.toString()).join(', ');
        return `${this.tokenLiteral()}(${params}) ${this.body.toString()}`;
    }
}
exports.ASTFunction = ASTFunction;
// Class for Call
class ASTCall extends Expression {
    constructor(token, func, args) {
        super(token);
        this.function = func;
        this.arguments = args;
    }
    tokenLiteral() {
        return this.token.literal;
    }
    toString() {
        const args = this.arguments.map(a => a.toString()).join(', ');
        return `${this.function.toString()}(${args})`;
    }
}
exports.ASTCall = ASTCall;
// Class for StringLiteral
class ASTStringLiteral extends Expression {
    constructor(token, value) {
        super(token);
        this.value = value;
    }
    tokenLiteral() {
        return this.token.literal;
    }
    toString() {
        return this.token.literal;
    }
}
exports.ASTStringLiteral = ASTStringLiteral;
