import { Block, Identifier } from './ast';

// Enum for ObjectType
enum ObjectType {
    BOOLEAN_,
    INTEGER_,
    NULL_,
    RETURN_,
    ERROR_,
    FUNCTION_,
    STRING_
}

// Abstract class Object
abstract class Object_ {

    // Abstract method type
    abstract type(): ObjectType;

    // Abstract method inspect
    abstract inspect(): string;
}

// Integer class
class Integer_ extends Object_ {
    value: number;
    constructor(value: number) {
        super();
        this.value = value;
    }
    // Returns the type of the object
    type(): ObjectType {
        return ObjectType.INTEGER_;
    }
    // Returns a string representation of the object
    inspect(): string {
        return this.value.toString();
    }
}

// Boolean class
class Boolean_ extends Object_ {
    value: boolean;
    constructor(value: boolean) {
        super();
        this.value = value;
    }
    // Returns the type of the object
    type(): ObjectType {
        return ObjectType.BOOLEAN_;
    }
    // Returns a string representation of the object
    inspect(): string {
        return this.value.toString();
    }
}

// Null class
class Null_ extends Object_ {
    // Returns the type of the object
    type(): ObjectType {
        return ObjectType.NULL_;
    }
    // Returns a string representation of the object
    inspect(): string {
        return 'null';
    }
}

// Return class
class Return_ extends Object_ {
    value: Object_;
    constructor(value: Object_) {
        super();
        this.value = value;
    }
    // Returns the type of the object
    type(): ObjectType {
        return ObjectType.RETURN_;
    }
    // Returns a string representation of the object
    inspect(): string {
        return this.value.inspect();
    }
}

// Error class
class Error_ extends Object_ {
    message: string;
    constructor(message: string) {
        super();
        this.message = message;
    }
    // Returns the type of the object
    type(): ObjectType {
        return ObjectType.ERROR_;
    }
    // Returns a string representation of the object
    inspect(): string {
        return 'ERROR: ' + this.message;
    }
}

// Environment class
class Environment_ {
    store: Map<string, Object>;
    outer: Environment_ | null;
    constructor(outer?: Environment_) {
        this.store = new Map<string, Object>();
        this.outer = outer || null;
    }
    // Get method for Environment class
    get(name: string): Object | undefined {
        let obj = this.store.get(name);
        if (obj === undefined && this.outer !== null) {
            obj = this.outer.get(name);
        }
        return obj;
    }
    // Set method for Environment class
    set(name: string, val: Object): Object {
        this.store.set(name, val);
        return val;
    }
}

// Function class
class Function_ extends Object_ {
    parameters: Identifier[];
    body: Block;
    env: Environment_;
    constructor(parameters: Identifier[], body: Block, env: Environment_) {
        super();
        this.parameters = parameters;
        this.body = body;
        this.env = env;
    }
    // Returns the type of the object
    type(): ObjectType {
        return ObjectType.FUNCTION_;
    }
    // Returns a string representation of the object
    inspect(): string {
        return `function(${this.parameters.join(', ')}) {\n${this.body.toString()}\n}`;
    }
}

// String class
class String_ extends Object {
    value: string;
    constructor(value: string) {
        super();
        this.value = value;
    }
    // Returns the type of the object
    type(): ObjectType {
        return ObjectType.STRING_;
    }
    // Returns a string representation of the object
    inspect(): string {
        return this.value;
    }
}