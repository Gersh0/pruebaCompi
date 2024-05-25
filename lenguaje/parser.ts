import { stat } from "fs";
import { ASTBlock, ASTBoolean, 
    ASTCall, Expression, ASTExpressionStatement, 
    ASTFunction, ASTIdentifier, ASTIf, ASTInfix, 
    ASTInteger, ASTLetStatement, ASTPrefix, 
    ASTProgram, ASTReturnStatement, Statement, 
    ASTStringLiteral } from "./ast";

import { Lexer } from "./lexer";

import { Token, TokenType } from "./token";

type PrefixParseFn = () => Expression | null;
type InfixParseFn = (expression: Expression) => Expression | null;
type PrefixParseFns = Record<TokenType, PrefixParseFn>;
type InfixParseFns = Record<TokenType, InfixParseFn>;

enum Precedence {
    LOWEST = 1,
    EQUALS = 2,
    LESSGREATER = 3,
    SUM = 4,
    PRODUCT = 5,
    PREFIX = 6,
    CALL = 7
}

const PRECEDENCES: Partial<Record<TokenType, Precedence>> = {
    [TokenType.EQ]: Precedence.EQUALS,
    [TokenType.NOE]: Precedence.EQUALS,
    [TokenType.LESS_THAN]: Precedence.LESSGREATER,
    [TokenType.GREATER_THAN]: Precedence.LESSGREATER,
    [TokenType.PLUS]: Precedence.SUM,
    [TokenType.MINUS]: Precedence.SUM,
    [TokenType.SLASH]: Precedence.PRODUCT,
    [TokenType.MULTIPLICATION]: Precedence.PRODUCT,
    [TokenType.PAREN_OPEN]: Precedence.CALL,
};

export class Parser {
    private lexer: Lexer;
    private currentToken: Token | null;
    private peekToken: Token | null;
    private errors: string[];
    private prefixParseFns: Partial<PrefixParseFns>;
    private infixParseFns: Partial<InfixParseFns>;

    constructor(lexer: Lexer) {
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

    public getErrors(): string[] {
        return this.errors;
    }

    parseProgram(): ASTProgram {
        let program = new ASTProgram([]);
        
        while ((this.currentToken as Token).token_type !== TokenType.EOF) {
            let statement = this.parseStatement();
            if (statement !== null) {
                program.statements.push(statement);
            }
            this.advanceTokens();
        }
        return program;

    }


    private advanceTokens(): void {
        this.currentToken = this.peekToken;
        this.peekToken = this.lexer.nextToken();
    }

    private currentPrecedence(): Precedence {
        try {
            return PRECEDENCES[this.currentToken!.token_type]!;
        } catch (error) {
            return Precedence.LOWEST;
        }
    }

    private expectedToken(tokenType: TokenType): boolean {
        if (this.peekToken!.token_type === tokenType) {
            this.advanceTokens();
            return true;
        } else {
            this.expectedTokenError(tokenType);
            return false;
        }
    }

    private expectedTokenError(tokenType: TokenType): void {
        this.errors.push(`Expected next token to be ${tokenType}, got ${this.peekToken!.token_type} instead`);
    }

    private parseBlock(): ASTBlock {
        let block = new ASTBlock(this.currentToken!, []);
        this.advanceTokens();

        while (this.currentToken!.token_type !== TokenType.CURLY_CLOSE && this.currentToken!.token_type !== TokenType.EOF) {
            let statement = this.parseStatement();
            if (statement !== null) {
                block.statements.push(statement);
            }
            this.advanceTokens();
        }
        return block;
    }

    private parseBoolean(): ASTBoolean {
        return new ASTBoolean(this.currentToken!, this.currentToken!.token_type === TokenType.TRUE);
    }

    private parseCall(expression: Expression): ASTCall {
        let call = new ASTCall(this.currentToken!, expression, []);
        call.arguments = this.parseCallArguments()!;
        return call;
    }

    private parseCallArguments(): Expression[] | null {
        let args: Expression[] = [];
        if (this.peekToken!.token_type === TokenType.PAREN_CLOSE) {
            this.advanceTokens();
            return args;
        }

        this.advanceTokens();

        args.push(this.parseExpression(Precedence.LOWEST)!);

        while(this.peekToken!.token_type === TokenType.COMMA) {
            this.advanceTokens();
            this.advanceTokens();
            args.push(this.parseExpression(Precedence.LOWEST)!);
        }

        if(!this.expectedToken(TokenType.PAREN_CLOSE)) {
            return null;
        }
        
        return args;
    }

    private parseExpression(precedence: Precedence): Expression | null{
        try {
            let prefixParseFn = this.prefixParseFns[this.currentToken!.token_type];
            let leftExpression = prefixParseFn ? prefixParseFn() : null;
            while (this.peekToken!.token_type !== TokenType.SEMICOLON && precedence < this.peekPrecedence()) {
            try {
                let infixParseFn = this.infixParseFns[this.peekToken!.token_type];
                this.advanceTokens();
                leftExpression = infixParseFn!(leftExpression!)!;
            } catch (error) {
                return leftExpression;
            }
        }
        return leftExpression;
        } catch (error) {
            this.errors.push(`No prefix parse function for ${this.currentToken!.token_type} found`);
            return null
        }
    }

    private parseExpressionStatement(): ASTExpressionStatement | null {
        let expressionStatement = new ASTExpressionStatement(this.currentToken!, this.parseExpression(Precedence.LOWEST)!);
        if (this.peekToken!.token_type === TokenType.SEMICOLON) {
            this.advanceTokens();
        }
        return expressionStatement;
    }

    private parseGroupedExpression(): Expression | null {
        this.advanceTokens();
        let expression = this.parseExpression(Precedence.LOWEST);
        if (!this.expectedToken(TokenType.PAREN_CLOSE)) {
            return null;
        }
        return expression;
    }

    private parseFunction(): ASTFunction | null {
        let func = new ASTFunction(this.currentToken!, [], new ASTBlock(this.currentToken!, []));

        if (!this.expectedToken(TokenType.PAREN_OPEN)) {
            return null;
        }

        func.parameters = this.parseFunctionParameters();

        if(!this.expectedToken(TokenType.CURLY_OPEN)) {
            return null;
        }

        func.body = this.parseBlock();

        return func;
    }

    private parseFunctionParameters(): ASTIdentifier[] {
        let params: ASTIdentifier[] = [];

        if (this.peekToken!.token_type === TokenType.PAREN_CLOSE) {
            this.advanceTokens();
            return params;
        }

        this.advanceTokens();

        let identifier = new ASTIdentifier(this.currentToken!, this.currentToken!.literal);
        params.push(identifier);

        while(this.peekToken!.token_type === TokenType.COMMA) {
            this.advanceTokens();
            this.advanceTokens();
            identifier = new ASTIdentifier(this.currentToken!, this.currentToken!.literal);
            params.push(identifier);
        }

        if (!this.expectedToken(TokenType.PAREN_CLOSE)) {
            return [];
        }

        return params;
    }

    private parseIdentifier(): ASTIdentifier {
        return new ASTIdentifier(this.currentToken!, this.currentToken!.literal);
    }

    private parseIf(): ASTIf | null {
        let ifExpression = new ASTIf(this.currentToken!, null, null, null);

        if (!this.expectedToken(TokenType.PAREN_OPEN)) {
            return null;
        }

        this.advanceTokens();
        ifExpression.condition = this.parseExpression(Precedence.LOWEST)!;

        if (!this.expectedToken(TokenType.CURLY_OPEN)) {
            return null;
        }

        ifExpression.consequence = this.parseBlock();

        if (this.peekToken!.token_type === TokenType.ELSE) {
            this.advanceTokens();
            this.advanceTokens();

            if (!this.expectedToken(TokenType.CURLY_OPEN)) {
                return null;
            }

            ifExpression.alternative = this.parseBlock();
        }

        return ifExpression;
    }

    private parseInfixExpression(left: Expression): ASTInfix {
        let infix = new ASTInfix(this.currentToken!, left, this.currentToken!.literal, null);
        let precedence = this.currentPrecedence();
        this.advanceTokens();
        infix.right = this.parseExpression(precedence);
        return infix;
    }

    private parseInteger(): ASTInteger | null{
        try{
            let integer = new ASTInteger(this.currentToken!, parseInt(this.currentToken!.literal));
            return integer;
        } catch (error) {
            this.errors.push(`Could not parse ${this.currentToken!.literal} as integer`);
            return null;
        }
    }

    private parseLetStatement(): ASTLetStatement | null {
        let letStatement = new ASTLetStatement(this.currentToken!, new ASTIdentifier(this.currentToken!, this.currentToken!.literal), null);

        if (!this.expectedToken(TokenType.IDENT)) {
            return null;
        }

        if (!this.expectedToken(TokenType.ASSIGN)) {
            return null;
        }

        this.advanceTokens();

        letStatement.value = this.parseExpression(Precedence.LOWEST);

        if (this.peekToken!.token_type === TokenType.SEMICOLON) {
            this.advanceTokens();
        }

        return letStatement;
    }

    private parsePrefixExpression(): ASTPrefix | null {
        let prefix = new ASTPrefix(this.currentToken!, this.currentToken!.literal, null);
        this.advanceTokens();
        prefix.right = this.parseExpression(Precedence.PREFIX);
        return prefix;
    }

    private parseReturnStatement(): ASTReturnStatement | null {
        let returnStatement = new ASTReturnStatement(this.currentToken!, null);
        this.advanceTokens();
        returnStatement.returnValue = this.parseExpression(Precedence.LOWEST);

        if (this.peekToken!.token_type === TokenType.SEMICOLON) {
            this.advanceTokens();
        }

        return returnStatement;
    }

    private parseStatement(): Statement | null {
        switch(this.currentToken!.token_type) {
            case TokenType.LET:
                return this.parseLetStatement();
            case TokenType.RETURN:
                return this.parseReturnStatement();
            default:
                return this.parseExpressionStatement();
        }
    }

    private peekPrecedence(): Precedence {
        try {
            return PRECEDENCES[this.peekToken!.token_type]!;
        } catch (error) {
            return Precedence.LOWEST;
        }
    }

    private registerInfixFns(): Partial<InfixParseFns> {
        return{
            [TokenType.PLUS]: this.parseInfixExpression.bind(this),
            [TokenType.MINUS]: this.parseInfixExpression.bind(this),
            [TokenType.SLASH]: this.parseInfixExpression.bind(this),
            [TokenType.MULTIPLICATION]: this.parseInfixExpression.bind(this),
            [TokenType.EQ]: this.parseInfixExpression.bind(this),
            [TokenType.NOE]: this.parseInfixExpression.bind(this),
            [TokenType.LESS_THAN]: this.parseInfixExpression.bind(this),
            [TokenType.GREATER_THAN]: this.parseInfixExpression.bind(this),
            [TokenType.PAREN_OPEN]: this.parseCall.bind(this)

        };
    }

    private registerPrefixFns(): Partial<PrefixParseFns> {
        return {
            [TokenType.FALSE]: this.parseIdentifier.bind(this),
            [TokenType.FUNCTION]: this.parseInteger.bind(this),
            [TokenType.IDENT]: this.parseBoolean.bind(this),
            [TokenType.IF]: this.parseBoolean.bind(this),
            [TokenType.INT]: this.parseStringLiteral.bind(this),
            [TokenType.PAREN_OPEN]: this.parsePrefixExpression.bind(this),
            [TokenType.MINUS]: this.parsePrefixExpression.bind(this),
            [TokenType.NOT]: this.parseGroupedExpression.bind(this),
            [TokenType.TRUE]: this.parseIf.bind(this),
            [TokenType.STRING]: this.parseFunction.bind(this)
        };
    }

    private parseStringLiteral(): ASTStringLiteral {
        return new ASTStringLiteral(this.currentToken!, this.currentToken!.literal);
    }
}