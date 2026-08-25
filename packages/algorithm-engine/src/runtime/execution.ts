import type { Program } from "../ast";
import { ExecutionContext } from "./execution-context";
import type { ExecutionState } from "./execution-state";
import type { RuntimeValue } from "./value";

import { ProgramFrame } from "./frames/program-frame";
import type { ExecutionFrame } from "./frames/execution-frame";

export class Execution {

    private readonly program: Program;
    private readonly context: ExecutionContext;

    private readonly frames: ExecutionFrame[] = [];

    private status: ExecutionState["status"] = "idle";

    private inputCompleted = false;

    constructor(program: Program) {
        this.program = program;
        this.context = new ExecutionContext();
    }

    start(): ExecutionState {
        this.context.reset();

        this.frames.length = 0;

        this.frames.push(
            new ProgramFrame(this.program)
        );

        this.status = "paused";

        return this.getState();
    }

    step(): ExecutionState {
        if (this.status === "idle") {
            this.start();
        }

        if (
            this.status === "completed" ||
            this.status === "error"
        ) {
            return this.getState();
        }

        const frame = this.frames[
            this.frames.length - 1
        ];

        if (!frame) {
            this.status = "completed";
            return this.getState();
        }

        this.status = "running";

        frame.step(this.context);

        if (this.context.isWaitingForInput()) {
            this.status = "waiting-input";

            return this.getState();
        }

        if (frame.isComplete()) {
            this.frames.pop();
        }

        if (this.frames.length === 0) {
            this.status = "completed";
        } else {
            this.status = "paused";
        }

        return this.getState();
    }

    run(): ExecutionState {
        if (this.status === "idle") {
            this.start();
        }

        while (
            this.status !== "completed" &&
            this.status !== "error" &&
            this.status !== "waiting-input"
        ) {
            this.step();
        }

        return this.getState();
    }

    reset(): ExecutionState {
        this.context.reset();

        this.frames.length = 0;

        this.status = "idle";

        return this.getState();
    }

    getState(): ExecutionState {

        const state: ExecutionState = {
            status: this.status,

            currentStatement:
                this.status === "idle"
                    ? 0
                    : this.status === "completed"
                        ? null
                        : this.getCurrentStatementIndex(),

            variables: this.context.getVariables(),

            output: this.context.getOutput()
        };

        if (this.context.isWaitingForInput()) {
            state.inputRequest = {
                variable: this.context.getInputVariable()!
            };
        }

        return state;
    }

    private getCurrentStatementIndex(): number | null {
        
        const frame = this.frames[
            this.frames.length - 1
        ];

        if (frame instanceof ProgramFrame) {
            return frame.currentIndex;
        }

        return null;
    }
    
    provideInput(value: string): ExecutionState {
        this.context.provideInput(value);

        this.status = "paused";

        return this.getState();
    }

    consumeInputCompleted(): boolean {
        if (!this.inputCompleted) {
            return false;
        }

        this.inputCompleted = false;

        return true;
    }

}