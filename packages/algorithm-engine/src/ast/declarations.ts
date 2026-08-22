import type { BaseNode } from "./nodes";

export type PrimitiveType = | "Integer" | "Real" | "String" | "Boolean";

export interface VariableDeclaration extends BaseNode {
    type: "VariableDeclaration";

    name: string;
    dataType: PrimitiveType;
}