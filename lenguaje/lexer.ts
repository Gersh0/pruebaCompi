import {Token, TokenType} from "./token";

export class Lexer {

    private readonly source: string;
    private current_pos: number;
    private current_char: string;
    private read_current_pos: number;

    constructor(source: string) {
        this.source = source;
        this.current_pos = 0;
        this.current_char = "";
        this.read_current_pos = 0;
        this.read_character();
    }

    private read_character(): void {
        if (this.read_current_pos >= this.source.length) {
            this.current_char = "";
        } else {
            this.current_char = this.source[this.read_current_pos];
        }
        this.current_pos = this.read_current_pos;
        this.read_current_pos++;
    }

    private peek_character(): any {
        if (this.read_current_pos >= this.source.length) {
            return ""
        } else {
            return this.source[this.read_current_pos]
        }
    }

    public is_letter(character: string): any {
        return /^[a-záéíóúA-ZÁÉÍÓÚñÑ_]$/.test(character);
    }

    public is_number(character: string): any {
        return /^\d$/.test(character);
    }

    private read_number(): any {
        let initial_position: number = this.current_pos;
        while (this.is_number(this.current_char)) {
            this.read_character();
        }
        return this.source.substring(initial_position, this.current_pos);
    }

    private read_identifier(): any {
        let initial_position: number = this.current_pos;
        let is_first_letter: boolean = true;
        while (this.is_letter(this.current_char) || !(is_first_letter && this.is_number(this.current_char))) {
            this.read_character();
            is_first_letter = false;
        }
        return this.source.substring(initial_position, this.current_pos);
    }

    private skip_whitespace(): void {
        while (/^\s*$/.test(this.current_char)) {
            this.read_character();
        }
    }

    nextToken(): Token {
        this.skip_whitespace();
        if (/^=$/.test(this.current_char)) {
            if (this.peek_character() === "=") {
                this.read_character();
                return new Token(TokenType.IDENT, "==");
            } else {
                return new Token(TokenType.EQ, this.current_char);
            }
        } else if (/^!$/.test(this.current_char)) {
            if (this.peek_character() === "=") {
                this.read_character();
                return new Token(TokenType.NOE, "!=");
            } else {
                return new Token(TokenType.NOT, this.current_char);
            }
        } else if (/^<$/.test(this.current_char)) {
            if (this.peek_character() === "=") {
                this.read_character();
                return new Token(TokenType.LTE, "<=");
            } else {
                return new Token(TokenType.LESS_THAN, this.current_char);
            }
        } else if (/^>$/.test(this.current_char)) {
            if (this.peek_character() === "=") {
                this.read_character();
                return new Token(TokenType.GTE, ">=");
            } else {
                return new Token(TokenType.GREATER_THAN, this.current_char);
            }
        } else if (/^$/.test(this.current_char)) {
            return new Token(TokenType.EOF, this.current_char);
        } else if (/^\+$/.test(this.current_char)) {
            return new Token(TokenType.PLUS, this.current_char);
        } else if (/^,$/.test(this.current_char)) {
            return new Token(TokenType.COMMA, this.current_char);
        } else if (/^;$/.test(this.current_char)) {
            return new Token(TokenType.SEMICOLON, this.current_char);
        } else if (/^\($/.test(this.current_char)) {
            return new Token(TokenType.PAREN_OPEN, this.current_char);
        } else if (/^\)$/.test(this.current_char)) {
            return new Token(TokenType.PAREN_CLOSE, this.current_char);
        } else if (/^\[$/.test(this.current_char)) {
            return new Token(TokenType.BRACKET_OPEN, this.current_char);
        } else if (/^]$/.test(this.current_char)) {
            return new Token(TokenType.BRACKET_CLOSE, this.current_char);
        } else if (/^\{$/.test(this.current_char)) {
            return new Token(TokenType.CURLY_OPEN, this.current_char);
        } else if (/^}$/.test(this.current_char)) {
            return new Token(TokenType.CURLY_CLOSE, this.current_char);
        } else if (/^-$/.test(this.current_char)) {
            return new Token(TokenType.MINUS, this.current_char);
        } else if (/^\^$/.test(this.current_char)) {
            return new Token(TokenType.CARET, this.current_char);
        } else if (/^\/$/.test(this.current_char)) {
            return new Token(TokenType.SLASH, this.current_char);
        } else if (this.is_letter(this.current_char)) {
            const literal = this.read_identifier();
            const tokenType = Token.lookup_token_type(literal);
            return new Token(tokenType, literal);
        } else if (this.is_number(this.current_char)) {
            const literal = this.read_number();
            return new Token(TokenType.INT, literal);
        } else {
            return new Token(TokenType.ILLEGAL, this.current_char);
        }
        this.read_character();
    }

}