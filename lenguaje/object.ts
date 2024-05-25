import { ASTBlock, ASTIdentifier } from './ast';

// Enum for ObjectType
export enum ObjectType {
    BOOLEAN,
    INTEGER,
    NULL,
    RETURN,
    ERROR,
    FUNCTION,
    STRING
}

// Abstract class Object
abstract class Object_ {

    // Abstract method type
    abstract type(): ObjectType;

    // Abstract method inspect
    abstract inspect(): string;
}

// Integer class
class Integer extends Object_ {
    value: number;
    constructor(value: number) {
        super();
        this.value = value;
    }
    // Returns the type of the object
    type(): ObjectType {
        return ObjectType.INTEGER;
    }
    // Returns a string representation of the object
    inspect(): string {
        return this.value.toString();
    }
}

// Boolean class
class Boolean extends Object_ {
    value: boolean;
    constructor(value: boolean) {
        super();
        this.value = value;
    }
    // Returns the type of the object
    type(): ObjectType {
        return ObjectType.BOOLEAN;
    }
    // Returns a string representation of the object
    inspect(): string {
        return this.value.toString();
    }
}

// Null class
class Null extends Object_ {
    // Returns the type of the object
    type(): ObjectType {
        return ObjectType.NULL;
    }
    // Returns a string representation of the object
    inspect(): string {
        return 'null';
    }
}

// Return class
class Return extends Object_ {
    value: Object_;
    constructor(value: Object_) {
        super();
        this.value = value;
    }
    // Returns the type of the object
    type(): ObjectType {
        return ObjectType.RETURN;
    }
    // Returns a string representation of the object
    inspect(): string {
        return this.value.inspect();
    }
}

// Error class
class Error extends Object_ {
    message: string;
    constructor(message: string) {
        super();
        this.message = message;
    }
    // Returns the type of the object
    type(): ObjectType {
        return ObjectType.ERROR;
    }
    // Returns a string representation of the object
    inspect(): string {
        return 'ERROR: ' + this.message;
    }
}

// Environment class
class Environment {
    store: Map<string, Object_>;
    outer: Environment | null;
    constructor(outer?: Environment) {
        this.store = new Map<string, Object_>();
        this.outer = outer || null;
    }
    // Get method for Environment class
    get(name: string): Object_ | undefined {
        let obj = this.store.get(name);
        if (obj === undefined && this.outer !== null) {
            obj = this.outer.get(name);
        }
        return obj;
    }
    // Set method for Environment class
    set(name: string, val: Object_): Object_ {
        this.store.set(name, val);
        return val;
    }
}

// Function class
class Function extends Object_ {
    parameters: ASTIdentifier[];
    body: ASTBlock;
    env: Environment;
    constructor(parameters: ASTIdentifier[], body: ASTBlock, env: Environment) {
        super();
        this.parameters = parameters;
        this.body = body;
        this.env = env;
    }
    // Returns the type of the object
    type(): ObjectType {
        return ObjectType.FUNCTION;
    }
    // Returns a string representation of the object
    inspect(): string {
        
        let params: string = this.parameters.map(p => p.toString()).join(', ');
        
        return `function(${params}) {\n${this.body.toString()}\n}`;
    }
}

// String class
class String extends Object_ {
    value: string;
    constructor(value: string) {
        super();
        this.value = value;
    }
    // Returns the type of the object
    type(): ObjectType {
        return ObjectType.STRING;
    }
    // Returns a string representation of the object
    inspect(): string {
        return this.value;
    }
}

export{Object_, Integer, Boolean, Null, Return, Error, Environment, Function, String};