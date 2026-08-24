import type { ExecutionContext } from "../execution-context";

export interface ExecutionFrame {
    readonly type: string;

    step(context: ExecutionContext): boolean;

    isComplete(): boolean;
}