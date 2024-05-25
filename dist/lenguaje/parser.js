"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const ast_1 = require("./ast");
const token_1 = require("./token");
var Precedence;
(function (Precedence) {
    Precedence[Precedence["LOWEST"] = 1] = "LOWEST";
    Precedence[Precedence["EQUALS"] = 2] = "EQUALS";
    Precedence[Precedence["LESSGREATER"] = 3] = "LESSGREATER";
    Precedence[Precedence["SUM"] = 4] = "SUM";
    Precedence[Precedence["PRODUCT"] = 5] = "PRODUCT";
    Precedence[Precedence["PREFIX"] = 6] = "PREFIX";
    Precedence[Precedence["CALL"] = 7] = "CALL";
})(Precedence || (Precedence = {}));
const PRECEDENCES = {
    [token_1.TokenType.EQ]: Precedence.EQUALS,
    [token_1.TokenType.NOE]: Precedence.EQUALS,
    [token_1.TokenType.LESS_THAN]: Precedence.LESSGREATER,
    [token_1.TokenType.GREATER_THAN]: Precedence.LESSGREATER,
    [token_1.TokenType.PLUS]: Precedence.SUM,
    [token_1.TokenType.MINUS]: Precedence.SUM,
    [token_1.TokenType.SLASH]: Precedence.PRODUCT,
    [token_1.TokenType.MULTIPLICATION]: Precedence.PRODUCT,
    [token_1.TokenType.PAREN_OPEN]: Precedence.CALL,
};
class Parser {
    constructor(lexer) {
        this.lexer = lexer;
        this.errors = [];
        this.currentToken = null;
        this.peekToken = null;
        // Initialize prefix and infix parse functions
        this.prefixParseFns = this.registerPrefixFns();
        this.infixParseFns = this.registerInfixFns();
        this.advanceTokens();
        this.advanceTokens();
    }
    getErrors() {
        return this.errors;
    }
    parseProgram() {
        let program = new ast_1.ASTProgram([]);
        while (this.currentToken.token_type !== token_1.TokenType.EOF) {
            let statement = this.parseStatement();
            if (statement !== null) {
                program.statements.push(statement);
            }
            this.advanceTokens();
        }
        return program;
    }
    advanceTokens() {
        this.currentToken = this.peekToken;
        this.peekToken = this.lexer.nextToken();
    }
    currentPrecedence() {
        try {
            return PRECEDENCES[this.currentToken.token_type];
        }
        catch (error) {
            return Precedence.LOWEST;
        }
    }
    expectedToken(tokenType) {
        if (this.peekToken.token_type === tokenType) {
            this.advanceTokens();
            return true;
        }
        else {
            this.expectedTokenError(tokenType);
            return false;
        }
    }
    expectedTokenError(tokenType) {
        this.errors.push(`Expected next token to be ${tokenType}, got ${this.peekToken.token_type} instead`);
    }
    parseBlock() {
        let block = new ast_1.ASTBlock(this.currentToken, []);
        this.advanceTokens();
        while (this.currentToken.token_type !== token_1.TokenType.CURLY_CLOSE && this.currentToken.token_type !== token_1.TokenType.EOF) {
            let statement = this.parseStatement();
            if (statement !== null) {
                block.statements.push(statement);
            }
            this.advanceTokens();
        }
        return block;
    }
    parseBoolean() {
        return new ast_1.ASTBoolean(this.currentToken, this.currentToken.token_type === token_1.TokenType.TRUE);
    }
    parseCall(expression) {
        let call = new ast_1.ASTCall(this.currentToken, expression, []);
        call.arguments = this.parseCallArguments();
        return call;
    }
    parseCallArguments() {
        let args = [];
        if (this.peekToken.token_type === token_1.TokenType.PAREN_CLOSE) {
            this.advanceTokens();
            return args;
        }
        this.advanceTokens();
        args.push(this.parseExpression(Precedence.LOWEST));
        while (this.peekToken.token_type === token_1.TokenType.COMMA) {
            this.advanceTokens();
            this.advanceTokens();
            args.push(this.parseExpression(Precedence.LOWEST));
        }
        if (!this.expectedToken(token_1.TokenType.PAREN_CLOSE)) {
            return null;
        }
        return args;
    }
    parseExpression(precedence) {
        try {
            let prefixParseFn = this.prefixParseFns[this.currentToken.token_type];
            let leftExpression = prefixParseFn ? prefixParseFn() : null;
            while (this.peekToken.token_type !== token_1.TokenType.SEMICOLON && precedence < this.peekPrecedence()) {
                try {
                    let infixParseFn = this.infixParseFns[this.peekToken.token_type];
                    this.advanceTokens();
                    leftExpression = infixParseFn(leftExpression);
                }
                catch (error) {
                    return leftExpression;
                }
            }
            return leftExpression;
        }
        catch (error) {
            this.errors.push(`No prefix parse function for ${this.currentToken.token_type} found`);
            return null;
        }
    }
    parseExpressionStatement() {
        let expressionStatement = new ast_1.ASTExpressionStatement(this.currentToken, this.parseExpression(Precedence.LOWEST));
        if (this.peekToken.token_type === token_1.TokenType.SEMICOLON) {
            this.advanceTokens();
        }
        return expressionStatement;
    }
    parseGroupedExpression() {
        this.advanceTokens();
        let expression = this.parseExpression(Precedence.LOWEST);
        if (!this.expectedToken(token_1.TokenType.PAREN_CLOSE)) {
            return null;
        }
        return expression;
    }
    parseFunction() {
        let func = new ast_1.ASTFunction(this.currentToken, [], new ast_1.ASTBlock(this.currentToken, []));
        if (!this.expectedToken(token_1.TokenType.PAREN_OPEN)) {
            return null;
        }
        func.parameters = this.parseFunctionParameters();
        if (!this.expectedToken(token_1.TokenType.CURLY_OPEN)) {
            return null;
        }
        func.body = this.parseBlock();
        return func;
    }
    parseFunctionParameters() {
        let params = [];
        if (this.peekToken.token_type === token_1.TokenType.PAREN_CLOSE) {
            this.advanceTokens();
            return params;
        }
        this.advanceTokens();
        let identifier = new ast_1.ASTIdentifier(this.currentToken, this.currentToken.literal);
        params.push(identifier);
        while (this.peekToken.token_type === token_1.TokenType.COMMA) {
            this.advanceTokens();
            this.advanceTokens();
            identifier = new ast_1.ASTIdentifier(this.currentToken, this.currentToken.literal);
            params.push(identifier);
        }
        if (!this.expectedToken(token_1.TokenType.PAREN_CLOSE)) {
            return [];
        }
        return params;
    }
    parseIdentifier() {
        return new ast_1.ASTIdentifier(this.currentToken, this.currentToken.literal);
    }
    parseIf() {
        let ifExpression = new ast_1.ASTIf(this.currentToken, null, null, null);
        if (!this.expectedToken(token_1.TokenType.PAREN_OPEN)) {
            return null;
        }
        this.advanceTokens();
        ifExpression.condition = this.parseExpression(Precedence.LOWEST);
        if (!this.expectedToken(token_1.TokenType.CURLY_OPEN)) {
            return null;
        }
        ifExpression.consequence = this.parseBlock();
        if (this.peekToken.token_type === token_1.TokenType.ELSE) {
            this.advanceTokens();
            this.advanceTokens();
            if (!this.expectedToken(token_1.TokenType.CURLY_OPEN)) {
                return null;
            }
            ifExpression.alternative = this.parseBlock();
        }
        return ifExpression;
    }
    parseInfixExpression(left) {
        let infix = new ast_1.ASTInfix(this.currentToken, left, this.currentToken.literal, null);
        let precedence = this.currentPrecedence();
        this.advanceTokens();
        infix.right = this.parseExpression(precedence);
        return infix;
    }
    parseInteger() {
        try {
            let integer = new ast_1.ASTInteger(this.currentToken, parseInt(this.currentToken.literal));
            return integer;
        }
        catch (error) {
            this.errors.push(`Could not parse ${this.currentToken.literal} as integer`);
            return null;
        }
    }
    parseLetStatement() {
        let letStatement = new ast_1.ASTLetStatement(this.currentToken, new ast_1.ASTIdentifier(this.currentToken, this.currentToken.literal), null);
        if (!this.expectedToken(token_1.TokenType.IDENT)) {
            return null;
        }
        if (!this.expectedToken(token_1.TokenType.ASSIGN)) {
            return null;
        }
        this.advanceTokens();
        letStatement.value = this.parseExpression(Precedence.LOWEST);
        if (this.peekToken.token_type === token_1.TokenType.SEMICOLON) {
            this.advanceTokens();
        }
        return letStatement;
    }
    parsePrefixExpression() {
        let prefix = new ast_1.ASTPrefix(this.currentToken, this.currentToken.literal, null);
        this.advanceTokens();
        prefix.right = this.parseExpression(Precedence.PREFIX);
        return prefix;
    }
    parseReturnStatement() {
        let returnStatement = new ast_1.ASTReturnStatement(this.currentToken, null);
        this.advanceTokens();
        returnStatement.returnValue = this.parseExpression(Precedence.LOWEST);
        if (this.peekToken.token_type === token_1.TokenType.SEMICOLON) {
            this.advanceTokens();
        }
        return returnStatement;
    }
    parseStatement() {
        switch (this.currentToken.token_type) {
            case token_1.TokenType.LET:
                return this.parseLetStatement();
            case token_1.TokenType.RETURN:
                return this.parseReturnStatement();
            default:
                return this.parseExpressionStatement();
        }
    }
    peekPrecedence() {
        try {
            return PRECEDENCES[this.peekToken.token_type];
        }
        catch (error) {
            return Precedence.LOWEST;
        }
    }
    registerInfixFns() {
        return {
            [token_1.TokenType.PLUS]: this.parseInfixExpression.bind(this),
            [token_1.TokenType.MINUS]: this.parseInfixExpression.bind(this),
            [token_1.TokenType.SLASH]: this.parseInfixExpression.bind(this),
            [token_1.TokenType.MULTIPLICATION]: this.parseInfixExpression.bind(this),
            [token_1.TokenType.EQ]: this.parseInfixExpression.bind(this),
            [token_1.TokenType.NOE]: this.parseInfixExpression.bind(this),
            [token_1.TokenType.LESS_THAN]: this.parseInfixExpression.bind(this),
            [token_1.TokenType.GREATER_THAN]: this.parseInfixExpression.bind(this),
            [token_1.TokenType.PAREN_OPEN]: this.parseCall.bind(this)
        };
    }
    registerPrefixFns() {
        return {
            [token_1.TokenType.FALSE]: this.parseIdentifier.bind(this),
            [token_1.TokenType.FUNCTION]: this.parseInteger.bind(this),
            [token_1.TokenType.IDENT]: this.parseBoolean.bind(this),
            [token_1.TokenType.IF]: this.parseBoolean.bind(this),
            [token_1.TokenType.INT]: this.parseStringLiteral.bind(this),
            [token_1.TokenType.PAREN_OPEN]: this.parsePrefixExpression.bind(this),
            [token_1.TokenType.MINUS]: this.parsePrefixExpression.bind(this),
            [token_1.TokenType.NOT]: this.parseGroupedExpression.bind(this),
            [token_1.TokenType.TRUE]: this.parseIf.bind(this),
            [token_1.TokenType.STRING]: this.parseFunction.bind(this)
        };
    }
    parseStringLiteral() {
        return new ast_1.ASTStringLiteral(this.currentToken, this.currentToken.literal);
    }
}
exports.Parser = Parser;
