import { Environment } from "./environment";
import type { RuntimeValue } from "./value";

export class ExecutionContext {
    readonly environment: Environment;
    readonly output: string[];

    constructor() {
        this.environment = new Environment();
        this.output = [];
    }

    reset(): void {
        this.environment.clear();
        this.output.length = 0;
    }

    getVariables(): Record<string, RuntimeValue> {
        return this.environment.snapshot();
    }

    getOutput(): string[] {
        return [...this.output];
    }
}