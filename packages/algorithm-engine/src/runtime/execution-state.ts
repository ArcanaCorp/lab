import type { RuntimeValue } from "./value";

export type ExecutionStatus =
    | "idle"
    | "running"
    | "paused"
    | "completed"
    | "error";

export interface ExecutionState {
    status: ExecutionStatus;
    currentStatement: number | null;
    variables: Record<string, RuntimeValue>;
    output: string[];
}