"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
const token_1 = require("./token");
class Lexer {
    constructor(source) {
        this._source = source;
        this._current_pos = 0;
        this._current_char = "";
        this._read_current_pos = 0;
        this._read_character();
    }
    _read_character() {
        if (this._read_current_pos >= this._source.length) {
            this._current_char = "";
        }
        else {
            this._current_char = this._source[this._read_current_pos];
        }
        this._current_pos = this._read_current_pos;
        this._read_current_pos += 1;
    }
    _peek_character() {
        if (this._read_current_pos >= this._source.length) {
            return "";
        }
        else {
            return this._source[this._read_current_pos];
        }
    }
    is_letter(character) {
        return /^[a-záéíóúA-ZÁÉÍÓÚñÑ_]$/.test(character);
    }
    is_number(character) {
        return /^\d$/.test(character);
    }
    _read_number() {
        let initial_position = this._current_pos;
        while (this.is_number(this._current_char)) {
            this._read_character();
        }
        return this._source.substring(initial_position, this._current_pos);
    }
    _read_string() {
        let initial_position = this._current_pos;
        this._read_character();
        while (this._current_char !== '"') {
            this._read_character();
        }
        return this._source.substring(initial_position + 1, this._current_pos);
    }
    _read_identifier() {
        let initial_position = this._current_pos;
        let is_first_letter = true;
        while (this.is_letter(this._current_char) || (!is_first_letter && this.is_number(this._current_char))) {
            this._read_character();
            is_first_letter = false;
        }
        return this._source.substring(initial_position, this._current_pos);
    }
    _skip_whitespace() {
        while (this._current_char.match(/\s/)) {
            this._read_character();
        }
    }
    nextToken() {
        this._skip_whitespace();
        let token;
        if (/^=$/.test(this._current_char)) {
            if (this._peek_character() === "=") {
                this._read_character();
                token = new token_1.Token(token_1.TokenType.EQ, "==");
            }
            else {
                token = new token_1.Token(token_1.TokenType.ASSIGN, this._current_char);
            }
        }
        else if (/^!$/.test(this._current_char)) {
            if (this._peek_character() === "=") {
                this._read_character();
                token = new token_1.Token(token_1.TokenType.NOE, "!=");
            }
            else {
                token = new token_1.Token(token_1.TokenType.NOT, this._current_char);
            }
        }
        else if (/^<$/.test(this._current_char)) {
            if (this._peek_character() === "=") {
                this._read_character();
                token = new token_1.Token(token_1.TokenType.LTE, "<=");
            }
            else {
                token = new token_1.Token(token_1.TokenType.LESS_THAN, this._current_char);
            }
        }
        else if (/^>$/.test(this._current_char)) {
            if (this._peek_character() === "=") {
                this._read_character();
                token = new token_1.Token(token_1.TokenType.GTE, ">=");
            }
            else {
                token = new token_1.Token(token_1.TokenType.GREATER_THAN, this._current_char);
            }
        }
        else if (/^$/.test(this._current_char)) {
            console.log(this._current_char);
            token = new token_1.Token(token_1.TokenType.EOF, this._current_char);
        }
        else if (/^\+$/.test(this._current_char)) {
            token = new token_1.Token(token_1.TokenType.PLUS, this._current_char);
        }
        else if (/^,$/.test(this._current_char)) {
            token = new token_1.Token(token_1.TokenType.COMMA, this._current_char);
        }
        else if (/^;$/.test(this._current_char)) {
            token = new token_1.Token(token_1.TokenType.SEMICOLON, this._current_char);
        }
        else if (/^\($/.test(this._current_char)) {
            token = new token_1.Token(token_1.TokenType.PAREN_OPEN, this._current_char);
        }
        else if (/^\)$/.test(this._current_char)) {
            token = new token_1.Token(token_1.TokenType.PAREN_CLOSE, this._current_char);
        }
        else if (/^\[$/.test(this._current_char)) {
            token = new token_1.Token(token_1.TokenType.BRACKET_OPEN, this._current_char);
        }
        else if (/^]$/.test(this._current_char)) {
            token = new token_1.Token(token_1.TokenType.BRACKET_CLOSE, this._current_char);
        }
        else if (/^\{$/.test(this._current_char)) {
            token = new token_1.Token(token_1.TokenType.CURLY_OPEN, this._current_char);
        }
        else if (/^}$/.test(this._current_char)) {
            token = new token_1.Token(token_1.TokenType.CURLY_CLOSE, this._current_char);
        }
        else if (/^-$/.test(this._current_char)) {
            token = new token_1.Token(token_1.TokenType.MINUS, this._current_char);
        }
        else if (/^\^$/.test(this._current_char)) {
            token = new token_1.Token(token_1.TokenType.CARET, this._current_char);
        }
        else if (/^\/$/.test(this._current_char)) {
            token = new token_1.Token(token_1.TokenType.SLASH, this._current_char);
        }
        else if (/^"$/.test(this._current_char)) {
            const literal = this._read_string();
            token = new token_1.Token(token_1.TokenType.STRING, literal);
        }
        else if (this.is_letter(this._current_char)) {
            const literal = this._read_identifier();
            const tokenType = token_1.Token.lookup_token_type(literal);
            token = new token_1.Token(tokenType, literal);
        }
        else if (this.is_number(this._current_char)) {
            const literal = this._read_number();
            token = new token_1.Token(token_1.TokenType.INT, literal);
        }
        else if (/^\*$/.test(this._current_char)) {
            token = new token_1.Token(token_1.TokenType.MULTIPLICATION, this._current_char);
        }
        else if (/^[a-z]$/.test(this._current_char)) {
            token = new token_1.Token(token_1.TokenType.IDENT, this._current_char);
        }
        else {
            token = new token_1.Token(token_1.TokenType.ILLEGAL, this._current_char);
        }
        this._read_character();
        return token;
    }
}
exports.Lexer = Lexer;
