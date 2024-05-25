export enum TokenType {
    ASSIGN = "=",
    STRING = "STRING",
    COMMA = ",",
    EOF = "EOF",
    ILLEGAL = "ILLEGAL",
    PLUS = "+",
    MULTIPLICATION = "*",
    SEMICOLON = ";",
    PAREN_OPEN = "(",
    PAREN_CLOSE = ")",
    BRACKET_OPEN = "[",
    BRACKET_CLOSE = "]",
    CURLY_OPEN = "{",
    CURLY_CLOSE =  "}",
    MINUS = "-",
    CARET = "^",
    SLASH = "/",
    LESS_THAN = "<",
    GREATER_THAN = ">",
    GTE = ">=",
    LTE = "<=",
    NOE = "!=",
    NOT = "!",
    EQ = "==",
    IDENT = "IDENT", // declaración de la variable, o el nombre interno de la variable
    TRUE = "TRUE",
    INT = "INT",
    FALSE = "FALSE",
    IF = "IF",
    ELSE = "ELSE",
    RETURN = "RETURN",
    FUNCTION = "FUNCTION",
    LET = "LET"
}

export class Token {
export class Token {
    token_type: TokenType;
    literal: string;
    literal: string;

    constructor(token_type: TokenType, literal: string) {
    constructor(token_type: TokenType, literal: string) {
        this.token_type = token_type;
        this.literal = literal;
    }
    public static lookup_token_type(literal: string): TokenType {
        const keywords: Record<string, TokenType> = {
            'false': TokenType.FALSE,
            'true': TokenType.TRUE,
            'if': TokenType.IF,
            'else': TokenType.ELSE,
            'return': TokenType.RETURN,
            'function': TokenType.FUNCTION,
            'let': TokenType.LET
        };
        return keywords[literal.toLowerCase()] || TokenType.ILLEGAL;
        this.literal = literal;
    }
    public static lookup_token_type(literal: string): TokenType {
        const keywords: Record<string, TokenType> = {
            'false': TokenType.FALSE,
            'true': TokenType.TRUE,
            'if': TokenType.IF,
            'else': TokenType.ELSE,
            'return': TokenType.RETURN,
            'function': TokenType.FUNCTION,
            'let': TokenType.LET
        };
        return keywords[literal.toLowerCase()] || TokenType.ILLEGAL;
    }


}