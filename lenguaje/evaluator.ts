import { error } from 'console';
import { ASTNode, ASTProgram, ASTBlock, ASTIdentifier, ASTIf, ASTBoolean, ASTCall, 
    ASTExpressionStatement, ASTFunction, ASTInteger, ASTInfix, ASTPrefix, ASTLetStatement,
     ASTStringLiteral, ASTReturnStatement, Expression, Statement } from './ast';
import { Boolean, Integer, Environment, Error, Function, Null, Object_, Return, String, ObjectType} from './object';

const TRUE = new Boolean(true);
const FALSE = new Boolean(false);
const NULL = new Null();

const _NOT_A_FUNCTION = 'No es una función: ';
const _TYPE_MISMATCH = 'Discrepancia de tipos: ';
const _UNKNOWN_PREFIX_OPERATOR = 'Operador prefijo desconocido: ';
const _UNKNOWN_INFIX_OPERATOR = 'Operador infijo desconocido: ';
const _UNKNOWN_IDENTIFIER = 'Identificador no encontrado: ';


export function evaluate(node: ASTNode, env: Environment): Object_ | null {
    if(node === null){
        return null;
    } else{
        let nodeType: string = node.constructor.name;
        switch (nodeType) {
            case "ASTProgram":
                return _evaluate_program(node as ASTProgram, env);
    
            case "ASTBlock":
                return _evaluate_block_statement(node as ASTBlock, env);
    
            case "ASTExpressionStatement":
                return evaluate((node as ASTExpressionStatement).expression, env);
    
            case "ASTInteger":
                return new Integer((node as ASTInteger).value);
    
            case "ASTBoolean":
                return (node as ASTBoolean).value ? TRUE : FALSE;
    
            case "ASTStringLiteral":
                return new String((node as ASTStringLiteral).value);
    
            case "ASTIdentifier":
                return _evaluate_identifier(node as ASTIdentifier, env);
    
            case "ASTIf":
                return _evaluate_if_expression(node as ASTIf, env);
    
            case "ASTInfix":
                return _evaluate_infix_expression((node as ASTInfix).operator, 
                evaluate((node as ASTInfix).left, env) as Object_, 
                evaluate((node as ASTInfix).right!, env) as Object_);
    
            case "ASTPrefix":
                return _evaluate_prefix_expression((node as ASTPrefix).operator, 
                evaluate((node as ASTPrefix).right!, env) as Object_);
    
            case "ASTReturnStatement":
                const returnValue = evaluate((node as ASTReturnStatement).returnValue!, env);
                return new Return(returnValue as Object_);
    
            case "ASTLetStatement":
                const letValue = evaluate((node as ASTLetStatement).value!, env);
                env.set((node as ASTLetStatement).name!.value, letValue as Object_);
    
            case "ASTFunction":
                return new Function((node as ASTFunction).parameters, (node as ASTFunction).body, env);
    
            case "ASTCall":
                const func = evaluate((node as ASTCall).function, env);
                const args = _evaluate_expression((node as ASTCall).arguments, env);
                return _apply_function(func as Object_, args as Object_[]);
            
            case "ASTProgram":
                return _evaluate_program(node as ASTProgram, env);
    
            default:
                return null;
        }
    }
}

function _evaluate_program(program: ASTProgram, env: Environment): Object_ | null {
    let result: Object_ | null = null;

    for (let statement of program.statements) {
        result = evaluate(statement, env);

        if (result instanceof Return) {
            return (result as Return).value;
        } else if (result instanceof Error) {
            return result;
        }
    }
    return result;
}

function _evaluate_bang_operator_expression(right: Object_): Object_ {
    if (right === TRUE) {
        return FALSE;
    } else if (right === FALSE) {
        return TRUE;
    } else if (right === NULL) {
        return TRUE;
    } else{
        return FALSE;
    }
}

function _evaluate_block_statement(block: ASTBlock, env: Environment): Object_ | null {
    let result: Object_ | null = null;

    for (let statement of block.statements) {
        result = evaluate(statement, env);
        
        if ((result as Object_) instanceof Return || (result as Object_) instanceof Error) {
            return result;
        }
    }
    return result;
}

function _evaluate_identifier(node: ASTIdentifier, env: Environment): Object_ {
    if(env.get(node.value) === null){
        return _new_error(_UNKNOWN_IDENTIFIER, [node.value]);
    } else{
        return env.get(node.value) as Object_;
    }
}

function _evaluate_if_expression(if_expression: ASTIf, env: Environment): Object_ | null {
    let condition = evaluate(if_expression.condition as ASTNode, env);

    if (_is_truthy(condition as Object_)) {
        return evaluate(if_expression.consequence as ASTNode, env);
    } else if(if_expression.alternative !== null) {
        return evaluate(if_expression.alternative as ASTNode, env);
    } else {
        return NULL;
    }
}

function _is_truthy(obj: Object_): boolean {
    if(obj === NULL){
        return false;
    } else if(obj === TRUE){
        return true;
    } else if (obj === FALSE){
        return false;
    } else {
        return true;
    }
}

function _evaluate_infix_expression(operator: string, left: Object_, right: Object_): Object_ {
    if(left.type() === ObjectType.INTEGER && right.type() === ObjectType.INTEGER){
        return _evaluate_integer_infix_expression(operator, left, right);
    } else if (left.type() === ObjectType.STRING && right.type() === ObjectType.STRING){
        return _evaluate_string_infix_expression(operator, left, right);
    } else if (operator === '=='){
        return _to_boolean_Object_(left === right);
    } else if (operator === '!='){
        return _to_boolean_Object_(left !== right);
    } else if (left.type() !== right.type()){
        return _new_error(_TYPE_MISMATCH, [ObjectType[left.type()], operator, ObjectType[right.type()]]);
    } else {
        return _new_error(_UNKNOWN_INFIX_OPERATOR, [ObjectType[left.type()], operator, ObjectType[right.type()]]);
    } 
}

function _evaluate_integer_infix_expression(operator: string, left: Object_, right: Object_): Object_ {
    let left_value: number = +(left as Integer).value;
    let right_value: number = +(right as Integer).value;

    if(operator === '+'){
        return new Integer((left_value as number) + (right_value as number));
    } else if(operator === '-'){
        return new Integer((left_value as number) - (right_value as number));
    } else if(operator === '*'){
        return new Integer((left_value as number) * (right_value as number));
    } else if(operator === '/'){
        return new Integer(Math.floor((left_value as number) / (right_value as number)));
    } else if(operator === '<'){
        return _to_boolean_Object_((left_value as number) < (right_value as number));
    } else if(operator === '>'){
        return _to_boolean_Object_((left_value as number) > (right_value as number));
    } else if(operator === '=='){
        return _to_boolean_Object_(left_value === right_value);
    } else if(operator === '!='){
        return _to_boolean_Object_(left_value !== right_value);
    } else {
        return _new_error(_UNKNOWN_INFIX_OPERATOR, [ObjectType[left.type()], operator, ObjectType[right.type()]]);
    }
}

function _evaluate_minus_operator_expression(right: Object_): Object_ {
    if(right.type() !== ObjectType.INTEGER){
        return _new_error(_UNKNOWN_PREFIX_OPERATOR, ['-', ObjectType[right.type()]]);
    } else {
        return new Integer(-(right as Integer).value);
    }
}

function _evaluate_prefix_expression(operator: string, right: Object_): Object_ {
    if(operator === '!'){
        return _evaluate_bang_operator_expression(right);
    } else if(operator === '-'){
        return _evaluate_minus_operator_expression(right);
    } else {
        return _new_error(_UNKNOWN_PREFIX_OPERATOR, [operator, ObjectType[right.type()]]);
    }
}

function _new_error(message: string, args: any[]): Error {
    for(let arg of args){
        message = message+" "+arg;
    }
    return new Error(message)
}

function _to_boolean_Object_(value: boolean): Boolean {
    return value ? TRUE : FALSE;
}

function _apply_function(fn: Object_, args: Object_[]): Object_ {
    if(fn.type() != ObjectType.FUNCTION){
        return _new_error(_NOT_A_FUNCTION, [ObjectType[fn.type()]]);
    } else{
        let fn_ = fn as Function;
        let extended_environment = _extend_function_environment(fn_, args);
        let evaluated = evaluate(fn_.body, extended_environment);

        return _unwrap_return_value(evaluated as Object_);
    }
}

function _extend_function_environment(fn: Function, args: Object_[]): Environment {
    let env = new Environment(fn.env);
    for(let idx = 0; idx < fn.parameters.length; idx++){
        env.set(fn.parameters[idx].value, args[idx]);
    }
    return env;
}

function _unwrap_return_value(obj: Object_): Object_ {
    if(obj instanceof Return){
        return (obj as Return).value;
    }
    return obj;
}

function _evaluate_expression(expressions: ASTNode[], env: Environment): Object_[] {
    let result: Object_[] = [];
    for(let expression of expressions){
        let evaluated = evaluate(expression, env);
        result.push(evaluated as Object_);
    }
    return result;
}

function _evaluate_string_infix_expression(operator: string, left: Object_, right: Object_): Object_ {
    let left_value: string = (left as String).value;
    let right_value: string = (right as String).value;

    if (operator === '+') {
        return new String(left_value + right_value);
    } else if (operator === '==') {
        return _to_boolean_Object_(left_value === right_value);
    } else if (operator === '!=') {
        return _to_boolean_Object_(left_value !== right_value);
    } else{
        return _new_error(_UNKNOWN_INFIX_OPERATOR, [ObjectType[left.type()], operator, ObjectType[right.type()]]);
    }
}