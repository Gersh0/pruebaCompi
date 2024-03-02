import {Token, TokenType} from './token';

export class Lexer {
    private _source: string;
    private _current_pos: number;
    private _current_char: string;
    private _read_current_pos: number;

    constructor(source: string) {
        this._source = source;
        this._current_pos = 0;
        this._current_char = "";
        this._read_current_pos = 0;
        this._read_character();
    }

    private _read_character(): void {
        if (this._read_current_pos >= this._source.length) {
            this._current_char = "";
        } else {
            this._current_char = this._source[this._read_current_pos];
        }
        this._current_pos = this._read_current_pos;
        this._read_current_pos += 1;
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
        let token: Token;
        if (/^=$/.test(this._current_char)) {
            if (this._peek_character() === "=") {
                this._read_character();
                token = new Token(TokenType.EQ, "==");
            } else {
                token = new Token(TokenType.ASSIGN, this._current_char);
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
            } else if (this._peek_character() === "<") {
                this._read_character();
                token = new Token(TokenType.SHIFT_LEFT, "<<");
            } else {
                token = new Token(TokenType.LESS_THAN, this._current_char);
            }
        } else if (/^>$/.test(this._current_char)) {
            if (this._peek_character() === "=") {
                this._read_character();
                token = new Token(TokenType.GTE, ">=");
            } else if (this._peek_character() === ">") {
                this._read_character();
                token = new Token(TokenType.SHIFT_RIGHT, ">>");
            } else {
                token = new Token(TokenType.GREATER_THAN, this._current_char);
            }
        } else if (/^$/.test(this._current_char)) {
            console.log(this._current_char);
            token = new Token(TokenType.EOF, this._current_char);
        } else if (/^\+$/.test(this._current_char)) {
            if (this._peek_character() === "+") {
                this._read_character();
                token = new Token(TokenType.INCREMENT, "++");
            } else {
                token = new Token(TokenType.PLUS, this._current_char);
            }
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
            if (this._peek_character() === "-") {
                this._read_character();
                token = new Token(TokenType.DECREMENT, "--");
            } else {
                token = new Token(TokenType.MINUS, this._current_char);
            }
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


            //tokens VRTX
        } else if (/^%$/.test(this._current_char)) {
            token = new Token(TokenType.MODULE, this._current_char);
        } else if (/^\*$/.test(this._current_char)) {
            token = new Token(TokenType.ASTERISK, this._current_char);
        } else if (/^&&$/.test(this._current_char)) {
            token = new Token(TokenType.AND, this._current_char);
        } else if (/^\|\|$/.test(this._current_char)) {
            token = new Token(TokenType.OR, this._current_char);
        } else if (/^&$/.test(this._current_char)) {
            if (this._peek_character() === "&") {
                this._read_character();
                token = new Token(TokenType.AND, "&&");
            } else {
                token = new Token(TokenType.BITWISE_AND, this._current_char);
            }
        } else if (/^\|$/.test(this._current_char)) {
            if (this._peek_character() === "|") {
                this._read_character();
                token = new Token(TokenType.OR, "||");
            } else {
                token = new Token(TokenType.BITWISE_OR, this._current_char);
            }
        } else if (/^\^$/.test(this._current_char)) {
            token = new Token(TokenType.BITWISE_XOR, this._current_char);
        } else if (/^<<$/.test(this._current_char)) {
            token = new Token(TokenType.SHIFT_LEFT, this._current_char);
        } else if (/^>>$/.test(this._current_char)) {
            token = new Token(TokenType.SHIFT_RIGHT, this._current_char);
        } else if (/^\+\+$/.test(this._current_char)) {
            token = new Token(TokenType.INCREMENT, this._current_char);
        } else if (/^--$/.test(this._current_char)) {
            token = new Token(TokenType.DECREMENT, this._current_char);
        } else if (/^\?$/.test(this._current_char)) {
            token = new Token(TokenType.QUESTION_MARK, this._current_char);
        } else if (/^:$/.test(this._current_char)) {
            token = new Token(TokenType.COLON, this._current_char);
        } else if (/^\.$/.test(this._current_char)) {
            token = new Token(TokenType.DOT, this._current_char);
        } else if (/^_$/.test(this._current_char)) {
            token = new Token(TokenType.UNDERSCORE, this._current_char);
        } else if (/^@$/.test(this._current_char)) {
            token = new Token(TokenType.AT_SIGN, this._current_char);
        } else if (/^#$/.test(this._current_char)) {
            token = new Token(TokenType.HASH, this._current_char);
        } else if (/^"$/.test(this._current_char)) {
            token = new Token(TokenType.DOUBLE_QUOTE, this._current_char);
        } else if (/^'$/.test(this._current_char)) {
            token = new Token(TokenType.SINGLE_QUOTE, this._current_char);
        } else if (/^\\$/.test(this._current_char)) {
            token = new Token(TokenType.BACKSLASH, this._current_char);
        } else if (/^for$/.test(this._current_char)) {
            token = new Token(TokenType.FOR, this._current_char);
        } else if (/^while$/.test(this._current_char)) {
            token = new Token(TokenType.WHILE, this._current_char);
        } else if (/^switch$/.test(this._current_char)) {
            token = new Token(TokenType.SWITCH, this._current_char);
        } else if (/^case$/.test(this._current_char)) {
            token = new Token(TokenType.CASE, this._current_char);
        } else if (/^default$/.test(this._current_char)) {
            token = new Token(TokenType.DEFAULT, this._current_char);
        } else if (/^break$/.test(this._current_char)) {
            token = new Token(TokenType.BREAK, this._current_char);
        } else if (/^continue$/.test(this._current_char)) {
            token = new Token(TokenType.CONTINUE, this._current_char);
        } else if (/^null$/.test(this._current_char)) {
            token = new Token(TokenType.NULL, this._current_char);
        }
        // end tokens VRTX

        else {
            token = new Token(TokenType.ILLEGAL, this._current_char);
        }
        this._read_character()
        return token;
    }
}
