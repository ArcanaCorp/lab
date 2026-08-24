import type { Expression } from "./expressions";
import type { BaseNode } from "./nodes";
import type { PrimitiveType } from "./types";

export interface Program extends BaseNode {
    type: "Program";

    name: string;

    body: Statement[];
}

export type Statement = | VariableDeclaration | Assignment | InputStatement | OutputStatement | IfStatement | WhileStatement | ForStatement;

export interface VariableDeclaration extends BaseNode {
    type: "VariableDeclaration";

    name: string;

    dataType: PrimitiveType;
}

export interface Assignment extends BaseNode {
    type: "Assignment";

    variable: string;

    value: Expression;
}

export interface InputStatement extends BaseNode {
    type: "InputStatement";

    variable: string;
}

export interface OutputStatement extends BaseNode {
    type: "OutputStatement";

    expression: Expression;
}

export interface IfStatement extends BaseNode {
    type: "IfStatement";

    condition: Expression;

    thenBranch: Statement[];

    elseBranch: Statement[];
}

export interface WhileStatement extends BaseNode {
    type: "WhileStatement";

    condition: Expression;

    body: Statement[];
}

export interface ForStatement extends BaseNode {
    type: "ForStatement";
    variable: string;
    start: Expression;
    end: Expression;
    step: Expression;
    body: Statement[];
}