import type { IfStatement } from "../../ast";

import type { ExecutionContext } from "../execution-context";
import type { ExecutionFrame } from "./execution-frame";

import { BlockFrame } from "./block-frame";

export class IfFrame implements ExecutionFrame {

    readonly type = "IfFrame";

    private readonly block: BlockFrame;

    constructor(
        statement: IfStatement,
        context: ExecutionContext
    ) {
        const condition = context.evaluateExpression(
            statement.condition
        );

        const branch = context.isTruthy(condition)
            ? statement.thenBranch
            : statement.elseBranch;

        this.block = new BlockFrame(branch);
    }

    step(context: ExecutionContext): boolean {
        return this.block.step(context);
    }

    isComplete(): boolean {
        return this.block.isComplete();
    }

    get currentIndex(): number {
        return this.block.currentIndex;
    }
}