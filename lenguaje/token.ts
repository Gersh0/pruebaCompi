export enum TokenType {
    EQ, // ==
    COMMA, // ,
    EOF,
    ILLEGAL,
    PLUS, // +
    SEMICOLON, // ;
    PAREN_OPEN, // (
    PAREN_CLOSE, // )
    BRACKET_OPEN, // [
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
    NOE,  // !=
    NOT,  // !
    IDENT,  // Identificador (==)
    TRUE,  // true
    INT,  // 123
    FALSE, // false
    IF, // if
    ELSE, // else
    RETURN, // return
    FUNCTION, // function
    LET, // let
    ASSIGN, // =
    // Tokens vrtx
    MODULE, // % comprobado
    ASTERISK, // * comprobado
    AND, // && comprobado
    OR, // || comprobado
    BITWISE_AND, // & comprobado
    BITWISE_OR, // | comprobado
    BITWISE_XOR, // ^
    SHIFT_LEFT, // << comprobado
    SHIFT_RIGHT, // >> comprobado
    INCREMENT, // ++ comprobado
    DECREMENT, // -- comprobado
    QUESTION_MARK, // ? comprobado
    COLON, // : comprobado
    DOT, // . comprobado
    UNDERSCORE, // _ comprobado
    AT_SIGN, // @ comprobado
    HASH, // # comprobado
    DOUBLE_QUOTE, // " comprobado
    SINGLE_QUOTE, // ' comprobado
    BACKSLASH, // \ comprobado
    FOR, // for comprobado
    WHILE, // while comprobado
    SWITCH, // switch comprobado
    CASE, // case comprobado
    DEFAULT, // default comprobado
    BREAK, // break comprobado
    CONTINUE, // continue comprobado
    NULL, // null comprobado


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
            'let': TokenType.LET,
            //tokens vrtx
            '||': TokenType.OR,
            '&&': TokenType.AND,
            '<<': TokenType.SHIFT_LEFT,
            '>>': TokenType.SHIFT_RIGHT,
            '++': TokenType.INCREMENT,
            '--': TokenType.DECREMENT,
            '_': TokenType.UNDERSCORE,
            'for': TokenType.FOR,
            'while': TokenType.WHILE,
            'switch': TokenType.SWITCH,
            'case': TokenType.CASE,
            'default': TokenType.DEFAULT,
            'break': TokenType.BREAK,
            'continue': TokenType.CONTINUE,
            'null': TokenType.NULL


        };
        return keywords[literal.toLowerCase()] || TokenType.IDENT;
    }


}