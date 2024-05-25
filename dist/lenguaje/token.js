"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType["ASSIGN"] = "=";
    TokenType["STRING"] = "STRING";
    TokenType["COMMA"] = ",";
    TokenType["EOF"] = "EOF";
    TokenType["ILLEGAL"] = "ILLEGAL";
    TokenType["PLUS"] = "+";
    TokenType["MULTIPLICATION"] = "*";
    TokenType["SEMICOLON"] = ";";
    TokenType["PAREN_OPEN"] = "(";
    TokenType["PAREN_CLOSE"] = ")";
    TokenType["BRACKET_OPEN"] = "[";
    TokenType["BRACKET_CLOSE"] = "]";
    TokenType["CURLY_OPEN"] = "{";
    TokenType["CURLY_CLOSE"] = "}";
    TokenType["MINUS"] = "-";
    TokenType["CARET"] = "^";
    TokenType["SLASH"] = "/";
    TokenType["LESS_THAN"] = "<";
    TokenType["GREATER_THAN"] = ">";
    TokenType["GTE"] = ">=";
    TokenType["LTE"] = "<=";
    TokenType["NOE"] = "!=";
    TokenType["NOT"] = "!";
    TokenType["EQ"] = "==";
    TokenType["IDENT"] = "IDENT";
    TokenType["TRUE"] = "TRUE";
    TokenType["INT"] = "INT";
    TokenType["FALSE"] = "FALSE";
    TokenType["IF"] = "IF";
    TokenType["ELSE"] = "ELSE";
    TokenType["RETURN"] = "RETURN";
    TokenType["FUNCTION"] = "FUNCTION";
    TokenType["LET"] = "LET";
})(TokenType || (exports.TokenType = TokenType = {}));
class Token {
    constructor(token_type, literal) {
        this.token_type = token_type;
        this.literal = literal;
    }
    static lookup_token_type(literal) {
        const keywords = {
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
exports.Token = Token;
