export enum TokenType {
    EQ,
    COMMA,
    EOF,
    ILLEGAL,
    PLUS,
    SEMICOLON,
    PAREN_OPEN,
    PAREN_CLOSE,
    BRACKET_OPEN,
    BRACKET_CLOSE,  // ]
    CURLY_OPEN,  // {
    CURLY_CLOSE,  // }
    MINUS,  // -
    CARET,  // ^
    SLASH,  // /
    LESS_THAN,  // <
    GREATER_THAN,  // >
    GTE,  // >=
    LTE,  // <=
    NOE,  // Diferente
    NOT,  // Negación
    IDENT,  // Identificador (==)
    TRUE,  // Faltan
    INT,  // int
    FALSE,
    IF,
    ELSE,
    RETURN,
    FUNCTION,
    LET
}

export class Token {
    token_type: TokenType;
    literal: string;

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
    }


}