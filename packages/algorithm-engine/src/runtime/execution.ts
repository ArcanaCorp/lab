import type { Program, Statement } from "../ast";

import { Runtime } from "./runtime";

import { ExecutionContext } from "./execution-context";

import type { ExecutionState } from "./execution-state";

export class Execution {

    private readonly program: Program;
    private readonly context: ExecutionContext;

    private statementIndex = 0;

    private status: ExecutionState["status"] = "idle";

    constructor(program: Program) {
        this.program = program;
        this.context = new ExecutionContext();
    }

    start(): ExecutionState {
        this.context.reset();

        this.statementIndex = 0;
        this.status = "paused";

        return this.getState();
    }

    step(): ExecutionState {
        if (this.status === "idle") {
            this.start();
        }

        if (this.status === "completed") {
            return this.getState();
        }

        const statement = this.getCurrentStatement();

        if (!statement) {
            this.status = "completed";

            return this.getState();
        }

        this.status = "running";

        this.executeStatement(statement);

        this.statementIndex++;

        if (this.statementIndex >= this.program.body.length) {
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

        while (this.status !== "completed") {
            this.step();
        }

        return this.getState();
    }

    reset(): ExecutionState {
        this.context.reset();

        this.statementIndex = 0;
        this.status = "idle";

        return this.getState();
    }

    getState(): ExecutionState {
        return {
            status: this.status,
            currentStatement:
                this.status === "completed"
                    ? null
                    : this.statementIndex,
            variables: this.context.getVariables(),
            output: this.context.getOutput()
        };
    }

    private getCurrentStatement(): Statement | null {
        return this.program.body[
            this.statementIndex
        ] ?? null;
    }

    private executeStatement(statement: Statement): void {
        const singleProgram: Program = {
            ...this.program,
            body: [statement]
        };

        const runtime = new Runtime(
            {
                preserveState: true
            },
            this.context.environment,
            this.context.output
        );

        runtime.execute(singleProgram);
    }
    
}