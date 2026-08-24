import type { BaseNode } from "./nodes";
import type { PrimitiveType } from "./types";

export interface VariableDeclaration extends BaseNode {
    type: "VariableDeclaration";

    name: string;
    dataType: PrimitiveType;
}