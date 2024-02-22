enum TokenType {
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

class Token{
    token_type: TokenType;
    literal : string;

    constructor(token_type:TokenType,literal:string){
        this.token_type = token_type;
        this.literal=literal;
    }


}