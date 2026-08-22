import type { BaseNode } from "./nodes";

export type Expression = | LiteralExpression | IdentifierExpression | BinaryExpression | UnaryExpression;

export interface LiteralExpression extends BaseNode {
    type: "LiteralExpression";
    value: number | string | boolean;
    dataType: "Integer" | "Real" | "Caracter" | "Logico";
}

export interface IdentifierExpression extends BaseNode {
    type: "IdentifierExpression";
    name: string;
}

export type BinaryOperator = | "+" | "-" | "*" | "/" | "%" | ">" | ">=" | "<" | "<=" | "=" | "<>" | "Y" | "O";

export interface BinaryExpression extends BaseNode {
    type: "BinaryExpression";

    operator: BinaryOperator;

    left: Expression;
    right: Expression;
}

export type UnaryOperator = | "-" | "NO";

export interface UnaryExpression extends BaseNode {
    type: "UnaryExpression";

    operator: UnaryOperator;

    operand: Expression;
}