import { Token, TokenType } from './token';

export class Lexer {
    private _source: string;
    private _current_pos: number;
    private _current_char: string;
    private _read_current_pos: number;

    constructor(source: string) {
        this._source = source;
        this._current_pos =  0;
        this._current_char = "";
        this._read_current_pos =  0;
        this._read_character();
    }

    private _read_character(): void {
        if (this._read_current_pos >= this._source.length) {
            this._current_char = "";
        } else {
            this._current_char = this._source[this._read_current_pos];
        }
        this._current_pos = this._read_current_pos;
        this._read_current_pos +=  1;
    }

    private _peek_character(): string {
        if (this._read_current_pos >= this._source.length) {
            return "";
        } else {
            return this._source[this._read_current_pos];
        }
    }

    private is_letter(character: string): boolean {
        return /^[a-záéíóúA-ZÁÉÍÓÚñÑ_]$/.test(character);
    }

    private is_number(character: string): boolean {
        return /^\d$/.test(character);
    }

    private _read_number(): string {
        let initial_position = this._current_pos;
        while (this.is_number(this._current_char)) {
            this._read_character();
        }
        return this._source.substring(initial_position, this._current_pos);
    }

    private _read_identifier(): string {
        let initial_position = this._current_pos;
        let is_first_letter = true;
        while (this.is_letter(this._current_char) || (!is_first_letter && this.is_number(this._current_char))) {
            this._read_character();
            is_first_letter = false;
        }
        return this._source.substring(initial_position, this._current_pos);
    }

    private _skip_whitespace(): void {
        while (this._current_char.match(/\s/)) {
            this._read_character();
        }
    }

    public nextToken(): Token {
        this._skip_whitespace();
        let token:Token;
        if (/^=$/.test(this._current_char)) {
            if (this._peek_character() === "=") {
                this._read_character();
                token = new Token(TokenType.IDENT, "==");
            } else {
                token = new Token(TokenType.EQ, this._current_char);
            }
        } else if (/^!$/.test(this._current_char)) {
            if (this._peek_character() === "=") {
                this._read_character();
                token = new Token(TokenType.NOE, "!=");
            } else {
                token = new Token(TokenType.NOT, this._current_char);
            }
        } else if (/^<$/.test(this._current_char)) {
            if (this._peek_character() === "=") {
                this._read_character();
                token = new Token(TokenType.LTE, "<=");
            } else {
                token = new Token(TokenType.LESS_THAN, this._current_char);
            }
        } else if (/^>$/.test(this._current_char)) {
            if (this._peek_character() === "=") {
                this._read_character();
                token = new Token(TokenType.GTE, ">=");
            } else {
                token = new Token(TokenType.GREATER_THAN, this._current_char);
            }
        } else if (/^$/.test(this._current_char)) {
            console.log(this._current_char);
            token = new Token(TokenType.EOF, this._current_char);
        } else if (/^\+$/.test(this._current_char)) {
            token = new Token(TokenType.PLUS, this._current_char);
        } else if (/^,$/.test(this._current_char)) {
            token = new Token(TokenType.COMMA, this._current_char);
        } else if (/^;$/.test(this._current_char)) {
            token = new Token(TokenType.SEMICOLON, this._current_char);
        } else if (/^\($/.test(this._current_char)) {
            token = new Token(TokenType.PAREN_OPEN, this._current_char);
        } else if (/^\)$/.test(this._current_char)) {
            token = new Token(TokenType.PAREN_CLOSE, this._current_char);
        } else if (/^\[$/.test(this._current_char)) {
            token = new Token(TokenType.BRACKET_OPEN, this._current_char);
        } else if (/^]$/.test(this._current_char)) {
            token = new Token(TokenType.BRACKET_CLOSE, this._current_char);
        } else if (/^\{$/.test(this._current_char)) {
            token = new Token(TokenType.CURLY_OPEN, this._current_char);
        } else if (/^}$/.test(this._current_char)) {
            token = new Token(TokenType.CURLY_CLOSE, this._current_char);
        } else if (/^-$/.test(this._current_char)) {
            token = new Token(TokenType.MINUS, this._current_char);
        } else if (/^\^$/.test(this._current_char)) {
            token = new Token(TokenType.CARET, this._current_char);
        } else if (/^\/$/.test(this._current_char)) {
            token = new Token(TokenType.SLASH, this._current_char);
        } else if (this.is_letter(this._current_char)) {
            const literal = this._read_identifier();
            const tokenType = Token.lookup_token_type(literal);
            token = new Token(tokenType, literal);
        } else if (this.is_number(this._current_char)) {
            const literal = this._read_number();
            token = new Token(TokenType.INT, literal);
        } else {
            token = new Token(TokenType.ILLEGAL, this._current_char);
        }
        this._read_character()
        return token;
    }
}
