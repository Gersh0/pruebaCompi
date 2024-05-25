"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.String = exports.Function = exports.Environment = exports.Error = exports.Return = exports.Null = exports.Boolean = exports.Integer = exports.Object_ = exports.ObjectType = void 0;
// Enum for ObjectType
var ObjectType;
(function (ObjectType) {
    ObjectType[ObjectType["BOOLEAN"] = 0] = "BOOLEAN";
    ObjectType[ObjectType["INTEGER"] = 1] = "INTEGER";
    ObjectType[ObjectType["NULL"] = 2] = "NULL";
    ObjectType[ObjectType["RETURN"] = 3] = "RETURN";
    ObjectType[ObjectType["ERROR"] = 4] = "ERROR";
    ObjectType[ObjectType["FUNCTION"] = 5] = "FUNCTION";
    ObjectType[ObjectType["STRING"] = 6] = "STRING";
})(ObjectType || (exports.ObjectType = ObjectType = {}));
// Abstract class Object
class Object_ {
}
exports.Object_ = Object_;
// Integer class
class Integer extends Object_ {
    constructor(value) {
        super();
        this.value = value;
    }
    // Returns the type of the object
    type() {
        return ObjectType.INTEGER;
    }
    // Returns a string representation of the object
    inspect() {
        return this.value.toString();
    }
}
exports.Integer = Integer;
// Boolean class
class Boolean extends Object_ {
    constructor(value) {
        super();
        this.value = value;
    }
    // Returns the type of the object
    type() {
        return ObjectType.BOOLEAN;
    }
    // Returns a string representation of the object
    inspect() {
        return this.value.toString();
    }
}
exports.Boolean = Boolean;
// Null class
class Null extends Object_ {
    // Returns the type of the object
    type() {
        return ObjectType.NULL;
    }
    // Returns a string representation of the object
    inspect() {
        return 'null';
    }
}
exports.Null = Null;
// Return class
class Return extends Object_ {
    constructor(value) {
        super();
        this.value = value;
    }
    // Returns the type of the object
    type() {
        return ObjectType.RETURN;
    }
    // Returns a string representation of the object
    inspect() {
        return this.value.inspect();
    }
}
exports.Return = Return;
// Error class
class Error extends Object_ {
    constructor(message) {
        super();
        this.message = message;
    }
    // Returns the type of the object
    type() {
        return ObjectType.ERROR;
    }
    // Returns a string representation of the object
    inspect() {
        return 'ERROR: ' + this.message;
    }
}
exports.Error = Error;
// Environment class
class Environment {
    constructor(outer) {
        this.store = new Map();
        this.outer = outer || null;
    }
    // Get method for Environment class
    get(name) {
        let obj = this.store.get(name);
        if (obj === undefined && this.outer !== null) {
            obj = this.outer.get(name);
        }
        return obj;
    }
    // Set method for Environment class
    set(name, val) {
        this.store.set(name, val);
        return val;
    }
}
exports.Environment = Environment;
// Function class
class Function extends Object_ {
    constructor(parameters, body, env) {
        super();
        this.parameters = parameters;
        this.body = body;
        this.env = env;
    }
    // Returns the type of the object
    type() {
        return ObjectType.FUNCTION;
    }
    // Returns a string representation of the object
    inspect() {
        return `function(${this.parameters.join(', ')}) {\n${this.body.toString()}\n}`;
    }
}
exports.Function = Function;
// String class
class String extends Object_ {
    constructor(value) {
        super();
        this.value = value;
    }
    // Returns the type of the object
    type() {
        return ObjectType.STRING;
    }
    // Returns a string representation of the object
    inspect() {
        return this.value;
    }
}
exports.String = String;
