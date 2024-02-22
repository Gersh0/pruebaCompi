class Lexer{

    private source:string;
    private current_pos: number;
    private current_char: string;
    private read_current_pos: number;

    constructor(source:string) {
        this.source=source;
        this.current_pos = 0;
        this.current_char = "";
        this.read_current_pos = 0;
        this.read_character();
    }

    private read_character(): void{
        if (this.read_current_pos >= this.source.length){
            this.current_char = "";
        }else{
            this.current_char = this.source[this.read_current_pos];
        }
        this.current_pos = this.read_current_pos;
        this.read_current_pos++;
    }

    private peek_character():any{
        if (this.read_current_pos>=this.source.length){
            return""
        }else{
            return this.source[this.read_current_pos]
        }
    }

    public is_letter(character:string):any{
        return /^[a-záéíóúA-ZÁÉÍÓÚñÑ_]$/.test(character);
    }

    public is_number(character:string):any{
        return /^\d$/.test(character);
    }

    private read_number():any{
        let initial_position: number = this.current_pos;
        while (this.is_number(this.current_char)){
            this.read_character();
        }
        return this.source.substring(initial_position,this.current_pos);
    }

    private read_identifier():any{
        let initial_position: number = this.current_pos;
        let is_first_letter: boolean = true;
        while (this.is_letter(this.current_char) || !(is_first_letter&&this.is_number(this.current_char))){
            this.read_character();
            is_first_letter = false;
        }
        return this.source.substring(initial_position,this.current_pos);
    }

    private skip_whitespace():void{
        while (/^\s*$/.test(this.current_char)){
            this.read_character();
        }
    }

    public next_token():any{
        this.skip_whitespace()
        if (/^=$/.test(this.current_char)){

        }
    }
}