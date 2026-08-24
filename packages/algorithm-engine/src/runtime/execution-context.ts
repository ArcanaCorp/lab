import type { Statement } from "../ast";

import { Environment } from "./environment";
import { Runtime } from "./runtime";

import type { RuntimeValue } from "./value";

export class ExecutionContext {
    readonly environment: Environment;
    readonly output: string[];

    private readonly runtime: Runtime;

    constructor() {
        this.environment = new Environment();
        this.output = [];

        this.runtime = new Runtime(
            {
                preserveState: true
            },
            this.environment,
            this.output
        );
    }

    reset(): void {
        this.environment.clear();
        this.output.length = 0;
    }

    executeStatement(statement: Statement): void {
        this.runtime.executeStatement(statement);
    }

    getVariables(): Record<string, RuntimeValue> {
        return this.environment.snapshot();
    }

    getOutput(): string[] {
        return [...this.output];
    }
}