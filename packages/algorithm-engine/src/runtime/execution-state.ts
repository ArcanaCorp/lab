import type { RuntimeValue } from "./value";

export type ExecutionStatus =
    | "idle"
    | "running"
    | "paused"
    | "waiting-input"
    | "completed"
    | "error";

export interface ExecutionState {
    status: ExecutionStatus;

    currentStatement: number | null;

    variables: Record<string, RuntimeValue>;

    output: string[];

    inputRequest?: {
        variable: string;
    };
}