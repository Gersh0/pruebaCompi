"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluate = void 0;
const object_1 = require("./object");
const TRUE = new object_1.Boolean(true);
const FALSE = new object_1.Boolean(false);
const NULL = new object_1.Null();
const _NOT_A_FUNCTION = 'No es una función: ';
const _TYPE_MISMATCH = 'Discrepancia de tipos: ';
const _UNKNOWN_PREFIX_OPERATOR = 'Operador prefijo desconocido: ';
const _UNKNOWN_INFIX_OPERATOR = 'Operador infijo desconocido: ';
const _UNKNOWN_IDENTIFIER = 'Identificador no encontrado: ';
function evaluate(node, env) {
    if (node === null) {
        return null;
    }
    else {
        let nodeType = node.constructor.name;
        switch (nodeType) {
            case "ASTProgram":
                return _evaluate_program(node, env);
            case "ASTBlock":
                return _evaluate_block_statement(node, env);
            case "ASTExpressionStatement":
                return evaluate(node.expression, env);
            case "ASTInteger":
                return new object_1.Integer(node.value);
            case "ASTBoolean":
                return node.value ? TRUE : FALSE;
            case "ASTStringLiteral":
                return new object_1.String(node.value);
            case "ASTIdentifier":
                return _evaluate_identifier(node, env);
            case "ASTIf":
                return _evaluate_if_expression(node, env);
            case "ASTInfix":
                return _evaluate_infix_expression(node.operator, evaluate(node.left, env), evaluate(node.right, env));
            case "ASTPrefix":
                return _evaluate_prefix_expression(node.operator, evaluate(node.right, env));
            case "ASTReturnStatement":
                const returnValue = evaluate(node.returnValue, env);
                return new object_1.Return(returnValue);
            case "ASTLetStatement":
                const letValue = evaluate(node.value, env);
                env.set(node.name.value, letValue);
            case "ASTFunction":
                return new object_1.Function(node.parameters, node.body, env);
            case "ASTCall":
                const func = evaluate(node.function, env);
                const args = _evaluate_expression(node.arguments, env);
                return _apply_function(func, args);
            case "ASTProgram":
                return _evaluate_program(node, env);
            default:
                return null;
        }
    }
}
exports.evaluate = evaluate;
function _evaluate_program(program, env) {
    let result = null;
    for (let statement of program.statements) {
        result = evaluate(statement, env);
        if (result instanceof object_1.Return) {
            return result.value;
        }
        else if (result instanceof object_1.Error) {
            return result;
        }
    }
    return result;
}
function _evaluate_bang_operator_expression(right) {
    if (right === TRUE) {
        return FALSE;
    }
    else if (right === FALSE) {
        return TRUE;
    }
    else if (right === NULL) {
        return TRUE;
    }
    else {
        return FALSE;
    }
}
function _evaluate_block_statement(block, env) {
    let result = null;
    for (let statement of block.statements) {
        result = evaluate(statement, env);
        if (result instanceof object_1.Return || result instanceof object_1.Error) {
            return result;
        }
    }
    return result;
}
function _evaluate_identifier(node, env) {
    if (env.get(node.value) === null) {
        return _new_error(_UNKNOWN_IDENTIFIER, [node.value]);
    }
    else {
        return env.get(node.value);
    }
}
function _evaluate_if_expression(if_expression, env) {
    let condition = evaluate(if_expression.condition, env);
    if (_is_truthy(condition)) {
        return evaluate(if_expression.consequence, env);
    }
    else if (if_expression.alternative !== null) {
        return evaluate(if_expression.alternative, env);
    }
    else {
        return NULL;
    }
}
function _is_truthy(obj) {
    if (obj === NULL) {
        return false;
    }
    else if (obj === TRUE) {
        return true;
    }
    else if (obj === FALSE) {
        return false;
    }
    else {
        return true;
    }
}
function _evaluate_infix_expression(operator, left, right) {
    if (left.type() === object_1.ObjectType.INTEGER && right.type() === object_1.ObjectType.INTEGER) {
        return _evaluate_integer_infix_expression(operator, left, right);
    }
    else if (left.type() === object_1.ObjectType.STRING && right.type() === object_1.ObjectType.STRING) {
        return _evaluate_string_infix_expression(operator, left, right);
    }
    else if (operator === '==') {
        return _to_boolean_Object_(left === right);
    }
    else if (operator === '!=') {
        return _to_boolean_Object_(left !== right);
    }
    else if (left.type() !== right.type()) {
        return _new_error(_TYPE_MISMATCH, [object_1.ObjectType[left.type()], operator, object_1.ObjectType[right.type()]]);
    }
    else {
        return _new_error(_UNKNOWN_INFIX_OPERATOR, [object_1.ObjectType[left.type()], operator, object_1.ObjectType[right.type()]]);
    }
}
function _evaluate_integer_infix_expression(operator, left, right) {
    let left_value = +left.value;
    let right_value = +right.value;
    if (operator === '+') {
        return new object_1.Integer(left_value + right_value);
    }
    else if (operator === '-') {
        return new object_1.Integer(left_value - right_value);
    }
    else if (operator === '*') {
        return new object_1.Integer(left_value * right_value);
    }
    else if (operator === '/') {
        return new object_1.Integer(Math.floor(left_value / right_value));
    }
    else if (operator === '<') {
        return _to_boolean_Object_(left_value < right_value);
    }
    else if (operator === '>') {
        return _to_boolean_Object_(left_value > right_value);
    }
    else if (operator === '==') {
        return _to_boolean_Object_(left_value === right_value);
    }
    else if (operator === '!=') {
        return _to_boolean_Object_(left_value !== right_value);
    }
    else {
        return _new_error(_UNKNOWN_INFIX_OPERATOR, [object_1.ObjectType[left.type()], operator, object_1.ObjectType[right.type()]]);
    }
}
function _evaluate_minus_operator_expression(right) {
    if (right.type() !== object_1.ObjectType.INTEGER) {
        return _new_error(_UNKNOWN_PREFIX_OPERATOR, ['-', object_1.ObjectType[right.type()]]);
    }
    else {
        return new object_1.Integer(-right.value);
    }
}
function _evaluate_prefix_expression(operator, right) {
    if (operator === '!') {
        return _evaluate_bang_operator_expression(right);
    }
    else if (operator === '-') {
        return _evaluate_minus_operator_expression(right);
    }
    else {
        return _new_error(_UNKNOWN_PREFIX_OPERATOR, [operator, object_1.ObjectType[right.type()]]);
    }
}
function _new_error(message, args) {
    for (let arg of args) {
        message = message + " " + arg;
    }
    return new object_1.Error(message);
}
function _to_boolean_Object_(value) {
    return value ? TRUE : FALSE;
}
function _apply_function(fn, args) {
    if (fn.type() != object_1.ObjectType.FUNCTION) {
        return _new_error(_NOT_A_FUNCTION, [object_1.ObjectType[fn.type()]]);
    }
    else {
        let fn_ = fn;
        let extended_environment = _extend_function_environment(fn_, args);
        let evaluated = evaluate(fn_.body, extended_environment);
        return _unwrap_return_value(evaluated);
    }
}
function _extend_function_environment(fn, args) {
    let env = new object_1.Environment(fn.env);
    for (let idx = 0; idx < fn.parameters.length; idx++) {
        env.set(fn.parameters[idx].value, args[idx]);
    }
    return env;
}
function _unwrap_return_value(obj) {
    if (obj instanceof object_1.Return) {
        return obj.value;
    }
    return obj;
}
function _evaluate_expression(expressions, env) {
    let result = [];
    for (let expression of expressions) {
        let evaluated = evaluate(expression, env);
        result.push(evaluated);
    }
    return result;
}
function _evaluate_string_infix_expression(operator, left, right) {
    let left_value = left.value;
    let right_value = right.value;
    if (operator === '+') {
        return new object_1.String(left_value + right_value);
    }
    else if (operator === '==') {
        return _to_boolean_Object_(left_value === right_value);
    }
    else if (operator === '!=') {
        return _to_boolean_Object_(left_value !== right_value);
    }
    else {
        return _new_error(_UNKNOWN_INFIX_OPERATOR, [object_1.ObjectType[left.type()], operator, object_1.ObjectType[right.type()]]);
    }
}
