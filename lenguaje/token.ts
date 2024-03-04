export enum TokenType {
    EQ = "EQ", // ==
    COMMA = "COMMA", // ,
    EOF = "EOF",
    ILLEGAL = "ILLEGAL",
    PLUS = "PLUS", // +
    SEMICOLON = "SEMICOLON", // ;
    PAREN_OPEN = "PAREN_OPEN", // (
    PAREN_CLOSE = "PAREN_CLOSE", // )
    BRACKET_OPEN = "BRACKET_OPEN", // [
    BRACKET_CLOSE = "BRACKET_CLOSE",  // ]
    CURLY_OPEN = "CURLY_OPEN",  // {
    CURLY_CLOSE = "CURLY_CLOSE",  // }
    MINUS = "MINUS",  // -
    CARET ="CARET",  // ^
    SLASH = "SLASH",  // /
    LESS_THAN = "LESS_THAN",  // <
    GREATER_THAN = "GREATER_THAN",  // >
    GTE = "GTE",  // >=
    LTE = "LTE",  // <=
    NOE = "NOE",  // !=
    NOT = "NOT",  // !
    IDENT = "IDENT",  // Identificador (==)
    TRUE = "TRUE",  // true
    INT = "INT",  // 123
    FALSE = "FALSE", // false
    IF = "IF", // if
    ELSE = "ELSE", // else
    RETURN = "RETURN", // return
    FUNCTION = "FUNCTION", // function
    LET = "LET", // let
    ASSIGN = "ASSIGN", // =
    // Tokens vrtx
    MODULE = "MODULE", // % comprobado
    ASTERISK = "ASTERISK", // * comprobado
    AND = "AND", // && comprobado
    OR = "OR", // || comprobado
    BITWISE_AND = "BITWISE_AND", // & comprobado
    BITWISE_OR = "BITWISE_OR", // | comprobado
    BITWISE_XOR = "BITWISE_XOR", // ^
    SHIFT_LEFT = "SHIFT_LEFT", // << comprobado
    SHIFT_RIGHT = "SHIFT_RIGHT", // >> comprobado
    INCREMENT = "INCREMENT", // ++ comprobado
    DECREMENT = "DECREMENT", // -- comprobado
    QUESTION_MARK = "QUESTION_MARK", // ? comprobado
    COLON = "COLON", // : comprobado
    DOT = "DOT", // . comprobado
    UNDERSCORE = "UNDERSCORE", // _ comprobado
    AT_SIGN = "AT_SIGN", // @ comprobado
    HASH = "HASH", // # comprobado
    DOUBLE_QUOTE = "DOUBLE_QUOTE", // " comprobado
    SINGLE_QUOTE = "SINGLE_QUOTE", // ' comprobado
    BACKSLASH = "BACKSLASH", // \ comprobado
    FOR = "FOR", // for comprobado
    WHILE = "WHILE", // while comprobado
    SWITCH = "SWITCH", // switch comprobado
    CASE = "CASE", // case comprobado
    DEFAULT = "DEFAULT", // default comprobado
    BREAK = "BREAK", // break comprobado
    CONTINUE = "CONTINUE", // continue comprobado
    NULL = "NULL", // null comprobado


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